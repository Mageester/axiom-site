/**
 * The colour engine. One place decides what the page looks like:
 *
 *   world   = which shade, and which tone (0 = the shade at rest, 1 = its counter-colour,
 *             used for the lighter or darker half of the page as you scroll)
 *   request = ask for another shade and/or tone, from a point on screen
 *
 * A request starts a flood. The canvas paints the new colours spreading from that point with
 * a glossy lip on the edge, while the CSS custom properties tween in sync so the text and
 * everything else on the page change colour as if the page had been dipped. Without WebGL, or
 * with reduced motion, only the custom properties change.
 */
import { gsap, reducedMotion, finePointer } from '../_kit/motion';
import { runShader, type Shader } from '../_kit/gl';
import { LACQUER } from './lacquer';
import { shades, type Shade } from './data';

type RGB = [number, number, number];
export type Look = { bg: RGB; ink: RGB; accent: RGB; deep: RGB; mid: RGB; glow: RGB };

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const css = (c: RGB) => `rgb(${Math.round(c[0] * 255)} ${Math.round(c[1] * 255)} ${Math.round(c[2] * 255)})`;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function lookOf(shade: Shade, tone: number): Look {
  return {
    bg: mix(hexToRgb(shade.bg), hexToRgb(shade.bg2), tone),
    ink: mix(hexToRgb(shade.ink), hexToRgb(shade.ink2), tone),
    accent: mix(hexToRgb(shade.accent), hexToRgb(shade.accent2), tone),
    deep: hexToRgb(shade.deep),
    mid: hexToRgb(shade.mid),
    glow: hexToRgb(shade.glow),
  };
}

const root = document.documentElement;
const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

function paint(look: Look) {
  const s = root.style;
  s.setProperty('--bg', css(look.bg));
  s.setProperty('--ink', css(look.ink));
  s.setProperty('--accent', css(look.accent));
}
function paintLacquer(look: Look) {
  const s = root.style;
  s.setProperty('--deep', css(look.deep));
  s.setProperty('--mid', css(look.mid));
  s.setProperty('--glow', css(look.glow));
}

export const world = { shade: 0, tone: 0 };
let wanted: { shade: number; tone: number; origin: [number, number] | null; instant: boolean } = { shade: 0, tone: 0, origin: null, instant: false };
let busy = false;
const listeners = new Set<(shade: number, previous: number) => void>();
export const onShade = (fn: (shade: number, previous: number) => void) => listeners.add(fn);

// ───────── canvas ─────────
const stage = document.querySelector<HTMLElement>('.stage');
const canvas = document.querySelector<HTMLCanvasElement>('#lacquer');
let shader: Shader | null = null;
let asleep = false;
let framesSinceWake = 0;
let recede = 0;
let pour = 0;
let loopTime = 0;

const pointer = { x: 0.64, y: 0.5, tx: 0.64, ty: 0.5, energy: 0, speed: 0, lastX: 0, lastY: 0, lastT: 0, active: false };
const drop = { x: 0.5, y: 0.5, t0: -100 };
const zero = () => [0, 0, 0, 0];
const calm = { text: [zero(), zero(), zero(), zero(), zero(), zero()], name: zero() };

function setUniformLooks(a: Look, b: Look) {
  if (!shader) return;
  const u = shader.uniforms;
  u.u_bgA = a.bg; u.u_deepA = a.deep; u.u_midA = a.mid; u.u_glowA = a.glow;
  u.u_bgB = b.bg; u.u_deepB = b.deep; u.u_midB = b.mid; u.u_glowB = b.glow;
}

function shouldSleep() {
  return !busy && recede >= 0.9995 && pour >= 0.9995;
}
function syncSleep() {
  if (!stage || !shader) return;
  const sleep = shouldSleep();
  if (sleep === asleep) return;
  asleep = sleep;
  stage.classList.toggle('is-asleep', sleep);
  if (sleep) {
    stage.classList.remove('is-ready');
    framesSinceWake = 0;
  }
}

/** Where the calm zones are: places where text sits, so reflections there are toned down. */
export function setCalm(text: (DOMRect | null)[], name: DOMRect | null) {
  const conv = (r?: DOMRect | null) => {
    if (!r || r.width === 0) return [0, 0, 0, 0];
    const w = window.innerWidth;
    const h = window.innerHeight;
    return [(r.left + r.width / 2) / w, 1 - (r.top + r.height / 2) / h, r.width / 2 / w, r.height / 2 / h];
  };
  for (let i = 0; i < 6; i++) calm.text[i] = conv(text[i]);
  calm.name = conv(name);
}

export function setRecede(v: number) {
  recede = Math.min(1, Math.max(0, v));
  if (shader) {
    shader.uniforms.u_recede = recede;
    syncSleep();
  }
}

export function initCanvas(maxDpr: number) {
  if (!canvas || reducedMotion) return null;
  shader = runShader(canvas, LACQUER, {
    maxDpr,
    uniforms: {
      u_bgA: [0, 0, 0], u_deepA: [0, 0, 0], u_midA: [0, 0, 0], u_glowA: [0, 0, 0],
      u_bgB: [0, 0, 0], u_deepB: [0, 0, 0], u_midB: [0, 0, 0], u_glowB: [0, 0, 0],
      u_flood: 0, u_origin: [0.5, 0.5], u_recede: 0, u_pour: 0,
      u_ptr: [0.64, 0.5], u_energy: 0, u_drop: [0.5, 0.5, -1],
      u_c0: zero(), u_c1: zero(), u_c2: zero(), u_c3: zero(), u_c4: zero(), u_c5: zero(), u_calm4: zero(),
    },
    onFrame(time, dt, u) {
      loopTime = time;
      // the bulge follows the pointer slowly; on touch screens it wanders by itself
      if (!pointer.active) {
        pointer.tx = 0.62 + Math.sin(time * 0.21) * 0.2;
        pointer.ty = 0.5 + Math.cos(time * 0.17) * 0.18;
      }
      const k = 1 - Math.exp(-dt * 2.4);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      pointer.speed *= Math.exp(-dt * 3.2);
      pointer.energy += (Math.min(1, pointer.speed * 2.4) - pointer.energy) * (1 - Math.exp(-dt * 4));
      u.u_ptr = [pointer.x, pointer.y];
      u.u_energy = pointer.energy;
      u.u_drop = [drop.x, drop.y, time - drop.t0 > 6 ? -1 : time - drop.t0];
      u.u_c0 = calm.text[0]; u.u_c1 = calm.text[1]; u.u_c2 = calm.text[2];
      u.u_c3 = calm.text[3]; u.u_c4 = calm.text[4]; u.u_c5 = calm.text[5];
      u.u_calm4 = calm.name;
      if (framesSinceWake < 3) {
        framesSinceWake += 1;
        if (framesSinceWake === 3) stage?.classList.add('is-ready');
      }
    },
  });
  if (!shader) return null;
  root.classList.add('gl');

  const start = lookOf(shades[world.shade], world.tone);
  setUniformLooks(start, start);

  window.addEventListener(
    'pointermove',
    (event) => {
      const now = performance.now();
      const nx = event.clientX / window.innerWidth;
      const ny = 1 - event.clientY / window.innerHeight;
      if (pointer.lastT) {
        const dtm = Math.max(8, now - pointer.lastT);
        const dist = Math.hypot((nx - pointer.lastX) * (window.innerWidth / window.innerHeight), ny - pointer.lastY);
        pointer.speed = Math.max(pointer.speed * 0.5, Math.min(1.4, (dist / dtm) * 90));
      }
      pointer.lastX = nx;
      pointer.lastY = ny;
      pointer.lastT = now;
      pointer.tx = nx;
      pointer.ty = ny;
      pointer.active = true;
    },
    { passive: true },
  );
  window.addEventListener(
    'pointerdown',
    (event) => {
      pointer.tx = event.clientX / window.innerWidth;
      pointer.ty = 1 - event.clientY / window.innerHeight;
      pointer.active = true;
      drop.x = pointer.tx;
      drop.y = pointer.ty;
      drop.t0 = loopTime;
    },
    { passive: true },
  );
  return shader;
}

// ───────── transitions ─────────
function apply(shade: number, tone: number) {
  const look = lookOf(shades[shade], tone);
  paint(look);
  paintLacquer(lookOf(shades[shade], 0));
  if (themeMeta) themeMeta.content = css(look.bg);
}

/** Set the world immediately, with no animation. */
export function setInstant(shade: number, tone: number) {
  world.shade = shade;
  world.tone = tone;
  wanted = { shade, tone, origin: null, instant: false };
  apply(shade, tone);
  const look = lookOf(shades[shade], tone);
  setUniformLooks(look, look);
  if (shader) shader.uniforms.u_flood = 0;
}

export function request(shade: number, tone: number, origin: [number, number] | null, instant = false) {
  wanted = { shade, tone, origin, instant };
  run();
}

function run() {
  if (busy) return;
  if (wanted.shade === world.shade && wanted.tone === world.tone) return;
  const target = { ...wanted };
  const previous = world.shade;
  const from = lookOf(shades[world.shade], world.tone);
  const to = lookOf(shades[target.shade], target.tone);
  const shadeChanged = target.shade !== world.shade;

  if (shadeChanged) {
    paintLacquer(lookOf(shades[target.shade], 0));
    for (const fn of listeners) fn(target.shade, previous);
  }

  if (target.instant || reducedMotion) {
    setInstant(target.shade, target.tone);
    return;
  }

  busy = true;
  const finish = () => {
    world.shade = target.shade;
    world.tone = target.tone;
    apply(world.shade, world.tone);
    setUniformLooks(to, to);
    if (shader) shader.uniforms.u_flood = 0;
    busy = false;
    syncSleep();
    run();
  };

  const state = { v: 0 };
  const onScreen = shader !== null;
  if (shader) {
    setUniformLooks(from, to);
    const o = target.origin ?? [0.5, -0.2];
    shader.uniforms.u_origin = [o[0], o[1]];
    shader.uniforms.u_flood = 0.0001;
    syncSleep();
  }
  gsap.to(state, {
    v: 1,
    duration: shadeChanged ? 1.55 : 1.15,
    ease: onScreen ? 'power2.inOut' : 'power1.inOut',
    onUpdate() {
      const v = state.v;
      if (shader) shader.uniforms.u_flood = Math.min(v, 0.9999);
      // The page colour follows the flood. The text colour travels the whole way, so halfway it is a
      // mid tone that still reads on both the old and the new background.
      const bgT = onScreen ? smooth(0.02, 0.98, v) : v;
      const inkT = smooth(0.1, 0.92, v);
      const look: Look = {
        bg: mix(from.bg, to.bg, bgT),
        ink: mix(from.ink, to.ink, inkT),
        accent: mix(from.accent, to.accent, inkT),
        deep: to.deep,
        mid: to.mid,
        glow: to.glow,
      };
      paint(look);
      if (themeMeta && v > 0.5) themeMeta.content = css(to.bg);
    },
    onComplete: finish,
  });
}

export const isCoarse = !finePointer;
export const pourTo = (v: number) => {
  pour = v;
  if (shader) {
    shader.uniforms.u_pour = v;
    syncSleep();
  }
};
