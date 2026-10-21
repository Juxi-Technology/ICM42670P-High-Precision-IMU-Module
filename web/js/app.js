/* JX IMU Studio — application controller. */

import { t, initI18n, getLang, toggleLang } from './i18n.js';
import { ImuSerial } from './protocol.js';
import { PlotView } from './chart.js';
import { drawCompass, drawHorizon } from './gauges.js';
import { Attitude3D } from './attitude3d.js';
import { fmtNumber, mod360 } from './canvas.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CAL_NAME_KEYS = {
  imu: 'cal.imuName',
  mag: 'cal.magName',
  temp: 'cal.tempName',
  reset: 'cal.resetName'
};

const MONITOR_META = {
  accel: { digits: 4, scale: [16, 16, 16] },
  gyro: { digits: 4, scale: [34.9066, 34.9066, 34.9066] },
  mag: { digits: 4, scale: [800, 800, 800] },
  attitude: { digits: 2, scale: [180, 180, 360] },
  quat: { digits: 4, scale: [1, 1, 1, 1] },
  baro: { digits: 2 }
};

const state = {
  serialSupported: false,
  port: null,
  portName: '',
  session: null,
  connected: false,
  connecting: false,
  statusKind: 'off',
  firmware: null,
  hardwareAxes: null,
  appliedAlgo: null,
  rate: 0,
  activeTab: 'monitor',
  plotGroup: 'accel',
  plotPaused: false,
  calBusy: false,
  attitude: { roll: 0, pitch: 0, yaw: 0 },
  lastFrames: 0,
  lastRateTime: 0
};

const els = {};
const valueEls = new Map();
const barEls = new Map();

let plotView = null;
let att3d = null;
let plotDirty = true;
let lastRenderAt = 0;

init();

function init() {
  initI18n();

  els.portField = $('#portField');
  els.portBtn = $('#portBtn');
  els.portLabel = $('#portLabel');
  els.algoSelect = $('#algoSelect');
  els.declInput = $('#declInput');
  els.pitchFlip = $('#pitchFlip');
  els.compassInvert = $('#compassInvert');
  els.connectBtn = $('#connectBtn');
  els.connectBtnText = $('#connectBtnText');
  els.connInfo = $('#connInfo');
  els.statusPill = $('#statusPill');
  els.statusText = $('#statusText');
  els.langBtn = $('#langBtn');
  els.tabs = $('.tabs');
  els.tabButtons = $$('.tab-btn');
  els.panels = $$('.tab-panel');
  els.toasts = $('#toasts');

  els.plotCanvas = $('#plotCanvas');
  els.plotGroups = $('#plotGroups');
  els.plotPauseBtn = $('#plotPauseBtn');
  els.plotPauseText = $('#plotPauseText');
  els.plotClearBtn = $('#plotClearBtn');
  els.plotRate = $('#plotRate');

  els.glCanvas = $('#glCanvas');
  els.roRoll = $('#roRoll');
  els.roPitch = $('#roPitch');
  els.roYaw = $('#roYaw');
  els.zeroBadge = $('#zeroBadge');
  els.zeroBtn = $('#zeroBtn');
  els.resetZeroBtn = $('#resetZeroBtn');
  els.sideCompass = $('#sideCompass');
  els.sideHeading = $('#sideHeading');

  els.compassCanvas = $('#compassCanvas');
  els.horizonCanvas = $('#horizonCanvas');
  els.headingBadge = $('#headingBadge');
  els.headingVal = $('#headingVal');
  els.horizonBadge = $('#horizonBadge');
  els.pitchVal = $('#pitchVal');
  els.rollVal = $('#rollVal');

  els.calTiles = $$('.cal-tile');
  els.tempCalBtn = $('#tempCalBtn');
  els.tempInput = $('#tempInput');
  els.calStatus = $('#calStatus');
  els.calLog = $('#calLog');
  els.clearLogBtn = $('#clearLogBtn');

  // Elements whose text is managed dynamically (don't let applyI18n overwrite them).
  for (const el of [els.statusText, els.connectBtnText, els.plotPauseText, els.calStatus, els.portLabel]) {
    if (el) el.removeAttribute('data-i18n');
  }

  $$('[data-val]').forEach((el) => valueEls.set(el.dataset.val, el));
  $$('[data-bar]').forEach((el) => barEls.set(el.dataset.bar, el));

  plotView = new PlotView(els.plotCanvas);
  att3d = new Attitude3D(els.glCanvas);

  state.serialSupported = 'serial' in navigator;

  bindEvents();
  updateLangButton();
  updatePortLabel();
  updateConnectButton();
  updateStatus('off');
  updateCalStatusText();
  updateRateChip();
  updateControlsDisabled();
  if (state.serialSupported) {
    resetConnHint();
  } else {
    setConnInfoText(t('msg.serialUnsupported'), true);
  }
  addLog(t('cal.logReady'), 'hint');

  if (state.serialSupported && navigator.serial.getPorts) {
    navigator.serial.getPorts()
      .then((ports) => { if (ports.length && !state.port) setPort(ports[0]); })
      .catch(() => { /* ignore */ });
    navigator.serial.addEventListener('disconnect', (event) => {
      if (state.port && event.target === state.port) handleLost();
    });
  }

  setInterval(tick, 50);
  requestAnimationFrame(renderLoop);
}

/* ------------------------------------------------------------------ */
/* Language                                                            */
/* ------------------------------------------------------------------ */

function updateLangButton() {
  els.langBtn.textContent = getLang() === 'zh' ? 'EN' : '中文';
  els.langBtn.title = t('lang.switchTitle');
}

function refreshDynamicTexts() {
  updateLangButton();
  updateStatus(state.statusKind);
  updateConnectButton();
  updatePortLabel();
  updateCalStatusText();
  els.plotPauseText.textContent = state.plotPaused ? t('plots.resume') : t('plots.pause');
  if (state.connected) updateConnInfo();
  else resetConnHint();
  updateRateChip();
  plotDirty = true;
}

window.addEventListener('langchange', refreshDynamicTexts);

/* ------------------------------------------------------------------ */
/* Connection UI                                                       */
/* ------------------------------------------------------------------ */

function setPort(port) {
  state.port = port;
  const info = typeof port.getInfo === 'function' ? port.getInfo() : {};
  if (info && (info.usbVendorId != null || info.usbProductId != null)) {
    const vid = info.usbVendorId == null ? '----' : info.usbVendorId.toString(16).toUpperCase().padStart(4, '0');
    const pid = info.usbProductId == null ? '----' : info.usbProductId.toString(16).toUpperCase().padStart(4, '0');
    state.portName = `USB ${vid}:${pid}`;
  } else {
    state.portName = t('port.device');
  }
  updatePortLabel();
}

function updatePortLabel() {
  if (state.port) {
    els.portLabel.textContent = state.portName || t('port.device');
    els.portLabel.classList.remove('muted');
  } else {
    els.portLabel.textContent = t('port.choose');
    els.portLabel.classList.add('muted');
  }
}

function updateControlsDisabled() {
  const lock = state.connected || state.connecting;
  els.portBtn.disabled = lock || !state.serialSupported;
  els.algoSelect.disabled = state.connecting;
  els.connectBtn.disabled = state.connecting || !state.serialSupported;
  updateCalButtons();
}

function updateConnectButton() {
  if (state.connecting) {
    els.connectBtnText.textContent = t('status.connecting');
    els.connectBtn.classList.remove('danger');
  } else if (state.connected) {
    els.connectBtnText.textContent = t('disconnect');
    els.connectBtn.classList.add('danger');
  } else {
    els.connectBtnText.textContent = t('connect');
    els.connectBtn.classList.remove('danger');
  }
  els.connectBtn.disabled = state.connecting || !state.serialSupported;
}

function updateStatus(kind) {
  state.statusKind = kind;
  els.statusPill.dataset.state = kind;
  els.statusText.textContent = t(`status.${kind}`);
}

function resetConnHint() {
  if (!state.serialSupported) {
    setConnInfoText(t('msg.serialUnsupported'), true);
    return;
  }
  renderConnInfo([{ text: t('conn.hint'), muted: true }]);
}

function setConnInfoText(text, warn = false) {
  renderConnInfo([{ text, warn }]);
}

function renderConnInfo(parts) {
  els.connInfo.replaceChildren();
  parts.forEach((part, index) => {
    if (index > 0) {
      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.textContent = '·';
      els.connInfo.append(sep);
    }
    const span = document.createElement('span');
    span.textContent = part.text;
    if (part.muted) span.className = 'muted';
    if (part.warn) span.className = 'warn';
    els.connInfo.append(span);
  });
}

function updateConnInfo() {
  if (!state.connected) return;
  const parts = [];
  parts.push({ text: t('conn.serialSource') });
  if (state.firmware) parts.push({ text: t('conn.firmware', state.firmware) });
  if (state.hardwareAxes) parts.push({ text: t('conn.axes', state.hardwareAxes) });
  if (state.rate > 0) parts.push({ text: `${state.rate} Hz`, muted: true });
  if (state.session && !state.session.hasData) parts.push({ text: t('conn.waiting'), warn: true });
  renderConnInfo(parts);
}

async function onConnectClick() {
  if (state.connecting) return;
  if (state.connected) {
    await disconnectUser();
    return;
  }
  await connectSerial();
}

async function connectSerial() {
  if (!state.serialSupported) {
    toast(t('msg.serialUnsupported'), 'error');
    return;
  }

  state.connecting = true;
  updateStatus('connecting');
  updateConnectButton();
  updateControlsDisabled();
  els.connectBtnText.textContent = t('status.connecting');
  setConnInfoText(t('conn.reading'), false);

  let imu = null;
  try {
    let port = state.port;
    if (!port) {
      port = await navigator.serial.requestPort();
      setPort(port);
    }

    imu = new ImuSerial(port);
    imu.onError = () => { if (state.session === imu) handleLost(); };
    await imu.connect();
    state.session = imu;
    state.firmware = null;
    state.hardwareAxes = null;

    const version = await imu.requestVersion(900);
    state.firmware = version;

    const axes = await detectAxes(imu, 1000);
    state.hardwareAxes = axes;
    const algo = axes === 10 ? 9 : axes === 6 ? 6 : 9;
    state.appliedAlgo = algo;
    els.algoSelect.value = String(algo);

    try { await imu.setFusionAlgorithm(algo); } catch (_) { /* device may not reply */ }
    try { await imu.setReportRate(100); } catch (_) { /* device may not reply */ }

    if (state.session !== imu) throw new Error(t('msg.lost'));

    state.connected = true;
    state.connecting = false;
    updateStatus('on');
    updateConnectButton();
    updateControlsDisabled();
    resetRateCounter();
    updateConnInfo();

    if (!imu.hasData) toast(t('msg.noData'), 'warn');
  } catch (err) {
    if (err && err.name === 'NotFoundError') {
      // User closed the port picker.
      state.connecting = false;
      updateStatus('off');
      updateConnectButton();
      updateControlsDisabled();
      resetConnHint();
      return;
    }
    try { await imu?.close(); } catch (_) { /* ignore */ }
    state.session = null;
    state.connected = false;
    state.connecting = false;
    state.firmware = null;
    state.hardwareAxes = null;
    state.appliedAlgo = null;
    state.rate = 0;
    updateStatus('error');
    setTimeout(() => { if (!state.connected) updateStatus('off'); }, 3200);
    updateConnectButton();
    updateControlsDisabled();
    updateRateChip();
    toast(t('msg.connectFail', err?.message || String(err)), 'error');
    resetConnHint();
  }
}

async function detectAxes(imu, sampleMs) {
  const end = performance.now() + sampleMs;
  let baro = false;
  let mag = false;
  while (performance.now() < end) {
    const snap = imu.snapshot();
    if (snap) {
      if (snap.baro && Math.abs(snap.baro[2]) > 0.001) baro = true;
      if (snap.mag && (Math.abs(snap.mag[0]) > 0.001 || Math.abs(snap.mag[1]) > 0.001 || Math.abs(snap.mag[2]) > 0.001)) mag = true;
      if (baro) break;
    }
    await sleep(40);
  }
  if (baro) return 10;
  if (mag) return 9;
  return 6;
}

async function disconnectUser() {
  await cleanupSession();
  state.connected = false;
  state.connecting = false;
  updateStatus('off');
  updateConnectButton();
  updateControlsDisabled();
  resetConnHint();
  updateRateChip();
}

async function cleanupSession() {
  const session = state.session;
  state.session = null;
  state.connected = false;
  if (session) {
    try { await session.close(); } catch (_) { /* ignore */ }
  }
  state.firmware = null;
  state.hardwareAxes = null;
  state.appliedAlgo = null;
  state.rate = 0;
}

async function handleLost() {
  if (!state.session && !state.connected) return;
  await cleanupSession();
  state.connecting = false;
  updateStatus('lost');
  updateConnectButton();
  updateControlsDisabled();
  setConnInfoText(t('msg.lost'), true);
  updateRateChip();
  toast(t('msg.lost'), 'error');
  setTimeout(() => { if (!state.connected) updateStatus('off'); }, 4500);
}

/* ------------------------------------------------------------------ */
/* Data flow                                                           */
/* ------------------------------------------------------------------ */

function tick() {
  countRate();
  if (!state.session || !state.connected) return;
  const snapshot = state.session.snapshot();
  if (!snapshot) return;

  snapshot.attitude = applyCorrections(snapshot.attitude);
  state.attitude.roll = snapshot.attitude[0];
  state.attitude.pitch = snapshot.attitude[1];
  state.attitude.yaw = snapshot.attitude[2];

  updateMonitor(snapshot);
  appendPlots(snapshot);
  updateAttitudeViews(snapshot);
  updateGauges(snapshot);
}

function applyCorrections(attitude) {
  let [roll, pitch, yaw] = attitude;
  const decl = Number(els.declInput.value);
  yaw = mod360(yaw + (Number.isFinite(decl) ? decl : 0));
  if (els.pitchFlip.checked) {
    roll = -roll;
    pitch = -pitch;
  }
  return [roll, pitch, yaw];
}

function countRate() {
  const now = performance.now();
  if (now - state.lastRateTime < 1000) return;
  const frames = state.session ? state.session.frameCount || 0 : 0;
  const elapsed = now - state.lastRateTime;
  const rate = elapsed > 0 ? Math.round(((frames - state.lastFrames) * 1000) / elapsed) : 0;
  state.rate = state.connected ? Math.max(0, rate) : 0;
  state.lastFrames = frames;
  state.lastRateTime = now;
  updateRateChip();
  if (state.connected) updateConnInfo();
}

function resetRateCounter() {
  state.lastFrames = state.session ? state.session.frameCount || 0 : 0;
  state.lastRateTime = performance.now();
  state.rate = 0;
  updateRateChip();
}

function updateRateChip() {
  els.plotRate.textContent = state.connected && state.rate > 0 ? `${state.rate} Hz` : '—';
}

function updateMonitor(snapshot) {
  for (const key of Object.keys(MONITOR_META)) {
    const values = snapshot[key];
    if (!values) continue;
    const meta = MONITOR_META[key];
    values.forEach((value, index) => {
      const id = `${key}.${index}`;
      const el = valueEls.get(id);
      if (el) el.textContent = fmtNumber(value, meta.digits);
      if (meta.scale) setMeter(id, value, meta.scale[index]);
    });
  }
}

function setMeter(id, value, scale) {
  const el = barEls.get(id);
  if (!el) return;
  const ratio = Math.abs(Number(value)) / scale;
  const pct = Number.isFinite(ratio) ? Math.min(100, ratio * 100) : 0;
  el.style.width = `${pct.toFixed(1)}%`;
}

function appendPlots(snapshot) {
  if (state.plotPaused) return;
  plotView.append(snapshot);
  plotDirty = true;
}

function updateAttitudeViews(snapshot) {
  const [roll, pitch, yaw] = snapshot.attitude;
  att3d.setAttitude(roll, pitch, yaw);
  els.roRoll.textContent = `${fmtNumber(roll, 1)}°`;
  els.roPitch.textContent = `${fmtNumber(pitch, 1)}°`;
  els.roYaw.textContent = `${fmtNumber(yaw, 1)}°`;
  els.zeroBadge.hidden = !att3d.isZeroed;
}

function updateGauges(snapshot) {
  const [roll, pitch, yaw] = snapshot.attitude;
  const headingText = `${fmtNumber(yaw, 1)}°`;
  const pitchText = `${fmtNumber(pitch, 1)}°`;
  const rollText = `${fmtNumber(roll, 1)}°`;
  els.headingBadge.textContent = headingText;
  els.headingVal.textContent = headingText;
  els.sideHeading.textContent = headingText;
  els.horizonBadge.textContent = `${pitchText} / ${rollText}`;
  els.pitchVal.textContent = pitchText;
  els.rollVal.textContent = rollText;
}

/* ------------------------------------------------------------------ */
/* Rendering loop                                                      */
/* ------------------------------------------------------------------ */

function renderLoop(timestamp) {
  if (timestamp - lastRenderAt >= 32 && !document.hidden) {
    lastRenderAt = timestamp;
    const invert = els.compassInvert.checked;
    if (state.activeTab === 'attitude') {
      att3d.render();
      drawCompass(els.sideCompass, state.attitude.yaw, { invert, compact: true });
    } else if (state.activeTab === 'instruments') {
      drawCompass(els.compassCanvas, state.attitude.yaw, { invert });
      drawHorizon(els.horizonCanvas, state.attitude.roll, state.attitude.pitch);
    } else if (state.activeTab === 'plots' && plotDirty) {
      plotView.draw(state.plotGroup, state.plotPaused, {
        paused: t('plots.paused'),
        empty: t('plots.empty'),
        samples: t('plots.samples')
      });
      plotDirty = false;
    }
  }
  requestAnimationFrame(renderLoop);
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

function switchTab(name) {
  state.activeTab = name;
  els.tabButtons.forEach((btn) => {
    const active = btn.dataset.tab === name;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  els.panels.forEach((panel) => {
    const active = panel.dataset.panel === name;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
  if (name === 'plots') plotDirty = true;
}

/* ------------------------------------------------------------------ */
/* Calibration                                                         */
/* ------------------------------------------------------------------ */

function updateCalButtons() {
  const disabled = state.calBusy || !state.connected;
  els.calTiles.forEach((btn) => {
    btn.disabled = disabled;
    if (!state.calBusy) btn.classList.remove('running');
  });
  els.tempCalBtn.disabled = disabled;
}

function setCalBusy(busy, activeType) {
  state.calBusy = busy;
  els.calTiles.forEach((btn) => {
    btn.disabled = busy || !state.connected;
    btn.classList.toggle('running', busy && btn.dataset.calib === activeType);
  });
  els.tempCalBtn.disabled = busy || !state.connected;
  els.calStatus.dataset.state = busy ? 'running' : 'idle';
  els.calStatus.textContent = busy ? t('cal.running') : t('cal.ready');
}

function updateCalStatusText() {
  if (state.calBusy) {
    els.calStatus.dataset.state = 'running';
    els.calStatus.textContent = t('cal.running');
  } else {
    els.calStatus.dataset.state = 'idle';
    els.calStatus.textContent = t('cal.ready');
  }
}

async function runCalibration(type) {
  if (!state.connected || !state.session) {
    toast(t('cal.notConnected'), 'error');
    return;
  }
  if (state.calBusy) {
    toast(t('cal.busy'), 'warn');
    return;
  }

  let temperature;
  if (type === 'temp') {
    temperature = Number(els.tempInput.value);
    if (!Number.isFinite(temperature) || temperature < -50 || temperature > 50) {
      toast(t('cal.tempInvalid'), 'error');
      return;
    }
  }

  const name = t(CAL_NAME_KEYS[type]);
  setCalBusy(true, type);
  addLog(t('cal.start', name), 'info');
  if (type === 'imu') addLog(t('cal.keepStill'), 'hint');
  if (type === 'mag') addLog(t('cal.figure8'), 'hint');

  try {
    const result = await state.session.calibrate(type, temperature);
    if (!state.connected) {
      addLog(t('msg.lost'), 'error');
      return;
    }
    if (result.reset) {
      addLog(t('cal.resetDone'), 'ok');
      toast(t('cal.resetDone'));
      return;
    }
    if (result.status === null || result.status === undefined) {
      addLog(t('cal.doneNoStatus'), 'warn');
      toast(t('cal.doneNoStatus'), 'warn');
      return;
    }
    const level = result.status === 0 ? 'ok' : 'warn';
    addLog(t('cal.done', result.status), level);
    toast(t('cal.done', result.status), level === 'ok' ? 'ok' : 'warn');
  } catch (err) {
    const message = t('cal.fail', err?.message || String(err));
    addLog(message, 'error');
    toast(message, 'error');
  } finally {
    setCalBusy(false);
  }
}

function addLog(text, level = 'info') {
  if (!text) return;
  const line = document.createElement('div');
  line.className = `log-line ${level}`;
  const time = document.createElement('span');
  time.className = 'log-time';
  time.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  const message = document.createElement('span');
  message.className = 'log-text';
  message.textContent = text;
  line.append(time, message);
  els.calLog.append(line);
  while (els.calLog.children.length > 200) els.calLog.firstElementChild.remove();
  els.calLog.scrollTop = els.calLog.scrollHeight;
}

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

function toast(message, type = 'ok') {
  const el = document.createElement('div');
  el.className = `toast${type === 'error' ? ' error' : type === 'warn' ? ' warn' : ''}`;
  el.textContent = message;
  els.toasts.append(el);
  while (els.toasts.children.length > 3) els.toasts.firstElementChild.remove();
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 200);
  }, 4000);
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

function bindEvents() {
  els.langBtn.addEventListener('click', toggleLang);

  els.portBtn.addEventListener('click', async () => {
    if (!state.serialSupported) {
      toast(t('msg.serialUnsupported'), 'error');
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      setPort(port);
      toast(t('msg.portPicked'));
    } catch (err) {
      if (err && err.name !== 'NotFoundError') {
        toast(t('msg.connectFail', err.message || String(err)), 'error');
      }
    }
  });

  els.connectBtn.addEventListener('click', onConnectClick);

  els.algoSelect.addEventListener('change', async () => {
    if (!state.connected || !state.session) return;
    const algo = Number(els.algoSelect.value);
    try {
      await state.session.setFusionAlgorithm(algo);
      state.appliedAlgo = algo === 10 ? 9 : algo;
      updateConnInfo();
    } catch (err) {
      toast(t('msg.connectFail', err?.message || String(err)), 'error');
    }
  });

  els.declInput.addEventListener('input', () => { plotDirty = true; });
  els.pitchFlip.addEventListener('change', () => { plotDirty = true; });
  els.compassInvert.addEventListener('change', () => { /* redrawn every frame */ });

  els.tabs.addEventListener('click', (event) => {
    const btn = event.target.closest('.tab-btn');
    if (!btn) return;
    switchTab(btn.dataset.tab);
  });

  els.plotGroups.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-group]');
    if (!btn) return;
    state.plotGroup = btn.dataset.group;
    $$('button[data-group]', els.plotGroups).forEach((b) => b.classList.toggle('active', b === btn));
    plotDirty = true;
  });

  els.plotPauseBtn.addEventListener('click', () => {
    state.plotPaused = !state.plotPaused;
    els.plotPauseBtn.classList.toggle('active', state.plotPaused);
    els.plotPauseText.textContent = state.plotPaused ? t('plots.resume') : t('plots.pause');
    plotDirty = true;
  });

  els.plotClearBtn.addEventListener('click', () => {
    plotView.clear();
    plotDirty = true;
  });

  els.zeroBtn.addEventListener('click', () => {
    att3d.calibrateZero();
    els.zeroBadge.hidden = false;
  });
  els.resetZeroBtn.addEventListener('click', () => {
    att3d.resetZero();
    els.zeroBadge.hidden = true;
  });

  for (const btn of [...els.calTiles, els.tempCalBtn]) {
    btn.addEventListener('click', () => {
      if (btn.dataset.calib === 'reset' && !window.confirm(t('cal.resetConfirm'))) return;
      runCalibration(btn.dataset.calib);
    });
  }

  els.clearLogBtn.addEventListener('click', () => {
    els.calLog.replaceChildren();
    addLog(t('cal.logCleared'), 'hint');
  });
}
