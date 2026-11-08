/**
 * The ring viewer: one WebGL2 program, no 3D library. It keeps the kit's manners (paused
 * off screen, nothing at all with reduced motion) and steps its own quality down when
 * frames run long: first it stops splitting every light path into three colours, then it
 * renders fewer pixels and follows fewer bounces.
 */
import { createLoop, isSoftwareGL, type Loop } from '../_kit/gl';
import { brilliant, facets, type Vec3 } from './geometry';
import { FRAG, VERT, PLANES } from './shader';
import { metalByKey, stoneByKey, type MetalKey, type StoneKey } from './looks';
import { DIST, ELEV, START_YAW, type Framing } from './scene';

type Tier = { scale: number; paths: number; bounces: number };
const TIERS: Tier[] = [
  { scale: 1, paths: 3, bounces: 7 },
  { scale: 1, paths: 1, bounces: 7 },
  // Phones start here: full resolution, one light path, fewer bounces inside the stone.
  { scale: 1, paths: 1, bounces: 5 },
  { scale: 0.82, paths: 1, bounces: 5 },
  { scale: 0.68, paths: 1, bounces: 4 },
  { scale: 0.55, paths: 1, bounces: 3 },
];

export type Sparkle = { x: number; y: number; strength: number };

export type RingView = {
  setMetal: (key: MetalKey, instant?: boolean) => void;
  setStone: (key: StoneKey, instant?: boolean) => void;
  framing: Framing;
  /** Turn by this many radians, as from a drag. */
  nudge: (yaw: number, pitch?: number) => void;
  /** Hand back control after a drag; the ring keeps its momentum, then drifts. */
  release: (velocity: number) => void;
  hold: () => void;
  angle: () => number;
  setAngle: (yaw: number) => void;
  onSparkles?: (list: Sparkle[]) => void;
  loop: Loop;
  tier: () => number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const norm = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function createRing(
  canvas: HTMLCanvasElement,
  options: { metal: MetalKey; stone: StoneKey; framing: Framing; phone: boolean },
): RingView | null {
  const fail = () => {
    document.documentElement.classList.add('no-gl');
    return null;
  };
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!gl || isSoftwareGL(gl)) return fail();

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return fail();
  }
  gl.useProgram(program);
  gl.bindVertexArray(gl.createVertexArray());
  gl.clearColor(0, 0, 0, 0);

  const U = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    res: U('u_res'),
    center: U('u_center'),
    scale: U('u_scale'),
    focal: U('u_focal'),
    eye: U('u_eye'),
    cr: U('u_cr'),
    cu: U('u_cu'),
    cf: U('u_cf'),
    rot: U('u_rot'),
    metal: U('u_metal'),
    rough: U('u_rough'),
    ior: U('u_ior'),
    absorb: U('u_absorb'),
    glow: U('u_stoneGlow'),
    bounces: U('u_bounces'),
    paths: U('u_paths'),
    alpha: U('u_alpha'),
    exposure: U('u_exposure'),
  };

  // The cut, sent once.
  const planes = brilliant();
  const flat = new Float32Array(PLANES * 4);
  planes.forEach((p, i) => flat.set([p.n[0], p.n[1], p.n[2], p.d], i * 4));
  gl.uniform4fv(U('u_pl[0]'), flat);

  // Crown facets, for the glints drawn over the canvas.
  const crown = facets(planes)
    .filter((f) => f.plane.n[1] > 0.2 && f.poly.length >= 3)
    .map((f) => {
      const c: Vec3 = [0, 0, 0];
      f.poly.forEach((p) => {
        c[0] += p[0] / f.poly.length;
        c[1] += p[1] / f.poly.length;
        c[2] += p[2] / f.poly.length;
      });
      return { c, n: f.plane.n, phase: Math.random() * 6.28 };
    });
  const lights: Vec3[] = [
    norm([-0.35, 0.82, 0.45]),
    norm([0.42, 0.78, 0.4]),
    norm([0.05, 0.62, 0.78]),
    norm([-0.78, 0.3, 0.62]),
    norm([0.82, 0.22, 0.48]),
    norm([0.25, 0.45, 0.86]),
    norm([-0.5, 0.35, 0.79]),
  ];

  // Camera, fixed; the ring turns.
  const eye: Vec3 = [0, DIST * Math.sin(ELEV), DIST * Math.cos(ELEV)];
  const cf = norm([-eye[0], -eye[1], -eye[2]]);
  const cr = norm(cross(cf, [0, 1, 0]));
  const cu = cross(cr, cf);
  gl.uniform3fv(loc.eye, eye);
  gl.uniform3fv(loc.cr, cr);
  gl.uniform3fv(loc.cu, cu);
  gl.uniform3fv(loc.cf, cf);

  const metal = metalByKey(options.metal);
  const stone = stoneByKey(options.stone);
  const look = {
    f0: [...metal.f0] as Vec3,
    rough: metal.rough,
    ior: [...stone.ior] as Vec3,
    absorb: [...stone.absorb] as Vec3,
    glow: stone.glow,
  };
  const target = { ...look, f0: [...look.f0] as Vec3, ior: [...look.ior] as Vec3, absorb: [...look.absorb] as Vec3 };

  let tierIndex = options.phone ? 2 : 0;
  const maxDpr = 1.5;
  let width = 0;
  let height = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * TIERS[tierIndex].scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (w !== width || h !== height) {
      width = canvas.width = w;
      height = canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const motion = {
    yaw: START_YAW - 0.9,
    pitch: 0,
    vel: 1.5,
    held: false,
    idle: 0,
    drift: 0,
    intro: 0,
  };

  // Frame timing, measured independently of the loop's capped delta.
  let lastNow = 0;
  let warm = 0;
  let windowFrames = 0;
  let windowTotal = 0;
  let cooldown = 0;
  const watch = (now: number) => {
    if (!lastNow) {
      lastNow = now;
      return;
    }
    const delta = now - lastNow;
    lastNow = now;
    if (delta > 250) return;
    if (warm < 20) {
      warm++;
      return;
    }
    windowFrames++;
    windowTotal += delta;
    if (windowFrames < 36) return;
    const avg = windowTotal / windowFrames;
    windowFrames = 0;
    windowTotal = 0;
    if (cooldown > 0) {
      cooldown--;
      return;
    }
    if (avg > 21 && tierIndex < TIERS.length - 1) {
      tierIndex = Math.min(TIERS.length - 1, tierIndex + (avg > 40 ? 2 : 1));
      cooldown = 1;
      resize();
    }
  };

  const view: RingView = {
    framing: { ...options.framing },
    setMetal(key, instant) {
      const m = metalByKey(key);
      target.f0 = [...m.f0];
      target.rough = m.rough;
      if (instant) {
        look.f0 = [...m.f0];
        look.rough = m.rough;
      }
      loop.invalidate();
    },
    setStone(key, instant) {
      const s = stoneByKey(key);
      target.ior = [...s.ior];
      target.absorb = [...s.absorb];
      target.glow = s.glow;
      if (instant) {
        look.ior = [...s.ior];
        look.absorb = [...s.absorb];
        look.glow = s.glow;
      }
      loop.invalidate();
    },
    nudge(yaw, pitch = 0) {
      motion.yaw += yaw;
      motion.pitch = Math.max(-0.32, Math.min(0.32, motion.pitch + pitch));
      motion.idle = 0;
      loop.invalidate();
    },
    hold() {
      motion.held = true;
      motion.vel = 0;
      motion.idle = 0;
    },
    release(velocity) {
      motion.held = false;
      motion.vel = Math.max(-9, Math.min(9, velocity));
      motion.idle = 0;
    },
    angle: () => motion.yaw,
    setAngle(yaw) {
      motion.yaw = yaw;
      motion.idle = 0;
      motion.vel = 0;
      loop.invalidate();
    },
    loop: null as unknown as Loop,
    tier: () => tierIndex,
  };

  const sparkles: { x: number; y: number; strength: number }[] = [];
  const rotate = (m: number[], v: Vec3): Vec3 => [
    m[0] * v[0] + m[3] * v[1] + m[6] * v[2],
    m[1] * v[0] + m[4] * v[1] + m[7] * v[2],
    m[2] * v[0] + m[5] * v[1] + m[8] * v[2],
  ];

  const loop = createLoop(canvas, (time, dt) => {
    watch(performance.now());
    resize();

    // Motion: momentum after a drag, then a slow drift of its own.
    motion.intro = Math.min(1, motion.intro + dt / 1.6);
    if (!motion.held) {
      motion.idle += dt;
      motion.vel *= Math.exp(-dt * 2.2);
      const want = motion.idle > 1.2 ? 0.3 : 0;
      motion.drift += (want - motion.drift) * (1 - Math.exp(-dt * 0.9));
      motion.yaw += (motion.vel + motion.drift) * dt;
      motion.pitch *= Math.exp(-dt * 0.8);
    }

    // Ease the materials toward what was chosen.
    const k = 1 - Math.exp(-dt * 5);
    for (let i = 0; i < 3; i++) {
      look.f0[i] = lerp(look.f0[i], target.f0[i], k);
      look.ior[i] = lerp(look.ior[i], target.ior[i], k);
      look.absorb[i] = lerp(look.absorb[i], target.absorb[i], k);
    }
    look.rough = lerp(look.rough, target.rough, k);
    look.glow = lerp(look.glow, target.glow, k);

    const cy = Math.cos(motion.yaw);
    const sy = Math.sin(motion.yaw);
    const cp = Math.cos(motion.pitch);
    const sp = Math.sin(motion.pitch);
    // R = Rx(pitch) * Ry(yaw), column-major.
    const rot = [cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy];

    const f = view.framing;
    const focal = DIST / f.units;
    const tier = TIERS[tierIndex];
    const S = Math.min(width, height);
    gl.uniform2f(loc.res, width, height);
    gl.uniform1f(loc.scale, S);
    gl.uniform2f(loc.center, width / 2 + f.ox * S, height / 2 - f.oy * S);
    gl.uniform1f(loc.focal, focal);
    gl.uniformMatrix3fv(loc.rot, false, rot);
    gl.uniform3fv(loc.metal, look.f0);
    gl.uniform1f(loc.rough, look.rough);
    gl.uniform3fv(loc.ior, look.ior);
    gl.uniform3fv(loc.absorb, look.absorb);
    gl.uniform1f(loc.glow, look.glow);
    gl.uniform1i(loc.bounces, tier.bounces);
    gl.uniform1i(loc.paths, tier.paths);
    const intro = 1 - Math.pow(1 - motion.intro, 3);
    gl.uniform1f(loc.alpha, intro);
    gl.uniform1f(loc.exposure, 1.1 * (0.55 + 0.45 * intro));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Glints: crown facets that catch a light straight back at the camera.
    if (view.onSparkles) {
      sparkles.length = 0;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const cssS = Math.min(cssW, cssH);
      const ox = cssW / 2 + f.ox * cssS;
      const oy = cssH / 2 + f.oy * cssS;
      for (const facet of crown) {
        const n = rotate(rot, facet.n);
        const c = rotate(rot, facet.c);
        const toEye = norm([eye[0] - c[0], eye[1] - c[1], eye[2] - c[2]]);
        if (dot(n, toEye) < 0.15) continue;
        const d = -2 * dot(toEye, n);
        const r: Vec3 = [-toEye[0] - d * n[0], -toEye[1] - d * n[1], -toEye[2] - d * n[2]];
        let best = 0;
        for (const l of lights) best = Math.max(best, dot(r, l));
        const s = Math.max(0, (best - 0.975) / 0.025);
        if (s <= 0) continue;
        const rel: Vec3 = [c[0] - eye[0], c[1] - eye[1], c[2] - eye[2]];
        const z = dot(rel, cf);
        const x = ox + (dot(rel, cr) / z) * focal * cssS;
        const y = oy - (dot(rel, cu) / z) * focal * cssS;
        sparkles.push({ x, y, strength: s * s * (0.75 + 0.25 * Math.sin(time * 9 + facet.phase)) * intro });
      }
      sparkles.sort((a, b) => b.strength - a.strength);
      view.onSparkles(sparkles.slice(0, 4));
    }
  });
  view.loop = loop;
  new ResizeObserver(() => {
    resize();
    loop.invalidate();
  }).observe(canvas);
  return view;
}
