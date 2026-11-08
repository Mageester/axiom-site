/**
 * The hero: a ceramic-coated panel in midnight blue metallic, with water beading on it.
 * The beads are a GPU simulation (see shaders.ts): they form from mist, merge when they
 * touch, and once heavy enough slide off with gravity, sweeping a clean lane as they go.
 * The studio lights follow the pointer, or the phone's tilt.
 */
import { createLoop, isSoftwareGL, type Loop } from '../_kit/gl';
import { complete, dropTarget, getGL, makeProgram, makeTarget, rigMatrix, type Target } from './glx';
import * as S from './shaders';

export type Light = { yaw: number; pitch: number; strip: number; low: number; box: number; top: number };

export type Beads = {
  loop: Loop;
  /** Mist the panel around a point in viewport pixels. */
  spray: (clientX: number, clientY: number, amount?: number) => void;
  /** Gravity on the panel, in screen terms: (0, -1) is straight down. */
  gravity: { x: number; y: number };
  light: Light;
  fade: { v: number };
};

export function startBeads(canvas: HTMLCanvasElement, opts: { phone: boolean; still: boolean }): Beads | null {
  const gl = getGL(canvas);
  if (!gl || isSoftwareGL(gl)) return null;
  if (!gl.getExtension('EXT_color_buffer_float')) return null;

  const paint = makeProgram(gl, S.VS_FULL, S.fsPaint('WATER'));
  const claim = makeProgram(gl, S.VS_CLAIM, S.FS_CLAIM);
  const resolve = makeProgram(gl, S.VS_FULL, S.FS_RESOLVE);
  const gain = makeProgram(gl, S.VS_GAIN, S.FS_GAIN);
  const integrate = makeProgram(gl, S.VS_FULL, S.FS_INTEGRATE);
  const splat = makeProgram(gl, S.VS_SPLAT, S.FS_SPLAT);
  if (!paint || !claim || !resolve || !gain || !integrate || !splat) return null;

  gl.bindVertexArray(gl.createVertexArray());

  const N = opts.phone ? 56 : 80;
  const COUNT = N * N;
  const CELL = 8;
  const RC = 12.5;
  const RMAX = 34;

  // Sim space is the canvas in CSS pixels, y up.
  let simW = Math.max(1, canvas.clientWidth);
  let simH = Math.max(1, canvas.clientHeight);

  // A freshly rinsed panel: beads of every size, packed close but not touching, so nothing
  // merges or slides until new water lands.
  const seedState = () => {
    const data = new Float32Array(COUNT * 4);
    const cell = 24;
    const gw = Math.ceil(simW / cell) + 1;
    const gh = Math.ceil(simH / cell) + 1;
    const buckets: number[][] = Array.from({ length: gw * gh }, () => []);
    const want = Math.min(COUNT * 0.82, (simW * simH) / 150);
    let placed = 0;
    for (let tries = 0; tries < want * 6 && placed < want; tries++) {
      // Larger beads first, then smaller ones fill the gaps.
      const k = tries / (want * 6);
      const r = 1.3 + Math.pow(Math.random(), 1.4) * 10.5 * (1 - k * 0.75);
      const x = Math.random() * simW;
      const y = Math.random() * simH;
      const cx = Math.floor(x / cell);
      const cy = Math.floor(y / cell);
      let ok = true;
      for (let dy = -1; dy <= 1 && ok; dy++) {
        for (let dx = -1; dx <= 1 && ok; dx++) {
          const b = buckets[(cy + dy + gh) % gh * gw + ((cx + dx + gw) % gw)];
          for (const j of b) {
            const d = Math.hypot(data[j * 4] - x, data[j * 4 + 1] - y);
            if (d < data[j * 4 + 2] + r + 1.6) {
              ok = false;
              break;
            }
          }
        }
      }
      if (!ok) continue;
      data[placed * 4] = x;
      data[placed * 4 + 1] = y;
      data[placed * 4 + 2] = r;
      data[placed * 4 + 3] = 0;
      buckets[cy * gw + cx].push(placed);
      placed++;
    }
    return data;
  };

  const F32 = gl.RGBA32F;
  let stateA = makeTarget(gl, N, N, F32, gl.RGBA, gl.FLOAT, { data: seedState() });
  let stateB = makeTarget(gl, N, N, F32, gl.RGBA, gl.FLOAT);
  const parent = makeTarget(gl, N, N, gl.R32F, gl.RED, gl.FLOAT);
  const gainT = makeTarget(gl, N, N, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
  if (!complete(gl, stateB) || !complete(gl, parent) || !complete(gl, gainT)) return null;

  let grid: Target | null = null;
  let height: Target | null = null;
  let scale = 1;
  const maxDpr = opts.phone ? 1.5 : 1.75;

  const sizeTargets = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    simW = Math.max(1, canvas.clientWidth);
    simH = Math.max(1, canvas.clientHeight);
    if (canvas.width !== w || canvas.height !== h || !height) {
      canvas.width = w;
      canvas.height = h;
      dropTarget(gl, height);
      height = makeTarget(gl, w, h, gl.R16F, gl.RED, gl.HALF_FLOAT, { linear: true });
    }
    const gw = Math.ceil(simW / CELL);
    const gh = Math.ceil(simH / CELL);
    if (!grid || grid.w !== gw || grid.h !== gh) {
      dropTarget(gl, grid);
      grid = makeTarget(gl, gw, gh, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, { depth: true });
    }
  };
  sizeTargets();

  const gravity = { x: 0, y: -1 };
  const light: Light = { yaw: 0, pitch: 0, strip: 1, low: 1, box: 1, top: 1 };
  const fade = { v: opts.still ? 1 : 0 };
  const spray = { x: 0, y: 0, r: 0, amount: 0 };
  let frame = 0;

  const step = (dt: number, spawn: number, grav: [number, number]) => {
    if (!grid) return;
    // claim
    gl.bindFramebuffer(gl.FRAMEBUFFER, grid.fbo);
    gl.viewport(0, 0, grid.w, grid.h);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.GREATER);
    gl.useProgram(claim.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, stateA.tex);
    gl.uniform1i(claim.u('u_state'), 0);
    gl.uniform2f(claim.u('u_grid'), grid.w, grid.h);
    gl.uniform1f(claim.u('u_cell'), CELL);
    gl.drawArrays(gl.POINTS, 0, COUNT);
    gl.disable(gl.DEPTH_TEST);

    // resolve
    gl.bindFramebuffer(gl.FRAMEBUFFER, parent.fbo);
    gl.viewport(0, 0, N, N);
    gl.useProgram(resolve.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, stateA.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, grid.tex);
    gl.uniform1i(resolve.u('u_state'), 0);
    gl.uniform1i(resolve.u('u_grid'), 1);
    gl.uniform1f(resolve.u('u_cell'), CELL);
    gl.uniform1f(resolve.u('u_touch'), 0.96);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // gain
    gl.bindFramebuffer(gl.FRAMEBUFFER, gainT.fbo);
    gl.viewport(0, 0, N, N);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(gain.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, stateA.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, parent.tex);
    gl.uniform1i(gain.u('u_state'), 0);
    gl.uniform1i(gain.u('u_parent'), 1);
    gl.drawArrays(gl.POINTS, 0, COUNT);
    gl.disable(gl.BLEND);

    // integrate
    gl.bindFramebuffer(gl.FRAMEBUFFER, stateB.fbo);
    gl.viewport(0, 0, N, N);
    gl.useProgram(integrate.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, stateA.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, parent.tex);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, gainT.tex);
    gl.uniform1i(integrate.u('u_state'), 0);
    gl.uniform1i(integrate.u('u_parent'), 1);
    gl.uniform1i(integrate.u('u_gain'), 2);
    gl.uniform2f(integrate.u('u_sim'), simW, simH);
    gl.uniform1f(integrate.u('u_dt'), dt);
    gl.uniform1ui(integrate.u('u_frame'), frame++);
    gl.uniform2f(integrate.u('u_grav'), grav[0], grav[1]);
    gl.uniform1f(integrate.u('u_spawn'), spawn);
    gl.uniform4f(integrate.u('u_spray'), spray.x, spray.y, spray.r, spray.amount);
    gl.uniform1f(integrate.u('u_rc'), RC);
    gl.uniform1f(integrate.u('u_rmax'), RMAX);
    gl.uniform2f(integrate.u('u_rspawn'), 1.2, 7.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const t = stateA;
    stateA = stateB;
    stateB = t;
    spray.amount = 0;
  };

  const drawHeight = (grav: [number, number], dpr: number) => {
    if (!height) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, height.fbo);
    gl.viewport(0, 0, height.w, height.h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.MAX);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(splat.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, stateA.tex);
    gl.uniform1i(splat.u('u_state'), 0);
    gl.uniform2f(splat.u('u_sim'), simW, simH);
    gl.uniform2f(splat.u('u_grav'), grav[0], grav[1]);
    gl.uniform1f(splat.u('u_scale'), dpr);
    gl.uniform1f(splat.u('u_k'), 0.9);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, COUNT);
    gl.disable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
  };

  const drawPaint = (time: number) => {
    if (!height) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(paint.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, height.tex);
    gl.uniform1i(paint.u('u_h'), 0);
    gl.uniform2f(paint.u('u_res'), canvas.width, canvas.height);
    gl.uniform1f(paint.u('u_dpr'), canvas.width / simW);
    gl.uniform1f(paint.u('u_time'), time);
    gl.uniformMatrix3fv(paint.u('u_rot'), false, rigMatrix(light.yaw, light.pitch));
    const lx = -Math.sin(light.yaw) * 1.6;
    const ll = Math.hypot(lx, 1);
    gl.uniform2f(paint.u('u_l2d'), lx / ll, 1 / ll);
    gl.uniform1f(paint.u('u_env'), 1);
    gl.uniform4f(paint.u('u_lights'), light.strip, light.low, light.box, light.top);
    gl.uniform1f(paint.u('u_discI'), 0);
    gl.uniform3f(paint.u('u_disc'), 0, 0, 1);
    gl.uniform1f(paint.u('u_fade'), fade.v);
    gl.uniform1f(paint.u('u_flake'), 1);
    gl.uniform1f(paint.u('u_persp'), 0.55);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // Let the seeded beads find each other before the first frame, without sliding.
  for (let i = 0; i < 14; i++) step(1 / 60, 0, [0, 0]);

  let resized = false;
  new ResizeObserver(() => {
    resized = true;
    loop.invalidate();
  }).observe(canvas);

  const loop = createLoop(
    canvas,
    (time, dt) => {
      if (resized) {
        resized = false;
        sizeTargets();
      }
      const dpr = canvas.width / simW;
      if (opts.still) {
        // A single still frame: settled beads, nothing sliding.
        for (let i = 0; i < 8; i++) step(1 / 60, 0, [0, 0]);
        drawHeight([0, -1], dpr);
      } else {
        const grav: [number, number] = [gravity.x, gravity.y];
        step(Math.max(dt, 1 / 240), opts.phone ? 0.0016 : 0.0012, grav);
        drawHeight(grav, dpr);
      }
      drawPaint(time);
    },
    {
      onSlow: (level) => {
        scale = level === 1 ? 0.8 : 0.62;
        resized = true;
      },
    },
  );

  return {
    loop,
    gravity,
    light,
    fade,
    spray(clientX, clientY, amount = 0.22) {
      const r = canvas.getBoundingClientRect();
      spray.x = clientX - r.left;
      spray.y = r.height - (clientY - r.top);
      spray.r = opts.phone ? 70 : 110;
      spray.amount = amount;
    },
  };
}
