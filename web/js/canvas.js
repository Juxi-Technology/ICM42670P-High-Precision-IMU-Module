/* Canvas helpers shared by the gauges, chart and 3D view. */

export const COLORS = {
  x: '#2fe3c4',
  y: '#58a6ff',
  z: '#ffbc5c',
  w: '#b18cff',
  accent: '#2fe3c4',
  text: '#e7eef7',
  muted: '#8596aa',
  faint: '#5a6a7e',
  line: 'rgba(148, 163, 184, 0.13)',
  danger: '#ff6b7a',
  amber: '#ffbc5c'
};

export function fitCanvas(canvas, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const w = Math.max(1, Math.round(canvas.clientWidth));
  const h = Math.max(1, Math.round(canvas.clientHeight));
  const bw = Math.round(w * dpr);
  const bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h, dpr };
}

export function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function fmtNumber(value, digits = 2) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '--';
  let text = Number(value).toFixed(digits);
  if (/^-0\.?0*$/.test(text)) text = text.slice(1);
  return text;
}

export function mod360(deg) {
  return ((deg % 360) + 360) % 360;
}

export function shortAngle(deg) {
  let a = ((deg + 180) % 360 + 360) % 360 - 180;
  return a;
}
