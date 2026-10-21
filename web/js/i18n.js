/* Lightweight i18n for the IMU web console (zh / en). */

const DICT = {
  zh: {
    'app.subtitle': 'ICM42670P · 高精度 IMU 惯导模块',

    'status.off': '未连接',
    'status.connecting': '连接中…',
    'status.on': '已连接',
    'status.lost': '设备已断开',
    'status.error': '连接失败',

    'port.label': '串口设备 · 115200',
    'port.choose': '选择串口设备…',
    'port.device': '串口设备',

    'algo.label': '融合算法',
    'algo.6': '6 轴',
    'algo.9': '9 轴',
    'algo.10': '10 轴',

    'decl.label': '磁偏角',
    'pitchflip.label': '俯仰翻转',
    'compassinvert.label': '罗盘反向',
    'connect': '连接',
    'disconnect': '断开',

    'conn.hint': '选择串口设备并连接，开始实时监测与校准。',
    'conn.serialSource': '串口',
    'conn.reading': '正在读取设备信息…',
    'conn.firmware': '固件 {0}',
    'conn.axes': '已识别 {0} 轴 IMU',
    'conn.algo': '融合算法 {0} 轴',
    'conn.noData': '已连接，但暂未收到数据帧，请检查设备与波特率',
    'conn.waiting': '等待数据…',

    'tabs.monitor': '数据监测',
    'tabs.plots': '实时曲线',
    'tabs.attitude': '3D 姿态',
    'tabs.instruments': '动态仪表',
    'tabs.calibrate': '校准',

    'monitor.accel': '加速度计',
    'monitor.gyro': '陀螺仪',
    'monitor.mag': '磁力计',
    'monitor.euler': '欧拉角',
    'monitor.quat': '四元数',
    'monitor.baro': '气压计',
    'monitor.height': '高度 (m)',
    'monitor.temp': '温度 (℃)',
    'monitor.press': '气压 (hPa)',
    'monitor.refPress': '参考气压 (hPa)',

    'units.g': 'g',
    'units.rads': 'rad/s',
    'units.ut': 'μT',
    'units.deg': '°',
    'units.quat': '1',
    'units.baro': 'm · ℃ · hPa',

    'euler.roll': 'Roll',
    'euler.pitch': 'Pitch',
    'euler.yaw': 'Yaw',

    'plots.accel': '加速度计 (g)',
    'plots.gyro': '陀螺仪 (rad/s)',
    'plots.mag': '磁力计 (μT)',
    'plots.euler': '欧拉角 (°)',
    'plots.pause': '暂停',
    'plots.resume': '继续',
    'plots.clear': '清空',
    'plots.paused': '已暂停',
    'plots.empty': '等待数据…',
    'plots.samples': '采样点',

    'attitude.zero': '标定当前位置',
    'attitude.resetZero': '重置标定',
    'attitude.hint': '拖拽旋转视角 · 滚轮缩放',
    'attitude.zeroed': '零位已标定',

    'instr.compass': '指南针',
    'instr.horizon': '人工地平仪',
    'instr.heading': '航向角',
    'instr.pitch': '俯仰',
    'instr.roll': '横滚',
    'instr.horizonHint': '地平线在上 = 抬头',

    'cal.title': '传感器校准',
    'cal.badge': '设备 Flash 保存',
    'cal.intro': '校准值保存在设备 Flash 中。请在连接设备后按下方指引逐项执行，校准过程中保持设备稳定并远离磁干扰。',
    'cal.imuName': '整体校准',
    'cal.imuDesc': '设备静止平放于水平面，消除加速度计与陀螺仪零偏。',
    'cal.magName': '磁力计校准',
    'cal.magDesc': '缓慢转动设备走“8”字轨迹，进行椭球拟合。',
    'cal.tempName': '温度校准',
    'cal.tempDesc': '输入标准温度计读数，校正温度传感器。',
    'cal.resetName': '重置校准数据',
    'cal.resetDesc': '清空设备内已保存的全部校准值，谨慎操作。',
    'cal.actions': '校准操作',
    'cal.ready': '就绪',
    'cal.running': '校准中…',
    'cal.imuTile': '静止平放 · 约 5 秒',
    'cal.magTile': '8 字转动 · 10–30 秒',
    'cal.resetTile': '清空 Flash 校准数据',
    'cal.tempLabel': '当前环境温度',
    'cal.tempStart': '开始温度校准',
    'cal.logTitle': '执行日志',
    'cal.clearLog': '清空',
    'cal.logReady': '等待操作…',
    'cal.logCleared': '日志已清空',
    'cal.start': '开始校准：{0}',
    'cal.keepStill': '请保持设备静止平放…',
    'cal.figure8': '请缓慢转动设备走“8”字轨迹…',
    'cal.done': '校准完成（状态 {0}）',
    'cal.doneNoStatus': '校准指令已发送，未收到设备状态回执',
    'cal.timeout': '等待设备响应超时',
    'cal.fail': '校准失败：{0}',
    'cal.resetDone': '校准数据已重置',
    'cal.resetConfirm': '确定要清空设备内保存的全部校准数据吗？此操作不可撤销，重置后需要重新校准。',
    'cal.notConnected': '请先连接 IMU 设备',
    'cal.busy': '已有校准任务正在进行，请稍候',
    'cal.tempInvalid': '温度需在 -50 ℃ 到 50 ℃ 之间',

    'msg.serialUnsupported': '当前浏览器不支持 Web Serial。请使用 Chrome / Edge 桌面版，并通过 HTTPS 或 localhost 打开。',
    'msg.connectFail': '连接失败：{0}',
    'msg.lost': '设备已断开，请检查 USB 连接',
    'msg.noData': '连接成功，但未收到数据帧。请确认设备已上电、波特率 115200。',
    'msg.portPicked': '已选择串口设备',

    'lang.switchTitle': 'Switch to English',
    'footer.note': 'JuxiTech · 支持 Chrome / Edge 桌面版 · 串口 115200 · Web Serial 需 HTTPS 或 localhost'
  },

  en: {
    'app.subtitle': 'ICM42670P · High-Precision IMU Module',

    'status.off': 'Not connected',
    'status.connecting': 'Connecting…',
    'status.on': 'Connected',
    'status.lost': 'Device disconnected',
    'status.error': 'Connection failed',

    'port.label': 'Serial port · 115200',
    'port.choose': 'Choose serial device…',
    'port.device': 'Serial device',

    'algo.label': 'Fusion',
    'algo.6': '6-axis',
    'algo.9': '9-axis',
    'algo.10': '10-axis',

    'decl.label': 'Declination',
    'pitchflip.label': 'Pitch flip',
    'compassinvert.label': 'Compass invert',
    'connect': 'Connect',
    'disconnect': 'Disconnect',

    'conn.hint': 'Choose a serial device and connect to start monitoring and calibration.',
    'conn.serialSource': 'Serial',
    'conn.reading': 'Reading device information…',
    'conn.firmware': 'Firmware {0}',
    'conn.axes': 'Detected {0}-axis IMU',
    'conn.algo': 'Fusion {0}-axis',
    'conn.noData': 'Connected, but no data frames received. Check the device and baud rate.',
    'conn.waiting': 'Waiting for data…',

    'tabs.monitor': 'Monitor',
    'tabs.plots': 'Plots',
    'tabs.attitude': '3D Attitude',
    'tabs.instruments': 'Instruments',
    'tabs.calibrate': 'Calibration',

    'monitor.accel': 'Accelerometer',
    'monitor.gyro': 'Gyroscope',
    'monitor.mag': 'Magnetometer',
    'monitor.euler': 'Euler Angles',
    'monitor.quat': 'Quaternion',
    'monitor.baro': 'Barometer',
    'monitor.height': 'Height (m)',
    'monitor.temp': 'Temp (℃)',
    'monitor.press': 'Pressure (hPa)',
    'monitor.refPress': 'Ref pressure (hPa)',

    'units.g': 'g',
    'units.rads': 'rad/s',
    'units.ut': 'μT',
    'units.deg': '°',
    'units.quat': '1',
    'units.baro': 'm · ℃ · hPa',

    'euler.roll': 'Roll',
    'euler.pitch': 'Pitch',
    'euler.yaw': 'Yaw',

    'plots.accel': 'Accelerometer (g)',
    'plots.gyro': 'Gyroscope (rad/s)',
    'plots.mag': 'Magnetometer (μT)',
    'plots.euler': 'Euler Angles (°)',
    'plots.pause': 'Pause',
    'plots.resume': 'Resume',
    'plots.clear': 'Clear',
    'plots.paused': 'Paused',
    'plots.empty': 'Waiting for data…',
    'plots.samples': 'Samples',

    'attitude.zero': 'Calibrate zero',
    'attitude.resetZero': 'Reset zero',
    'attitude.hint': 'Drag to rotate view · scroll to zoom',
    'attitude.zeroed': 'Zero calibrated',

    'instr.compass': 'Compass',
    'instr.horizon': 'Attitude Indicator',
    'instr.heading': 'Heading',
    'instr.pitch': 'Pitch',
    'instr.roll': 'Roll',
    'instr.horizonHint': 'Horizon up = nose up',

    'cal.title': 'Sensor Calibration',
    'cal.badge': 'Stored in device flash',
    'cal.intro': 'Calibration values are stored in the device flash. With the device connected, follow the guide below and keep the device steady, away from magnetic interference.',
    'cal.imuName': 'IMU Calibration',
    'cal.imuDesc': 'Keep the device still and level to remove accelerometer and gyroscope bias.',
    'cal.magName': 'Magnetometer Calibration',
    'cal.magDesc': 'Slowly rotate the device in a figure-8 for ellipsoid fitting.',
    'cal.tempName': 'Temperature Calibration',
    'cal.tempDesc': 'Enter a reference thermometer reading to correct the temperature sensor.',
    'cal.resetName': 'Reset Calibration',
    'cal.resetDesc': 'Clear all calibration values stored in the device. Use with caution.',
    'cal.actions': 'Calibration Actions',
    'cal.ready': 'Ready',
    'cal.running': 'Calibrating…',
    'cal.imuTile': 'Still & level · ~5 s',
    'cal.magTile': 'Figure-8 · 10–30 s',
    'cal.resetTile': 'Clear flash calibration data',
    'cal.tempLabel': 'Ambient temperature',
    'cal.tempStart': 'Calibrate temperature',
    'cal.logTitle': 'Activity Log',
    'cal.clearLog': 'Clear',
    'cal.logReady': 'Waiting for actions…',
    'cal.logCleared': 'Log cleared',
    'cal.start': 'Start calibration: {0}',
    'cal.keepStill': 'Keep the device still and level…',
    'cal.figure8': 'Slowly rotate the device in a figure-8…',
    'cal.done': 'Calibration done (status {0})',
    'cal.doneNoStatus': 'Calibration command sent; no status response received',
    'cal.timeout': 'Timed out waiting for the device',
    'cal.fail': 'Calibration failed: {0}',
    'cal.resetDone': 'Calibration data reset',
    'cal.resetConfirm': 'Clear all calibration data stored in the device? This cannot be undone and requires recalibration.',
    'cal.notConnected': 'Please connect an IMU device first',
    'cal.busy': 'A calibration task is already running, please wait',
    'cal.tempInvalid': 'Temperature must be between -50 ℃ and 50 ℃',

    'msg.serialUnsupported': 'Web Serial is not available in this browser. Use desktop Chrome / Edge over HTTPS or localhost.',
    'msg.connectFail': 'Connection failed: {0}',
    'msg.lost': 'Device disconnected. Check the USB connection.',
    'msg.noData': 'Connected, but no data frames received. Make sure the device is powered and the baud rate is 115200.',
    'msg.portPicked': 'Serial device selected',

    'lang.switchTitle': '切换到中文',
    'footer.note': 'JuxiTech · Desktop Chrome / Edge · serial 115200 · Web Serial requires HTTPS or localhost'
  }
};

const STORAGE_KEY = 'jx.imu.lang';
let current = 'zh';

export function initI18n() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* ignore */ }
  current = saved === 'en' || saved === 'zh' ? saved : 'zh';
  applyI18n();
  document.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en';
  document.title = 'JX IMU Studio · ' + t('app.subtitle');
}

export function getLang() { return current; }

export function t(key, ...args) {
  const table = DICT[current] || DICT.zh;
  let text = table[key];
  if (text === undefined) text = DICT.zh[key];
  if (text === undefined) return key;
  return text.replace(/\{(\d+)\}/g, (m, idx) => {
    const v = args[Number(idx)];
    return v === undefined ? m : String(v);
  });
}

export function setLang(lang) {
  if (lang !== 'zh' && lang !== 'en') return;
  current = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }
  applyI18n();
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = 'JX IMU Studio · ' + t('app.subtitle');
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function toggleLang() {
  setLang(current === 'zh' ? 'en' : 'zh');
}

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}
