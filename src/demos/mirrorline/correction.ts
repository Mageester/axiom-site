/**
 * The correction panel: the same paint, hazed and covered in fine scratches. Under an
 * inspection light the scratches show the way they do on a real car, as rings around the
 * light's reflection. Rubbing polishes them away: the first pass cuts the scratches out,
 * the second takes the haze, and two deeper marks only soften.
 */
import { createLoop, isSoftwareGL, type Loop } from '../_kit/gl';
import { dropTarget, getGL, makeProgram, makeTarget, rigMatrix, applyMat, type Target } from './glx';
import * as S from './shaders';

export type Progress = { corrected: number; swirls: number; haze: number };

export type Correction = {
  loop: Loop;
  /** Polish at a point in canvas CSS pixels (y down), with a pad of the given radius. */
  rub: (x: number, y: number, amount: number) => void;
  reset: () => void;
  fill: () => void;
  progress: () => Progress;
  /** Where the inspection light's reflection sits, 0 to 1 across the canvas (y down). */
  light: { x: number; y: number };
  radius: () => number;
  split: { on: boolean; at: number };
  size: () => { w: number; h: number };
};

const PERSP = 0.5;

export function startCorrection(
  canvas: HTMLCanvasElement,
  opts: { phone: boolean; still: boolean; onProgress?: (p: Progress) => void },
): Correction | null {
  const gl = getGL(canvas);
  if (!gl || isSoftwareGL(gl)) return null;

  const paint = makeProgram(gl, S.VS_FULL, S.fsPaint('DEFECTS'));
  const bake = makeProgram(gl, S.VS_FULL, S.FS_SCRATCH);
  const brush = makeProgram(gl, S.VS_BRUSH, S.FS_BRUSH);
  if (!paint || !bake || !brush) return null;
  gl.bindVertexArray(gl.createVertexArray());

  let scratch: Target | null = null;
  let mask: Target | null = null;
  let cssW = 1;
  let cssH = 1;
  let scale = 1;
  const maxDpr = opts.phone ? 1.5 : 1.75;

  // CPU copy of the polish, coarse, for the readout.
  const GW = 48;
  let GH = 24;
  let grid = new Float32Array(GW * GH);

  const queue: number[] = [];
  const split = { on: false, at: 0.5 };
  const light = { x: 0.42, y: 0.42 };
  let dirty = true;

  const radius = () => (opts.phone ? 46 : Math.max(56, Math.min(84, cssW * 0.055)));

  const deepLines = () => {
    const w = cssW;
    const h = cssH;
    // y up for the shader
    return [
      [w * 0.14, h * 0.36, w * 0.5, h * 0.55],
      [w * 0.64, h * 0.74, w * 0.83, h * 0.66],
    ];
  };

  const bakeScratches = () => {
    if (!scratch) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, scratch.fbo);
    gl.viewport(0, 0, scratch.w, scratch.h);
    gl.useProgram(bake.program);
    gl.uniform2f(bake.u('u_res'), scratch.w, scratch.h);
    gl.uniform1f(bake.u('u_dpr'), scratch.w / cssW);
    const [a, b] = deepLines();
    gl.uniform4f(bake.u('u_deep1'), a[0], a[1], a[2], a[3]);
    gl.uniform4f(bake.u('u_deep2'), b[0], b[1], b[2], b[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const clearMask = () => {
    if (!mask) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, mask.fbo);
    gl.viewport(0, 0, mask.w, mask.h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    grid = new Float32Array(GW * GH);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scale;
    const nw = Math.max(1, canvas.clientWidth);
    const nh = Math.max(1, canvas.clientHeight);
    const w = Math.max(1, Math.round(nw * dpr));
    const h = Math.max(1, Math.round(nh * dpr));
    const sizeChanged = Math.abs(nw - cssW) > 1 || Math.abs(nh - cssH) > 1 || !mask;
    cssW = nw;
    cssH = nh;
    if (canvas.width !== w || canvas.height !== h || !scratch) {
      canvas.width = w;
      canvas.height = h;
      dropTarget(gl, scratch);
      scratch = makeTarget(gl, w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
      bakeScratches();
    }
    if (sizeChanged) {
      dropTarget(gl, mask);
      mask = makeTarget(gl, Math.max(1, Math.round(nw / 2)), Math.max(1, Math.round(nh / 2)), gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, { linear: true });
      GH = Math.max(8, Math.round((GW * nh) / nw));
      clearMask();
      opts.onProgress?.(measure());
    }
    dirty = true;
  };

  const measure = (): Progress => {
    let corrected = 0;
    let swirls = 0;
    let haze = 0;
    const sm = (a: number, b: number, x: number) => {
      const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
      return t * t * (3 - 2 * t);
    };
    for (let i = 0; i < grid.length; i++) {
      const m = Math.min(grid[i], 1);
      corrected += m;
      swirls += 1 - sm(0, 0.55, m);
      haze += 1 - sm(0.3, 1, m);
    }
    const n = grid.length;
    return { corrected: corrected / n, swirls: swirls / n, haze: haze / n };
  };

  const rubGrid = (x: number, y: number, amount: number) => {
    const r = radius();
    const cw = cssW / GW;
    const ch = cssH / GH;
    const x0 = Math.max(0, Math.floor((x - r) / cw));
    const x1 = Math.min(GW - 1, Math.floor((x + r) / cw));
    const y0 = Math.max(0, Math.floor((y - r) / ch));
    const y1 = Math.min(GH - 1, Math.floor((y + r) / ch));
    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        const dx = (gx + 0.5) * cw - x;
        const dy = (gy + 0.5) * ch - y;
        const d = Math.hypot(dx, dy) / r;
        if (d >= 1) continue;
        const f = d < 0.55 ? 1 : 1 - (d - 0.55) / 0.45;
        const k = gy * GW + gx;
        grid[k] = Math.min(1.2, grid[k] + amount * f * f * (3 - 2 * f));
      }
    }
  };

  const flushStamps = () => {
    if (!mask || !queue.length) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, mask.fbo);
    gl.viewport(0, 0, mask.w, mask.h);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(brush.program);
    gl.uniform2f(brush.u('u_res'), cssW, cssH);
    for (let i = 0; i < queue.length; i += 4) {
      gl.uniform3f(brush.u('u_brush'), queue[i], queue[i + 1], queue[i + 2]);
      gl.uniform1f(brush.u('u_amount'), queue[i + 3]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    gl.disable(gl.BLEND);
    queue.length = 0;
  };

  const draw = (time: number) => {
    if (!scratch || !mask) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(paint.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mask.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, scratch.tex);
    gl.uniform1i(paint.u('u_mask'), 0);
    gl.uniform1i(paint.u('u_scr'), 1);
    gl.uniform2f(paint.u('u_res'), canvas.width, canvas.height);
    gl.uniform1f(paint.u('u_dpr'), canvas.width / cssW);
    gl.uniform1f(paint.u('u_time'), time);
    const rot = rigMatrix(-0.05, 0.04);
    gl.uniformMatrix3fv(paint.u('u_rot'), false, rot);
    gl.uniform2f(paint.u('u_l2d'), 0, 1);
    gl.uniform1f(paint.u('u_env'), 0.32);
    gl.uniform4f(paint.u('u_lights'), 1, 1, 1, 1);
    // The inspection light, aimed so its reflection sits at `light`.
    const aspect = canvas.width / canvas.height;
    const qx = (light.x - 0.5) * aspect;
    const qy = 0.5 - light.y;
    const lw: [number, number, number] = [qx * (PERSP + 0.2), qy * (PERSP + 0.32), 1];
    const len = Math.hypot(lw[0], lw[1], lw[2]);
    lw[0] /= len;
    lw[1] /= len;
    lw[2] /= len;
    const le = applyMat(rot, lw);
    gl.uniform3f(paint.u('u_disc'), le[0], le[1], le[2]);
    gl.uniform3f(paint.u('u_lightW'), lw[0], lw[1], lw[2]);
    gl.uniform1f(paint.u('u_discI'), 34);
    gl.uniform1f(paint.u('u_fade'), 1);
    gl.uniform1f(paint.u('u_flake'), 0.12);
    gl.uniform1f(paint.u('u_persp'), PERSP);
    gl.uniform4f(paint.u('u_split'), split.on ? 1 : 0, split.at * canvas.width, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let resized = true;
  new ResizeObserver(() => {
    resized = true;
    loop.invalidate();
  }).observe(canvas);

  const loop = createLoop(
    canvas,
    (time) => {
      if (resized) {
        resized = false;
        resize();
      }
      flushStamps();
      draw(time);
      dirty = false;
    },
    {
      onSlow: (level) => {
        scale = level === 1 ? 0.8 : 0.62;
        resized = true;
      },
    },
  );
  void dirty;

  return {
    loop,
    light,
    split,
    radius,
    size: () => ({ w: cssW, h: cssH }),
    rub(x, y, amount) {
      const r = radius();
      queue.push(x, cssH - y, r, amount);
      rubGrid(x, y, amount);
      opts.onProgress?.(measure());
      loop.invalidate();
    },
    reset() {
      clearMask();
      queue.length = 0;
      opts.onProgress?.(measure());
      loop.invalidate();
    },
    fill() {
      queue.length = 0;
      queue.push(cssW / 2, cssH / 2, Math.hypot(cssW, cssH), 2);
      grid.fill(1);
      opts.onProgress?.(measure());
      loop.invalidate();
    },
    progress: measure,
  };
}
