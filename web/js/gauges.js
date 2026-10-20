/* Canvas-drawn compass and artificial horizon. */

import { fitCanvas, COLORS } from './canvas.js';

const DEG = Math.PI / 180;
const MONO = '"Cascadia Code", "JetBrains Mono", Consolas, monospace';

function polar(cx, cy, angleDeg, radius) {
  const a = angleDeg * DEG;
  return [cx + Math.sin(a) * radius, cy - Math.cos(a) * radius];
}

/**
 * Rotating-card compass, matching the desktop app:
 * the whole dial (ticks, degrees and N/E/S/W) rotates with the device yaw,
 * while the gold nose marker at the top stays fixed as the device heading.
 */
export function drawCompass(canvas, yaw, opts = {}) {
  const { invert = false, compact = false } = opts;
  const { ctx, w, h } = fitCanvas(canvas);
  if (w < 2 || h < 2) return;

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * (compact ? 0.43 : 0.42);
  const heading = ((yaw % 360) + 360) % 360;

  // Dial face
  const face = ctx.createRadialGradient(cx, cy - r * 0.22, r * 0.08, cx, cy, r);
  face.addColorStop(0, '#1a2735');
  face.addColorStop(0.72, '#111b26');
  face.addColorStop(1, '#0a1119');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = face;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.36)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Rotating card: ticks, degree labels and cardinal letters turn with the device.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((invert ? -heading : heading) * DEG);

  const tickOuter = r - 5;
  const tickStep = compact ? 10 : 5;
  const majorStep = compact ? 30 : 45;
  const mediumStep = compact ? 0 : 15;
  const labelRadius = r * 0.78;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let angle = 0; angle < 360; angle += tickStep) {
    const major = angle % majorStep === 0;
    const medium = !major && mediumStep > 0 && angle % mediumStep === 0;
    const tickLength = major ? tickOuter - r * 0.095 : medium ? tickOuter - r * 0.07 : tickOuter - r * 0.048;
    const [ox, oy] = polar(0, 0, angle, tickOuter);
    const [ix, iy] = polar(0, 0, angle, tickLength);
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(ox, oy);
    ctx.strokeStyle = major
      ? 'rgba(236, 244, 252, 0.88)'
      : medium
        ? 'rgba(200, 210, 224, 0.55)'
        : 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = major ? 2 : medium ? 1.4 : 1;
    ctx.stroke();
    if (major) {
      const [lx, ly] = polar(0, 0, angle, labelRadius);
      ctx.fillStyle = 'rgba(139, 155, 174, 0.92)';
      ctx.font = `${Math.max(9, r * 0.055)}px ${MONO}`;
      ctx.fillText(String(angle), lx, ly);
    }
  }

  // Cardinal letters rotate with the card, like the desktop widget.
  const cardinals = [
    [0, 'N', '#ff6b7a'],
    [90, 'E', '#5ee08d'],
    [180, 'S', '#58a6ff'],
    [270, 'W', '#ffd166']
  ];
  for (const [angle, letter, color] of cardinals) {
    const [lx, ly] = polar(0, 0, angle, r * 0.6);
    ctx.fillStyle = color;
    ctx.font = `700 ${Math.max(14, r * 0.085)}px "Segoe UI", system-ui, sans-serif`;
    ctx.fillText(letter, lx, ly);
  }
  ctx.restore();

  // Fixed gold nose marker + lubber line: this is the device heading.
  ctx.save();
  ctx.translate(cx, cy);
  const noseW = Math.max(6, r * 0.045);
  const noseH = Math.max(12, r * 0.075);
  ctx.beginPath();
  ctx.moveTo(-noseW, -r + 4);
  ctx.lineTo(noseW, -r + 4);
  ctx.lineTo(0, -r - noseH);
  ctx.closePath();
  ctx.fillStyle = COLORS.amber;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -r + 6);
  ctx.lineTo(0, -r * 0.72);
  ctx.strokeStyle = 'rgba(255, 188, 92, 0.45)';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();
}

export function drawHorizon(canvas, roll, pitch) {
  const { ctx, w, h } = fitCanvas(canvas);
  if (w < 2 || h < 2) return;

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.405;
  const pxPerDeg = (r * 0.5) / 30;
  const horizonY = cy - pitch * pxPerDeg;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-roll * DEG);
  ctx.translate(-cx, -cy);

  const big = r * 2.2;
  const sky = ctx.createLinearGradient(0, cy - big, 0, cy + big);
  sky.addColorStop(0, '#2f7fe0');
  sky.addColorStop(0.5, '#1c54a8');
  sky.addColorStop(1, '#0f2f63');
  ctx.fillStyle = sky;
  ctx.fillRect(cx - big, cy - big, big * 2, big * 2);

  const ground = ctx.createLinearGradient(0, cy - big, 0, cy + big);
  ground.addColorStop(0, '#9a5f28');
  ground.addColorStop(0.5, '#74431b');
  ground.addColorStop(1, '#3d2310');
  ctx.fillStyle = ground;
  ctx.fillRect(cx - big, horizonY, big * 2, big * 2);

  // Horizon line
  ctx.beginPath();
  ctx.moveTo(cx - big, horizonY);
  ctx.lineTo(cx + big, horizonY);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - big, horizonY);
  ctx.lineTo(cx + big, horizonY);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Pitch ladder
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of [-30, -20, -10, 10, 20, 30]) {
    const y = horizonY + p * pxPerDeg;
    if (y < cy - big || y > cy + big) continue;
    const half = r * (Math.abs(p) === 30 ? 0.2 : Math.abs(p) === 20 ? 0.15 : 0.1);
    ctx.beginPath();
    ctx.moveTo(cx - half, y);
    ctx.lineTo(cx + half, y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.font = '9px "Cascadia Code", Consolas, monospace';
    ctx.fillText(String(p), cx - half - 12, y);
    ctx.fillText(String(p), cx + half + 12, y);
  }

  // subtle horizon glow
  const glow = ctx.createLinearGradient(0, horizonY - 18, 0, horizonY + 18);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0)');
  glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - big, horizonY - 18, big * 2, 36);

  ctx.restore();

  // Bezel
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // Bank scale (fixed)
  ctx.save();
  ctx.translate(cx, cy);
  for (const a of [-60, -45, -30, -15, 0, 15, 30, 45, 60]) {
    const major = [-60, -30, 0, 30, 60].includes(a);
    const [x0, y0] = polar(0, 0, a, r - 2);
    const [x1, y1] = polar(0, 0, a, r - (major ? 12 : 7));
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = major ? 'rgba(231, 238, 247, 0.8)' : 'rgba(231, 238, 247, 0.42)';
    ctx.lineWidth = major ? 1.7 : 1;
    ctx.stroke();
    if (major && a !== 0) {
      const [lx, ly] = polar(0, 0, a, r - 20);
      ctx.fillStyle = 'rgba(133, 150, 170, 0.9)';
      ctx.font = '9px "Cascadia Code", Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(Math.abs(a)), lx, ly);
    }
  }

  // Roll pointer
  ctx.rotate(-roll * DEG);
  ctx.beginPath();
  ctx.moveTo(0, -r + 12);
  ctx.lineTo(-4.5, -r + 22);
  ctx.lineTo(4.5, -r + 22);
  ctx.closePath();
  ctx.fillStyle = COLORS.amber;
  ctx.fill();
  ctx.restore();

  // Fixed aircraft symbol
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(255, 188, 92, 0.95)';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const wing = r * 0.36;
  const inner = r * 0.12;
  ctx.beginPath();
  ctx.moveTo(-wing, 0);
  ctx.lineTo(-inner, 0);
  ctx.lineTo(-inner, r * 0.055);
  ctx.moveTo(wing, 0);
  ctx.lineTo(inner, 0);
  ctx.lineTo(inner, r * 0.055);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(2.2, r * 0.02), 0, Math.PI * 2);
  ctx.fillStyle = COLORS.amber;
  ctx.fill();
  ctx.restore();
}
