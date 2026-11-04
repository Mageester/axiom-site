/**
 * Ink in water, in raw WebGL2. A stable-fluids solver (advection, vorticity confinement,
 * divergence, a 20-pass Jacobi pressure solve, projection) moves a two-pigment dye on
 * half-float targets. The pointer stirs it, a slow current and occasional drops keep it
 * alive, and the page's scroll position drives a flood that turns the whole screen black.
 *
 * If float render targets are missing it falls back to a warped-noise shader through the
 * kit's `runShader`, and if WebGL2 is missing the page shows a static SVG wash instead.
 */
import { createLoop, isSoftwareGL, runShader } from '../_kit/gl';
import * as S from './shaders';

export type AvoidRect = { x: number; y: number; w: number; h: number; kind: 'big' | 'small' | 'fixed' };

export type InkControls = {
  /** 0 paper to 1 fully black. */
  flood: number;
  /** How strongly dye shows on paper, 1 in the hero and lower below it. */
  strength: number;
};

export type Ink = {
  mode: 'sim' | 'shader';
  /** Release a drop at viewport pixel coordinates. */
  drop: (clientX: number, clientY: number, options?: { dye?: number; radius?: number; speed?: number }) => void;
  /** Text boxes (page coordinates at scroll 0) that dye must thin out around. */
  setAvoid: (rects: AvoidRect[], viewW: number, viewH: number) => void;
};

type Target = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
  texel: [number, number];
};
type Double = { read: Target; write: Target; swap: () => void };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function startInk(canvas: HTMLCanvasElement, ctl: InkControls): Ink | null {
  const query = new URLSearchParams(location.search).get('ink');
  const phone = matchMedia('(pointer: coarse)').matches || innerWidth < 700;

  if (query !== 'shader') {
    const sim = tryStartSim(canvas, ctl, phone);
    if (sim) return sim;
  }
  return startFallback(canvas, ctl);
}

function tryStartSim(canvas: HTMLCanvasElement, ctl: InkControls, phone: boolean): Ink | null {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;
  if (isSoftwareGL(gl)) return null;
  const hasFloat = gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float');
  if (!hasFloat) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };
  const vert = compile(gl.VERTEX_SHADER, S.VERT);
  if (!vert) return null;

  type Prog = { program: WebGLProgram; u: (name: string) => WebGLUniformLocation | null };
  let broken = false;
  const makeProgram = (frag: string): Prog => {
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    const program = gl.createProgram()!;
    if (!fs) broken = true;
    else {
      gl.attachShader(program, vert);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        broken = true;
      }
    }
    const cache = new Map<string, WebGLUniformLocation | null>();
    return {
      program,
      u: (name) => {
        if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
        return cache.get(name) ?? null;
      },
    };
  };

  const P = {
    clear: makeProgram(S.CLEAR),
    splat: makeProgram(S.SPLAT),
    advect: makeProgram(S.ADVECT),
    advectDye: makeProgram(S.ADVECT_DYE),
    forces: makeProgram(S.FORCES),
    curl: makeProgram(S.CURL),
    vorticity: makeProgram(S.VORTICITY),
    divergence: makeProgram(S.DIVERGENCE),
    pressure: makeProgram(S.PRESSURE),
    gradient: makeProgram(S.GRADIENT),
    render: makeProgram(S.RENDER),
  };
  if (broken) return null;

  gl.bindVertexArray(gl.createVertexArray());
  gl.disable(gl.BLEND);

  const makeTarget = (w: number, h: number): Target | null => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h, texel: [1 / w, 1 / h] };
  };
  const makeDouble = (w: number, h: number): Double | null => {
    const a = makeTarget(w, h);
    const b = makeTarget(w, h);
    if (!a || !b) return null;
    const d: Double = {
      read: a,
      write: b,
      swap() {
        const t = d.read;
        d.read = d.write;
        d.write = t;
      },
    };
    return d;
  };

  // ---- sizes -------------------------------------------------------------------------------
  const SIM_SHORT = phone ? 112 : 192;
  const DYE_SHORT = phone ? 640 : 896;
  let aspect = 1;
  let velocity!: Double;
  let dye!: Double;
  let pressure!: Double;
  let divergence!: Target;
  let curl!: Target;
  let simW = 0;
  let simH = 0;
  let canvasAspectBuilt = 0;

  const build = (): boolean => {
    const rect = canvas.getBoundingClientRect();
    aspect = Math.max(rect.width, 1) / Math.max(rect.height, 1);
    const sizeFor = (short: number) => (aspect >= 1 ? [Math.round(short * aspect), short] : [short, Math.round(short / aspect)]);
    const [sw, sh] = sizeFor(SIM_SHORT);
    const [dw, dh] = sizeFor(DYE_SHORT);
    const v = makeDouble(sw, sh);
    const d = makeDouble(dw, dh);
    const p = makeDouble(sw, sh);
    const dv = makeTarget(sw, sh);
    const c = makeTarget(sw, sh);
    if (!v || !d || !p || !dv || !c) return false;
    velocity = v;
    dye = d;
    pressure = p;
    divergence = dv;
    curl = c;
    simW = sw;
    simH = sh;
    canvasAspectBuilt = aspect;
    return true;
  };
  if (!build()) return null;

  // Avoid map: where dye must thin out so type stays readable. RG8, red = headline, green = small text.
  const avoidTex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, avoidTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
  const avoidCanvas = document.createElement('canvas');

  // ---- drawing helpers ---------------------------------------------------------------------
  const bindTex = (unit: number, tex: WebGLTexture) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    return unit;
  };
  const blit = (target: Target | null) => {
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.viewport(0, 0, target.w, target.h);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  let shift = 0;

  const splat = (
    target: Double,
    x: number,
    y: number,
    amount: [number, number, number, number],
    radius: number,
    disc: number,
    edge: number,
    seed: number,
  ) => {
    const p = P.splat;
    gl.useProgram(p.program);
    gl.uniform1i(p.u('uTarget'), bindTex(0, target.read.tex));
    gl.uniform2f(p.u('uPoint'), x, y);
    gl.uniform4f(p.u('uAmount'), amount[0], amount[1], amount[2], amount[3]);
    gl.uniform1f(p.u('uRadius'), radius);
    gl.uniform1f(p.u('uAspect'), aspect);
    gl.uniform1f(p.u('uSeed'), seed);
    gl.uniform1f(p.u('uEdge'), edge);
    gl.uniform1f(p.u('uDisc'), disc);
    blit(target.write);
    target.swap();
  };

  /** An ink drop: dense dye in an irregular disc, and a push down that rolls up into a ring. */
  const inkDrop = (x: number, y: number, radius: number, amount: number, vx: number, vy: number) => {
    const seed = Math.random() * 40;
    splat(velocity, x, y, [vx, vy, 0, 0], radius * 0.9, 0.3, 0.25, seed);
    splat(dye, x, y, [amount, amount * 0.5, 0, 0], radius, 0.45, 0.45, seed);
  };

  // ---- one simulation step -----------------------------------------------------------------
  let iterations = phone ? 14 : 20;
  let scrollV = 0;
  const step = (dt: number, time: number) => {
    // forces: weight of the ink, a slow ambient current, scroll drag, and thinning around type
    let p = P.forces;
    gl.useProgram(p.program);
    gl.uniform1i(p.u('uVel'), bindTex(0, velocity.read.tex));
    gl.uniform1i(p.u('uDye'), bindTex(1, dye.read.tex));
    gl.uniform1i(p.u('uAvoid'), bindTex(2, avoidTex));
    gl.uniform1f(p.u('uDt'), dt);
    gl.uniform1f(p.u('uTime'), time);
    gl.uniform1f(p.u('uGravity'), phone ? 14 : 24);
    gl.uniform1f(p.u('uAmbient'), 7);
    gl.uniform1f(p.u('uScrollV'), scrollV);
    gl.uniform1f(p.u('uAspect'), aspect);
    gl.uniform1f(p.u('uShift'), shift);
    gl.uniform1f(p.u('uDamp'), 3.2);
    blit(velocity.write);
    velocity.swap();

    p = P.curl;
    gl.useProgram(p.program);
    gl.uniform2f(p.u('uTexel'), velocity.read.texel[0], velocity.read.texel[1]);
    gl.uniform1i(p.u('uVel'), bindTex(0, velocity.read.tex));
    blit(curl);

    p = P.vorticity;
    gl.useProgram(p.program);
    gl.uniform2f(p.u('uTexel'), velocity.read.texel[0], velocity.read.texel[1]);
    gl.uniform1i(p.u('uVel'), bindTex(0, velocity.read.tex));
    gl.uniform1i(p.u('uCurl'), bindTex(1, curl.tex));
    gl.uniform1f(p.u('uStrength'), phone ? 9 : 13);
    gl.uniform1f(p.u('uDt'), dt);
    blit(velocity.write);
    velocity.swap();

    p = P.divergence;
    gl.useProgram(p.program);
    gl.uniform2f(p.u('uTexel'), velocity.read.texel[0], velocity.read.texel[1]);
    gl.uniform1i(p.u('uVel'), bindTex(0, velocity.read.tex));
    blit(divergence);

    p = P.clear;
    gl.useProgram(p.program);
    gl.uniform1i(p.u('uTex'), bindTex(0, pressure.read.tex));
    gl.uniform1f(p.u('uValue'), 0.8);
    blit(pressure.write);
    pressure.swap();

    p = P.pressure;
    gl.useProgram(p.program);
    gl.uniform2f(p.u('uTexel'), velocity.read.texel[0], velocity.read.texel[1]);
    gl.uniform1i(p.u('uDivergence'), bindTex(0, divergence.tex));
    for (let i = 0; i < iterations; i++) {
      gl.uniform1i(p.u('uPressure'), bindTex(1, pressure.read.tex));
      blit(pressure.write);
      pressure.swap();
    }

    p = P.gradient;
    gl.useProgram(p.program);
    gl.uniform2f(p.u('uTexel'), velocity.read.texel[0], velocity.read.texel[1]);
    gl.uniform1i(p.u('uPressure'), bindTex(0, pressure.read.tex));
    gl.uniform1i(p.u('uVel'), bindTex(1, velocity.read.tex));
    blit(velocity.write);
    velocity.swap();

    p = P.advect;
    gl.useProgram(p.program);
    gl.uniform2f(p.u('uTexel'), velocity.read.texel[0], velocity.read.texel[1]);
    gl.uniform1i(p.u('uVel'), bindTex(0, velocity.read.tex));
    gl.uniform1i(p.u('uSrc'), bindTex(0, velocity.read.tex));
    gl.uniform1f(p.u('uDt'), dt);
    gl.uniform1f(p.u('uDecay'), Math.exp(-0.7 * dt));
    blit(velocity.write);
    velocity.swap();

    p = P.advectDye;
    gl.useProgram(p.program);
    gl.uniform2f(p.u('uTexel'), velocity.read.texel[0], velocity.read.texel[1]);
    gl.uniform2f(p.u('uDyeTexel'), dye.read.texel[0], dye.read.texel[1]);
    gl.uniform1i(p.u('uVel'), bindTex(0, velocity.read.tex));
    gl.uniform1i(p.u('uDye'), bindTex(1, dye.read.tex));
    gl.uniform1i(p.u('uAvoid'), bindTex(2, avoidTex));
    gl.uniform1f(p.u('uDt'), dt);
    gl.uniform1f(p.u('uDecay'), Math.exp(-0.15 * dt));
    gl.uniform1f(p.u('uStainDecay'), Math.exp(-0.2 * dt));
    gl.uniform1f(p.u('uBleed'), 0.42);
    gl.uniform1f(p.u('uSpread'), 1.6);
    gl.uniform1f(p.u('uShift'), shift);
    gl.uniform1f(p.u('uAvoidK'), 0.3);
    gl.uniform1f(p.u('uRDiff'), phone ? 0.15 : 0.22);
    blit(dye.write);
    dye.swap();
  };

  const render = (time: number) => {
    const p = P.render;
    gl.useProgram(p.program);
    gl.uniform1i(p.u('uDye'), bindTex(0, dye.read.tex));
    gl.uniform1i(p.u('uAvoid'), bindTex(1, avoidTex));
    gl.uniform2f(p.u('uRes'), canvas.width, canvas.height);
    gl.uniform2f(p.u('uDyeSize'), 1 / dye.read.texel[0], 1 / dye.read.texel[1]);
    gl.uniform1f(p.u('uGain'), phone ? 3.4 : 4.6);
    gl.uniform1f(p.u('uTime'), time);
    gl.uniform1f(p.u('uAspect'), aspect);
    gl.uniform1f(p.u('uStrength'), ctl.strength);
    gl.uniform1f(p.u('uFlood'), ctl.flood);
    gl.uniform1f(p.u('uDark'), 0.27);
    gl.uniform1f(p.u('uBigCap'), phone ? 0.8 : 0.68);
    gl.uniform1f(p.u('uShift'), shift);
    blit(null);
  };

  // ---- canvas size ---------------------------------------------------------------------------
  let scale = 1;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 1.5) * scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const rect = canvas.getBoundingClientRect();
      const next = rect.width / Math.max(rect.height, 1);
      if (Math.abs(next - canvasAspectBuilt) / canvasAspectBuilt > 0.12) build();
    }, 250);
  });

  // ---- input ---------------------------------------------------------------------------------
  const toUv = (cx: number, cy: number): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [(cx - r.left) / Math.max(r.width, 1), 1 - (cy - r.top) / Math.max(r.height, 1)];
  };
  let pointerTarget: [number, number] | null = null;
  let pointerLast: [number, number] | null = null;
  let pointerMoved = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      pointerTarget = toUv(e.clientX, e.clientY);
      pointerMoved = true;
    },
    { passive: true },
  );
  const onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    pointerTarget = toUv(t.clientX, t.clientY);
    pointerMoved = true;
  };
  window.addEventListener('touchstart', (e) => {
    pointerLast = null;
    onTouch(e);
  }, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('touchend', () => {
    pointerTarget = null;
    pointerLast = null;
  }, { passive: true });

  const applyPointer = (dt: number) => {
    if (!pointerTarget || !pointerMoved) return;
    pointerMoved = false;
    const [tx, ty] = pointerTarget;
    if (!pointerLast) {
      pointerLast = [tx, ty];
      return;
    }
    const [lx, ly] = pointerLast;
    const dx = tx - lx;
    const dy = ty - ly;
    const dist = Math.hypot(dx * aspect, dy);
    if (dist < 0.0006) return;
    pointerLast = [tx, ty];
    const speed = dist / Math.max(dt, 0.008);
    const vx = clamp((dx * simW) / Math.max(dt, 0.008) * 0.55, -240, 240);
    const vy = clamp((dy * simH) / Math.max(dt, 0.008) * 0.55, -240, 240);
    const radius = phone ? 0.034 : 0.026;
    const n = clamp(Math.ceil(dist / (radius * 0.7)), 1, 10);
    const amount = clamp(speed * 0.22, 0.05, 0.5) / Math.sqrt(n);
    for (let i = 1; i <= n; i++) {
      const f = i / n;
      const x = lx + dx * f;
      const y = ly + dy * f;
      splat(velocity, x, y, [vx, vy, 0, 0], radius * 1.4, 0, 0, 0);
      splat(dye, x, y, [amount, amount * 0.6, 0, 0], radius * 0.7, 0, 0, 0);
    }
  };

  // ---- the opening bloom and the idle current ------------------------------------------------
  type Drop = { t: number; x: number; y: number; r: number; a: number; vx: number; vy: number };
  type Stream = { t0: number; t1: number; x0: number; x1: number; r: number; a: number; vy: number; vx: number };
  const bloom: Drop[] = phone
    ? [
        { t: 0.1, x: 0.7, y: 0.9, r: 0.1, a: 1.5, vx: -6, vy: -230 },
        { t: 0.7, x: 0.28, y: 0.94, r: 0.07, a: 1.2, vx: 8, vy: -190 },
        { t: 1.3, x: 0.86, y: 0.9, r: 0.06, a: 1.3, vx: -12, vy: -170 },
      ]
    : [
        { t: 0.1, x: 0.8, y: 0.88, r: 0.075, a: 1.7, vx: -30, vy: -260 },
        { t: 0.7, x: 0.54, y: 0.93, r: 0.05, a: 1.4, vx: 36, vy: -210 },
      ];
  const streams: Stream[] = phone
    ? [{ t0: 0.3, t1: 1.5, x0: 0.62, x1: 0.5, r: 0.026, a: 0.5, vy: -210, vx: 0 }]
    : [
        { t0: 0.35, t1: 1.7, x0: 0.7, x1: 0.78, r: 0.02, a: 0.5, vy: -230, vx: 0 },
        { t0: 1.1, t1: 2.2, x0: 0.93, x1: 0.86, r: 0.016, a: 0.45, vy: -220, vx: -20 },
        { t0: 1.9, t1: 2.9, x0: 0.36, x1: 0.46, r: 0.014, a: 0.4, vy: -200, vx: 20 },
      ];
  let bloomIndex = 0;
  let nextIdle = 4.6;

  const idle = (time: number, dt: number) => {
    while (bloomIndex < bloom.length && time >= bloom[bloomIndex].t) {
      const b = bloom[bloomIndex++];
      inkDrop(b.x, b.y, b.r, b.a, b.vx, b.vy);
    }
    for (const st of streams) {
      if (time < st.t0 || time > st.t1) continue;
      const f = (time - st.t0) / (st.t1 - st.t0);
      const x = st.x0 + (st.x1 - st.x0) * f + Math.sin(time * 5.1) * 0.012;
      const k = dt * 60;
      splat(velocity, x, 1.0, [st.vx + Math.sin(time * 3.7) * 18, st.vy, 0, 0], st.r * 1.6, 0, 0, 0);
      splat(dye, x, 1.0, [st.a * k, st.a * k * 0.5, 0, 0], st.r, 0, 0, 0);
    }
    if (time > nextIdle) {
      const inHero = ctl.strength > 0.7;
      nextIdle = time + rand(2.4, 3.8);
      const x = inHero ? (phone ? rand(0.15, 0.9) : rand(0.5, 0.95)) : rand(0.08, 0.92);
      const dur = rand(0.55, 1.0);
      const drift = rand(-0.1, 0.1);
      streams.push({
        t0: time,
        t1: time + dur,
        x0: x,
        x1: clamp(x + drift, 0.03, 0.97),
        r: inHero ? rand(0.014, 0.024) : rand(0.012, 0.018),
        a: inHero ? rand(0.4, 0.6) : rand(0.35, 0.5),
        vy: -rand(170, 240),
        vx: drift * 260,
      });
      if (streams.length > 12) streams.splice(0, streams.length - 12);
    }
  };

  // ---- avoid map ----------------------------------------------------------------------------
  const setAvoid = (rects: AvoidRect[], viewW: number, viewH: number) => {
    const aw = Math.min(112, Math.max(32, Math.round(viewW / 13)));
    const ah = Math.max(48, Math.round((aw * viewH) / Math.max(viewW, 1)));
    avoidCanvas.width = aw;
    avoidCanvas.height = ah;
    const c = avoidCanvas.getContext('2d', { willReadFrequently: true })!;
    c.fillStyle = '#000';
    c.fillRect(0, 0, aw, ah);
    c.globalCompositeOperation = 'lighter';
    const sx = aw / viewW;
    const sy = ah / viewH;
    for (const r of rects) {
      c.fillStyle = r.kind === 'big' ? 'rgb(255,0,0)' : r.kind === 'small' ? 'rgb(0,255,0)' : 'rgb(0,0,255)';
      const padX = r.kind === 'big' ? r.h * 0.05 : r.kind === 'small' ? 22 : 0;
      const padY = r.kind === 'big' ? r.h * 0.08 : r.kind === 'small' ? 18 : 0;
      c.fillRect((r.x - padX) * sx, (r.y - padY) * sy, (r.w + padX * 2) * sx, (r.h + padY * 2) * sy);
    }
    // Two box blurs make a soft Gaussian-like skirt, so ink thins out gradually instead of stopping at a box.
    const img = c.getImageData(0, 0, aw, ah);
    const d = img.data;
    const tmp = new Float32Array(aw * ah * 3);
    const out = new Float32Array(aw * ah * 3);
    for (let i = 0; i < aw * ah; i++) {
      out[i * 3] = d[i * 4];
      out[i * 3 + 1] = d[i * 4 + 1];
      out[i * 3 + 2] = d[i * 4 + 2];
    }
    const radius = 2;
    const pass = (src: Float32Array, dst: Float32Array, horizontal: boolean) => {
      for (let y = 0; y < ah; y++) {
        for (let x = 0; x < aw; x++) {
          for (let ch = 0; ch < 3; ch++) {
            let sum = 0;
            for (let k = -radius; k <= radius; k++) {
              const xx = horizontal ? Math.min(aw - 1, Math.max(0, x + k)) : x;
              const yy = horizontal ? y : Math.min(ah - 1, Math.max(0, y + k));
              sum += src[(yy * aw + xx) * 3 + ch];
            }
            dst[(y * aw + x) * 3 + ch] = sum / (radius * 2 + 1);
          }
        }
      }
    };
    for (let n = 0; n < 2; n++) {
      pass(out, tmp, true);
      pass(tmp, out, false);
    }
    const gain = [1.35, 1.9, 1.6];
    for (let i = 0; i < aw * ah; i++) {
      d[i * 4] = Math.min(255, out[i * 3] * gain[0]);
      d[i * 4 + 1] = Math.min(255, out[i * 3 + 1] * gain[1]);
      d[i * 4 + 2] = Math.min(255, out[i * 3 + 2] * gain[2]);
      d[i * 4 + 3] = 255;
    }
    gl.bindTexture(gl.TEXTURE_2D, avoidTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, aw, ah, 0, gl.RGBA, gl.UNSIGNED_BYTE, d);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  };

  // ---- the loop -----------------------------------------------------------------------------
  let lastScrollY = window.scrollY;
  let scrollVel = 0;
  createLoop(
    canvas,
    (time, dtRaw) => {
      const dt = clamp(dtRaw, 0.004, 1 / 30);
      resize();
      const sy = window.scrollY;
      const raw = (sy - lastScrollY) / Math.max(dtRaw, 0.004);
      lastScrollY = sy;
      scrollVel += (clamp(raw, -4000, 4000) - scrollVel) * 0.15;
      scrollV = clamp(scrollVel * 0.012, -50, 50);
      shift = sy / Math.max(canvas.clientHeight, 1);

      idle(time, dt);
      applyPointer(dt);
      step(dt, time);
      render(time);
    },
    {
      onSlow: (level) => {
        iterations = level === 1 ? 12 : 8;
        scale = level === 1 ? 0.8 : 0.65;
      },
    },
  );

  return {
    mode: 'sim',
    setAvoid,
    drop(cx, cy, options = {}) {
      const [x, y] = toUv(cx, cy);
      inkDrop(x, y, options.radius ?? 0.02, options.dye ?? 0.9, rand(-8, 8), -(options.speed ?? 70));
    },
  };
}

function startFallback(canvas: HTMLCanvasElement, ctl: InkControls): Ink | null {
  let textBox = [0.04, 0.06, 0.78, 0.62];
  const shader = runShader(canvas, S.FALLBACK, {
    maxDpr: 1.25,
    uniforms: { u_flood: 0, u_strength: 1, u_text: textBox },
    onFrame: (_time, _dt, uniforms) => {
      uniforms.u_flood = ctl.flood;
      uniforms.u_strength = ctl.strength;
      uniforms.u_text = textBox;
    },
  });
  if (!shader) return null;
  return {
    mode: 'shader',
    drop() {},
    setAvoid(rects, viewW, viewH) {
      const big = rects.filter((r) => r.kind === 'big');
      if (!big.length) return;
      const x0 = Math.min(...big.map((r) => r.x));
      const x1 = Math.max(...big.map((r) => r.x + r.w));
      const y0 = Math.min(...big.map((r) => r.y));
      const y1 = Math.max(...big.map((r) => r.y + r.h));
      textBox = [x0 / viewW, 1 - y1 / viewH, x1 / viewW, 1 - y0 / viewH];
    },
  };
}
