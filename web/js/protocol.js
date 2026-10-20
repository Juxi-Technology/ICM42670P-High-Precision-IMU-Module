/* IMU serial protocol over the Web Serial API.
 * Frame format: 0x7E 0x23 <len> <function> <data...> <checksum>
 * Checksum = low byte of the sum of all preceding bytes.
 */

export const CMD = {
  VERSION: 0x01,
  RAW_IMU: 0x04,
  QUATERNION: 0x16,
  EULER: 0x26,
  BAROMETER: 0x32,
  REPORT_RATE: 0x60,
  ALGORITHM: 0x61,
  CALIB_IMU: 0x70,
  CALIB_MAG: 0x71,
  CALIB_BARO: 0x72,
  CALIB_TEMP: 0x73,
  REQUEST: 0x80,
  RETURN_STATE: 0x81,
  RESET_FLASH: 0xA0
};

const HEADER1 = 0x7E;
const HEADER2 = 0x23;
const MAX_RX_LENGTH = 40;
const RAD_TO_DEG = 57.29577951308232;
const ACCEL_RATIO = 16 / 32767;
const GYRO_RATIO = (2000 / 32767) * (Math.PI / 180);
const MAG_RATIO = 800 / 32767;

export const BAUD_RATE = 115200;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function buildCommand(fn, ...data) {
  const bytes = [HEADER1, HEADER2, 0x00, fn & 0xff, ...data.map((b) => b & 0xff)];
  bytes[2] = bytes.length + 1;
  let sum = 0;
  for (const b of bytes) sum += b;
  bytes.push(sum & 0xff);
  return bytes;
}

class BaseSession {
  constructor() {
    this.data = {
      accel: [0, 0, 0],
      gyro: [0, 0, 0],
      mag: [0, 0, 0],
      euler: [0, 0, 0], // radians
      quat: [0, 0, 0, 0],
      baro: [0, 0, 0, 0]
    };
    this.version = null;
    this.fusionAlgo = null;
    this.sensorFrameSeen = false;
    this._frames = 0;
    this.onError = null;
  }

  get frameCount() { return this._frames; }

  get hasData() { return this.sensorFrameSeen; }

  snapshot() {
    if (!this.sensorFrameSeen) return null;
    const baro = this.data.baro.slice();
    // Firmware reports pressure in Pa; display in hPa (as the desktop app does).
    if (baro[2] > 1000) baro[2] /= 100;
    if (baro[3] > 1000) baro[3] /= 100;
    return {
      accel: this.data.accel.slice(),
      gyro: this.data.gyro.slice(),
      mag: this.data.mag.slice(),
      attitude: this.data.euler.map((v) => v * RAD_TO_DEG),
      quat: this.data.quat.slice(),
      baro
    };
  }
}

export class ImuSerial extends BaseSession {
  constructor(port) {
    super();
    this.port = port;
    this._reader = null;
    this._writer = null;
    this._readDone = null;
    this._closing = false;
    this._st = 0;
    this._buf = null;
    this._versionWaiters = [];
    this._stateWaiters = [];
  }

  async connect() {
    await this.port.open({ baudRate: BAUD_RATE, dataBits: 8, stopBits: 1, parity: 'none', flowControl: 'none' });
    this._reader = this.port.readable.getReader();
    this._writer = this.port.writable.getWriter();
    this._readDone = this._readLoop();
  }

  async _readLoop() {
    try {
      while (!this._closing) {
        const { value, done } = await this._reader.read();
        if (done) break;
        if (value && value.length) this._feed(value);
      }
    } catch (err) {
      if (!this._closing && this.onError) this.onError(err);
    } finally {
      try { this._reader.releaseLock(); } catch (_) { /* ignore */ }
    }
  }

  _feed(bytes) {
    for (let i = 0; i < bytes.length; i += 1) {
      const b = bytes[i];
      switch (this._st) {
        case 0:
          if (b === HEADER1) {
            this._buf = [HEADER1];
            this._st = 1;
          }
          break;
        case 1:
          if (b === HEADER2) {
            this._buf.push(HEADER2);
            this._st = 2;
          } else {
            this._st = 0;
            this._buf = null;
          }
          break;
        case 2:
          if (b >= 5 && b <= MAX_RX_LENGTH) {
            this._buf.push(b);
            this._st = 3;
          } else {
            this._st = 0;
            this._buf = null;
          }
          break;
        case 3:
          this._buf.push(b);
          if (this._buf.length === this._buf[2]) {
            const frame = this._buf;
            this._buf = null;
            this._st = 0;
            this._handleFrame(frame);
          }
          break;
        default:
          this._st = 0;
          this._buf = null;
      }
    }
  }

  _handleFrame(frame) {
    let sum = 0;
    for (let i = 0; i < frame.length - 1; i += 1) sum += frame[i];
    if ((sum & 0xff) !== frame[frame.length - 1]) return;

    this._frames += 1;
    const fn = frame[3];    const payload = frame.slice(4, -1);
    const view = new DataView(Uint8Array.from(payload).buffer);

    switch (fn) {
      case CMD.RAW_IMU:
        if (payload.length < 18) return;
        for (let axis = 0; axis < 3; axis += 1) {
          this.data.accel[axis] = view.getInt16(axis * 2, true) * ACCEL_RATIO;
          this.data.gyro[axis] = view.getInt16(6 + axis * 2, true) * GYRO_RATIO;
          this.data.mag[axis] = view.getInt16(12 + axis * 2, true) * MAG_RATIO;
        }
        this.sensorFrameSeen = true;
        break;
      case CMD.EULER:
        if (payload.length < 12) return;
        for (let axis = 0; axis < 3; axis += 1) {
          this.data.euler[axis] = view.getFloat32(axis * 4, true);
        }
        this.sensorFrameSeen = true;
        break;
      case CMD.QUATERNION:
        if (payload.length < 16) return;
        for (let i = 0; i < 4; i += 1) this.data.quat[i] = view.getFloat32(i * 4, true);
        this.sensorFrameSeen = true;
        break;
      case CMD.BAROMETER:
        if (payload.length < 16) return;
        for (let i = 0; i < 4; i += 1) this.data.baro[i] = view.getFloat32(i * 4, true);
        this.sensorFrameSeen = true;
        break;
      case CMD.VERSION:
        if (payload.length < 3) return;
        this.version = `V${payload[0]}.${payload[1]}.${payload[2]}`;
        this._versionWaiters.splice(0).forEach((resolve) => resolve(this.version));
        break;
      case CMD.ALGORITHM:
        if (payload.length >= 1) this.fusionAlgo = payload[0];
        break;
      case CMD.RETURN_STATE:
        if (payload.length >= 2) this._resolveState(payload[0], payload[1]);
        break;
      default:
        break;
    }
  }

  async send(bytes) {
    if (!this._writer || this._closing) throw new Error('Serial port is not open');
    await this._writer.write(new Uint8Array(bytes));
  }

  async requestVersion(timeoutMs = 800) {
    this.version = null;
    const pending = new Promise((resolve) => {
      const entry = (value) => { clearTimeout(timer); resolve(value); };
      const timer = setTimeout(() => {
        const idx = this._versionWaiters.indexOf(entry);
        if (idx >= 0) this._versionWaiters.splice(idx, 1);
        resolve(null);
      }, timeoutMs);
      this._versionWaiters.push(entry);
    });
    await this.send(buildCommand(CMD.REQUEST, CMD.VERSION, 0x00));
    return pending;
  }

  _resolveState(fn, state) {
    this.lastState = { fn, state };
    for (const waiter of this._stateWaiters.slice()) {
      if (waiter.fn === fn) waiter.resolve(state);
    }
  }

  _waitState(fn, timeoutMs) {
    return new Promise((resolve) => {
      const waiter = { fn, resolve: null };
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        const idx = this._stateWaiters.indexOf(waiter);
        if (idx >= 0) this._stateWaiters.splice(idx, 1);
        resolve(value);
      };
      const timer = setTimeout(() => finish(null), timeoutMs);
      waiter.resolve = finish;
      this._stateWaiters.push(waiter);
    });
  }

  async setReportRate(rate) {
    const value = Math.round(Math.max(10, Math.min(100, Number(rate) || 100)));
    await this.send(buildCommand(CMD.REPORT_RATE, value, 0x5f));
    await sleep(150);
  }

  async setFusionAlgorithm(algo) {
    const value = algo === 10 ? 9 : algo; // firmware only implements 6 / 9
    if (value !== 6 && value !== 9) return;
    this.fusionAlgo = value;
    await this.send(buildCommand(CMD.ALGORITHM, value, 0x5f));
    await sleep(150);
  }

  async calibrate(type, temperature) {
    if (type === 'imu') {
      const pending = this._waitState(CMD.CALIB_IMU, 12000);
      await this.send(buildCommand(CMD.CALIB_IMU, 0x01, 0x5f));
      return { status: await pending };
    }
    if (type === 'mag') {
      const pending = this._waitState(CMD.CALIB_MAG, 60000);
      await this.send(buildCommand(CMD.CALIB_MAG, 0x01, 0x5f));
      return { status: await pending };
    }
    if (type === 'temp') {
      const temp = Number(temperature);
      const raw = Math.max(-32768, Math.min(32767, Math.round(temp * 100)));
      const lo = raw & 0xff;
      const hi = (raw >> 8) & 0xff;
      const pending = this._waitState(CMD.CALIB_TEMP, 6000);
      await this.send(buildCommand(CMD.CALIB_TEMP, lo, hi, 0x5f));
      return { status: await pending };
    }
    if (type === 'reset') {
      await this.send(buildCommand(CMD.RESET_FLASH, 0x01, 0x5f));
      await sleep(1000);
      return { reset: true };
    }
    throw new Error(`Unknown calibration type: ${type}`);
  }

  async close() {
    this._closing = true;
    for (const waiter of this._stateWaiters.splice(0)) waiter.resolve(null);
    for (const waiter of this._versionWaiters.splice(0)) waiter(null);
    try { await this._reader?.cancel(); } catch (_) { /* ignore */ }
    try { await this._readDone; } catch (_) { /* ignore */ }
    try { this._writer?.releaseLock(); } catch (_) { /* ignore */ }
    try { await this.port.close(); } catch (_) { /* ignore */ }
  }
}
