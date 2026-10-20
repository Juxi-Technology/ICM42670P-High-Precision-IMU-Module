/* Lightweight 3D attitude cube renderer (canvas 2D, perspective projection).
 *
 * Interaction: dragging rotates the view in screen space (turntable style),
 * so horizontal drags always spin around the screen-vertical axis and vertical
 * drags always tilt around the screen-horizontal axis, regardless of the
 * current view orientation. The X/Y/Z axis arrows are drawn on top of the cube
 * so all three stay readable at every angle.
 */

import { fitCanvas } from './canvas.js';

const DEG = Math.PI / 180;
const FOV = 45 * DEG;

const VERTICES = [
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  [-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]
];

const FACES = [
  { idx: [0, 1, 2, 3], normal: [0, 0, 1] },
  { idx: [4, 5, 6, 7], normal: [0, 0, -1] },
  { idx: [1, 7, 6, 2], normal: [1, 0, 0] },
  { idx: [3, 5, 4, 0], normal: [-1, 0, 0] },
  { idx: [3, 2, 6, 5], normal: [0, 1, 0] },
  { idx: [0, 4, 7, 1], normal: [0, -1, 0] }
];

const AXES = [
  { dir: [1, 0, 0], color: '#ff6b7a', label: 'X' },
  { dir: [0, 1, 0], color: '#5ee08d', label: 'Y' },
  { dir: [0, 0, 1], color: '#58a6ff', label: 'Z' }
];

const BASE_COLOR = [63, 82, 104];
const LIGHT = normalize([0.42, 0.78, 0.58]);
const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];

function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

/* 3x3 row-major matrices */
function matMul(a, b) {
  const out = new Array(9);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      out[row * 3 + col] =
        a[row * 3] * b[col] +
        a[row * 3 + 1] * b[3 + col] +
        a[row * 3 + 2] * b[6 + col];
    }
  }
  return out;
}

function applyMat(m, p) {
  return [
    m[0] * p[0] + m[1] * p[1] + m[2] * p[2],
    m[3] * p[0] + m[4] * p[1] + m[5] * p[2],
    m[6] * p[0] + m[7] * p[1] + m[8] * p[2]
  ];
}

function rotX(deg) {
  const c = Math.cos(deg * DEG);
  const s = Math.sin(deg * DEG);
  return [1, 0, 0, 0, c, -s, 0, s, c];
}

function rotY(deg) {
  const c = Math.cos(deg * DEG);
  const s = Math.sin(deg * DEG);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
}

function applyAttitude(p, roll, pitch, yaw) {
  let [x, y, z] = p;
  const cr = Math.cos(roll * DEG);
  const sr = Math.sin(roll * DEG);
  const y1 = y * cr - z * sr;
  const z1 = y * sr + z * cr;

  const cp = Math.cos(pitch * DEG);
  const sp = Math.sin(pitch * DEG);
  const x2 = x * cp + z1 * sp;
  const z2 = -x * sp + z1 * cp;

  const cy = Math.cos(yaw * DEG);
  const sy = Math.sin(yaw * DEG);
  const x3 = x2 * cy - y1 * sy;
  const y3 = x2 * sy + y1 * cy;
  return [x3, y3, z2];
}

export class Attitude3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.raw = { roll: 0, pitch: 0, yaw: 0 };
    this.zero = { roll: 0, pitch: 0, yaw: 0, active: false };
    this.view = IDENTITY.slice();
    this.distance = 6.4;
    this._drag = null;
    this._bindEvents();
  }

  setAttitude(roll, pitch, yaw) {
    this.raw.roll = roll;
    this.raw.pitch = pitch;
    this.raw.yaw = yaw;
  }

  get displayAngles() {
    const { roll, pitch, yaw } = this.raw;
    if (!this.zero.active) return { roll, pitch, yaw };
    return {
      roll: roll - this.zero.roll,
      pitch: pitch - this.zero.pitch,
      yaw: yaw - this.zero.yaw
    };
  }

  calibrateZero() {
    this.zero = { ...this.raw, active: true };
  }

  resetZero() {
    this.zero = { roll: 0, pitch: 0, yaw: 0, active: false };
  }

  get isZeroed() { return this.zero.active; }

  _bindEvents() {
    const canvas = this.canvas;
    canvas.addEventListener('pointerdown', (event) => {
      this._drag = { x: event.clientX, y: event.clientY };
      try { canvas.setPointerCapture(event.pointerId); } catch (_) { /* ignore */ }
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!this._drag) return;
      const dx = event.clientX - this._drag.x;
      const dy = event.clientY - this._drag.y;
      this._drag = { x: event.clientX, y: event.clientY };
      // Pre-multiply screen-space rotations: horizontal drag spins around the
      // screen's vertical axis, vertical drag tilts around the screen's
      // horizontal axis, no matter how the view is already rotated.
      this.view = matMul(matMul(rotX(dy * 0.42), rotY(dx * 0.42)), this.view);
    });
    const finish = (event) => {
      this._drag = null;
      try { canvas.releasePointerCapture(event.pointerId); } catch (_) { /* ignore */ }
    };
    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.distance = Math.max(3.2, Math.min(20, this.distance + event.deltaY * 0.004));
    }, { passive: false });
  }

  render() {
    const { ctx, w, h } = fitCanvas(this.canvas);
    if (w < 2 || h < 2) return;

    const cx = w / 2;
    const cy = h / 2;
    const focal = (h / 2) / Math.tan(FOV / 2);
    const dist = this.distance;
    const att = this.displayAngles;
    const view = this.view;

    const toView = (p) => applyMat(view, applyAttitude(p, att.roll, att.pitch, att.yaw));
    const project = (p) => {
      const depth = Math.max(0.25, dist - p[2]);
      const scale = focal / depth;
      return { x: cx + p[0] * scale, y: cy - p[1] * scale, depth };
    };

    const viewPoints = VERTICES.map(toView);
    const screenPoints = viewPoints.map(project);

    // Faces: cull back faces, sort far -> near, shade with a view-space light.
    const faces = [];
    for (const face of FACES) {
      const normal = applyMat(view, applyAttitude(face.normal, att.roll, att.pitch, att.yaw));
      const center = face.idx.reduce((acc, i) => {
        acc[0] += viewPoints[i][0] / 4;
        acc[1] += viewPoints[i][1] / 4;
        acc[2] += viewPoints[i][2] / 4;
        return acc;
      }, [0, 0, 0]);
      const toCamera = [-center[0], -center[1], dist - center[2]];
      if (dot(normal, toCamera) <= 0) continue;
      const lambert = Math.max(0, dot(normal, LIGHT));
      const shade = Math.min(1.22, 0.44 + 0.78 * lambert);
      faces.push({
        normal,
        center,
        depth: center[2],
        shade,
        points: face.idx.map((i) => screenPoints[i])
      });
    }
    faces.sort((a, b) => a.depth - b.depth);

    // soft ambient glow behind the cube
    const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, Math.min(w, h) * 0.46);
    glow.addColorStop(0, 'rgba(47, 227, 196, 0.07)');
    glow.addColorStop(0.55, 'rgba(76, 141, 255, 0.03)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    for (const face of faces) {
      const r = Math.round(BASE_COLOR[0] * face.shade);
      const g = Math.round(BASE_COLOR[1] * face.shade);
      const b = Math.round(BASE_COLOR[2] * face.shade);
      ctx.beginPath();
      ctx.moveTo(face.points[0].x, face.points[0].y);
      for (let i = 1; i < face.points.length; i += 1) ctx.lineTo(face.points[i].x, face.points[i].y);
      ctx.closePath();
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fill();
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(226, 240, 255, 0.18)';
      ctx.stroke();
    }

    // Axes are drawn on top of the cube so X, Y and Z never disappear.
    ctx.save();
    ctx.font = '700 12px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const axis of AXES) {
      const startV = axis.dir.map((v) => v * 1.02);
      const endV = axis.dir.map((v) => v * 1.86);
      const start = project(toView(startV));
      const end = project(toView(endV));

      const vx = end.x - start.x;
      const vy = end.y - start.y;
      const len = Math.hypot(vx, vy);
      let ux;
      let uy;
      if (len > 8) {
        ux = vx / len;
        uy = vy / len;
      } else {
        const ox = end.x - cx;
        const oy = end.y - cy;
        const ol = Math.hypot(ox, oy);
        if (ol > 6) { ux = ox / ol; uy = oy / ol; } else { ux = 0; uy = -1; }
      }

      // dark under-stroke keeps the arrow readable on bright cube faces
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(5, 9, 13, 0.62)';
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = axis.color;
      ctx.shadowBlur = 9;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.restore();

      // arrow head
      const tip = { x: end.x + ux * 2, y: end.y + uy * 2 };
      const px = -uy;
      const py = ux;
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(end.x - ux * 2 + px * 5, end.y - uy * 2 + py * 5);
      ctx.lineTo(end.x - ux * 2 - px * 5, end.y - uy * 2 - py * 5);
      ctx.closePath();
      ctx.fillStyle = axis.color;
      ctx.strokeStyle = 'rgba(5, 9, 13, 0.62)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fill();

      // label pill (clamped to stay inside the canvas)
      const label = {
        x: Math.max(12, Math.min(w - 12, end.x + ux * 17)),
        y: Math.max(12, Math.min(h - 12, end.y + uy * 17))
      };
      ctx.beginPath();
      ctx.arc(label.x, label.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(7, 12, 18, 0.9)';
      ctx.fill();
      ctx.strokeStyle = `${axis.color}88`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = axis.color;
      ctx.fillText(axis.label, label.x, label.y + 0.5);
    }
    ctx.restore();

    // subtle baseline vignette
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(w, h) * 0.42, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.045)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
