/* Rolling multi-channel line chart drawn on a canvas (no dependencies). */

import { fitCanvas, COLORS, roundRect, fmtNumber } from './canvas.js';

export const PLOT_GROUPS = [
  { key: 'accel', labels: ['X', 'Y', 'Z'], unit: 'g', digits: 3, colors: [COLORS.x, COLORS.y, COLORS.z] },
  { key: 'gyro', labels: ['X', 'Y', 'Z'], unit: 'rad/s', digits: 3, colors: [COLORS.x, COLORS.y, COLORS.z] },
  { key: 'mag', labels: ['X', 'Y', 'Z'], unit: 'μT', digits: 3, colors: [COLORS.x, COLORS.y, COLORS.z] },
  { key: 'attitude', labels: ['Roll', 'Pitch', 'Yaw'], unit: '°', digits: 1, colors: [COLORS.x, COLORS.y, COLORS.amber] }
];

const MONO = '"Cascadia Code", "JetBrains Mono", Consolas, monospace';

function niceStep(raw) {
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  let m;
  if (n <= 1) m = 1;
  else if (n <= 2) m = 2;
  else if (n <= 2.5) m = 2.5;
  else if (n <= 5) m = 5;
  else m = 10;
  return m * pow;
}

function decimalsFor(step) {
  if (step >= 10) return 0;
  if (step >= 1) return 1;
  if (step >= 0.1) return 2;
  if (step >= 0.01) return 3;
  return 4;
}

export class PlotView {
  constructor(canvas) {
    this.canvas = canvas;
    this.window = 300;
    this.buffers = {};
    this.resetBuffers();
  }

  resetBuffers() {
    this.buffers = {};
    for (const group of PLOT_GROUPS) {
      this.buffers[group.key] = [[], [], []];
    }
  }

  clear() {
    this.resetBuffers();
  }

  append(snapshot) {
    if (!snapshot) return;
    for (const group of PLOT_GROUPS) {
      const values = snapshot[group.key];
      if (!values) continue;
      const channelBuffers = this.buffers[group.key];
      for (let i = 0; i < 3; i += 1) {
        const v = Number(values[i]);
        const buffer = channelBuffers[i];
        buffer.push(Number.isFinite(v) ? v : 0);
        if (buffer.length > this.window) buffer.shift();
      }
    }
  }

  draw(groupKey, paused, texts) {
    const group = PLOT_GROUPS.find((g) => g.key === groupKey) || PLOT_GROUPS[0];
    const { ctx, w, h } = fitCanvas(this.canvas);
    if (w < 2 || h < 2) return;

    const compact = w < 520;
    const left = compact ? 46 : 56;
    const right = 16;
    const top = 38;
    const bottom = 30;
    const plotW = Math.max(10, w - left - right);
    const plotH = Math.max(10, h - top - bottom);
    const buffers = this.buffers[group.key];

    let min = Infinity;
    let max = -Infinity;
    let any = false;
    for (const buffer of buffers) {
      for (const value of buffer) {
        if (!Number.isFinite(value)) continue;
        any = true;
        if (value < min) min = value;
        if (value > max) max = value;
      }
    }
    if (!any) {
      min = -1;
      max = 1;
    }
    if (max - min < 1e-9) {
      min -= 1;
      max += 1;
    } else {
      const pad = (max - min) * 0.08;
      min -= pad;
      max += pad;
    }

    const step = niceStep((max - min) / 4);
    let lo = Math.floor(min / step) * step;
    let hi = Math.ceil(max / step) * step;
    if (hi === lo) { hi = lo + step; }
    const decimals = decimalsFor(step);
    const yFor = (value) => top + plotH - ((value - lo) / (hi - lo)) * plotH;
    const xFor = (index) => left + (index / (this.window - 1)) * plotW;

    // grid
    ctx.lineWidth = 1;
    ctx.font = `10px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let value = lo; value <= hi + step * 0.5; value += step) {
      const y = yFor(value);
      if (y < top - 0.5 || y > top + plotH + 0.5) continue;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + plotW, y);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(133, 150, 170, 0.8)';
      ctx.fillText(value.toFixed(decimals), left - 9, y);
    }

    const xTicks = 4;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= xTicks; i += 1) {
      const value = Math.round((this.window - 1) * (i / xTicks));
      const x = xFor(value);
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + plotH);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(133, 150, 170, 0.65)';
      ctx.fillText(String(value), x, top + plotH + 9);
    }

    // zero line
    if (lo < 0 && hi > 0) {
      const y0 = yFor(0);
      ctx.beginPath();
      ctx.moveTo(left, y0);
      ctx.lineTo(left + plotW, y0);
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = 'rgba(231, 238, 247, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // series
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top - 1, plotW, plotH + 2);
    ctx.clip();
    for (let channel = 0; channel < 3; channel += 1) {
      const buffer = buffers[channel];
      const color = group.colors[channel];
      if (buffer.length === 0) continue;
      ctx.beginPath();
      for (let i = 0; i < buffer.length; i += 1) {
        const x = xFor(i);
        const y = yFor(buffer[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const lastIndex = buffer.length - 1;
      const lx = xFor(lastIndex);
      const ly = yFor(buffer[lastIndex]);
      ctx.beginPath();
      ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // frame
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, top + plotH);
    ctx.lineTo(left + plotW, top + plotH);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // legend
    let lx = left;
    const ly = 16;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `11px ${MONO}`;
    for (let channel = 0; channel < 3; channel += 1) {
      const color = group.colors[channel];
      const label = group.labels[channel];
      const buffer = buffers[channel];
      const valueText = buffer.length ? fmtNumber(buffer[buffer.length - 1], group.digits) : '--';

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 13, ly);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.fillText(label, lx + 19, ly);
      const labelW = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(231, 238, 247, 0.92)';
      ctx.fillText(valueText, lx + 19 + labelW + 7, ly);
      const valueW = ctx.measureText(valueText).width;
      lx += 19 + labelW + 7 + valueW + 22;
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(133, 150, 170, 0.66)';
    ctx.font = `10px ${MONO}`;
    ctx.fillText(group.unit, left + plotW, ly);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(133, 150, 170, 0.5)';
    ctx.fillText(texts.samples, left + plotW / 2, h - 1);

    if (paused) {
      const text = texts.paused;
      ctx.font = `600 10.5px ${MONO}`;
      const tw = ctx.measureText(text).width;
      const bw = tw + 24;
      const bx = left + plotW - bw;
      const by = top + 10;
      roundRect(ctx, bx, by, bw, 22, 7);
      ctx.fillStyle = 'rgba(20, 15, 8, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 188, 92, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx + 10, by + 11, 3, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.amber;
      ctx.fill();
      ctx.fillStyle = COLORS.amber;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + 17, by + 11.5);
    }

    if (!any) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `12px ${MONO}`;
      ctx.fillStyle = 'rgba(133, 150, 170, 0.6)';
      ctx.fillText(texts.empty, left + plotW / 2, top + plotH / 2);
    }
  }
}
