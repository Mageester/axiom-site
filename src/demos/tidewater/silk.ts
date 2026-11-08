/**
 * The silk: a cloth simulation hung from two corners, lit as shot silk, breathing.
 *
 * The breath moves the sheet two ways. The pins rise and spread a little on the in-breath,
 * so the swag opens and the folds soften, and settle back on the out-breath. At the same
 * time a slow current of air billows the sheet toward you. Air acts along the cloth's normal
 * (moving through air edge-on costs nothing; face-on it is heavily damped), which is what
 * makes it float like silk instead of swinging like canvas.
 *
 * The pointer or a finger is a breeze: its speed pushes the cloth away and along, and the
 * constraints carry the ripple across the sheet. A click or a tap is a soft puff.
 *
 * The camera fits the hanging sheet into `[data-silk-slot]`, so the page's CSS decides
 * where the silk sits at every screen size.
 */
import { BufferAttribute, BufferGeometry, Color, DoubleSide, DynamicDrawUsage, Mesh, ShaderMaterial, Vector3, Vector4 } from 'three';
import { createStage, type Stage } from '../_kit/stage3d';
import { reducedMotion } from '../_kit/motion';
import { Cloth } from './cloth';
import { SILK_FRAGMENT, SILK_VERTEX } from './shaders';
import type { BreathClock } from './breath';

export type Silk = {
  stage: Stage;
  /** A soft puff of air at a point on screen. */
  puff: (clientX: number, clientY: number, strength?: number) => void;
};

const FOV = 24;
const WIDTH = 4.2;
const HEIGHT = 4.1;
// the sheet is turned a little, so its billow reads in profile
const TURN = 0.26;
// what the hanging sheet covers through a whole breath, as the camera sees it
const BOUNDS = { cx: -0.12, cy: -0.13, w: 4.6, h: 4.72 };

const smoothstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export function createSilk(canvas: HTMLCanvasElement, hero: HTMLElement, clock: BreathClock, onReady: () => void): Silk | null {
  const slot = hero.querySelector<HTMLElement>('[data-silk-slot]') ?? canvas;
  const coarse = matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;
  const nx = coarse ? 46 : 72;
  const ny = coarse ? 44 : 68;
  const iterations = coarse ? 4 : 5;

  const cloth = new Cloth({ nx, ny, width: WIDTH, height: HEIGHT, pinCols: [0, nx - 1], shear: 0.6, bend: 0.48 });

  // pins: left a little higher than right, so the swag falls asymmetrically
  const placePins = (b: number) => {
    const span = WIDTH * (0.665 + 0.075 * b);
    const lift = 0.15 * b;
    const fwd = 0.1 * b;
    cloth.setPin(0, -span / 2, 2.02 + lift, fwd);
    cloth.setPin(1, span / 2, 1.78 + lift * 0.85, fwd * 0.8);
  };
  placePins(0.3);
  cloth.drape(1, 0.9);

  // geometry straight from the simulation's arrays
  const geometry = new BufferGeometry();
  const position = new BufferAttribute(cloth.pos, 3).setUsage(DynamicDrawUsage);
  const normal = new BufferAttribute(cloth.normal, 3).setUsage(DynamicDrawUsage);
  const tangent = new BufferAttribute(cloth.tangent, 3).setUsage(DynamicDrawUsage);
  const fold = new BufferAttribute(cloth.fold, 1).setUsage(DynamicDrawUsage);
  geometry.setAttribute('position', position);
  geometry.setAttribute('normal', normal);
  geometry.setAttribute('aTan', tangent);
  geometry.setAttribute('aFold', fold);
  geometry.setAttribute('uv', new BufferAttribute(cloth.uv, 2));
  geometry.setIndex(new BufferAttribute(cloth.index, 1));

  const lin = (hex: string, k = 1) => {
    const c = new Color(hex);
    return new Vector3(c.r * k, c.g * k, c.b * k);
  };
  const uniforms = {
    uKeyDir: { value: new Vector3(-0.6, 0.66, 0.58).normalize() },
    uKeyCol: { value: lin('#fff3e4', 2.45) },
    uBackDir: { value: new Vector3(0.5, 0.45, -0.74).normalize() },
    uBackCol: { value: lin('#ffd9b0', 1.2) },
    uSky: { value: lin('#6f9e98', 0.5) },
    uGround: { value: lin('#2c2620', 0.4) },
    uBase: { value: lin('#ddd4c6', 0.5) },
    uStreak: { value: lin('#fffaf2', 1) },
    uSheen: { value: lin('#f6d9bb', 1) },
    uGlow: { value: lin('#ffc79c', 1) },
    uGlowSpot: { value: new Vector4(1.0, 0.7, 1.7, 1) },
    uGlowGain: { value: 1 },
    uExposure: { value: reducedMotion ? 1 : 0.5 },
    uFoldScale: { value: coarse ? 3.2 : 4.5 },
    uTime: { value: 0 },
  };
  const material = new ShaderMaterial({
    vertexShader: SILK_VERTEX,
    fragmentShader: SILK_FRAGMENT,
    uniforms,
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.rotation.y = TURN;
  mesh.updateMatrixWorld();

  // air, breath and the pointer's breeze
  const gravity = 6.2;
  const aero = 3.1;
  const damping = 1.1;
  const breathNow = { b: 0.3, depth: reducedMotion ? 0.6 : 0.42 };
  const breeze = { x: 0, y: 0, vx: 0, vy: 0, speed: 0, lastT: 0, has: false };
  const puffs: { x: number; y: number; t: number; k: number }[] = [];
  let simTime = 0;

  const forces = (dtSub: number) => {
    const { pos, prev, normal: N, acc, n } = cloth;
    const inv = 1 / Math.max(dtSub, 1e-4);
    const lift = breathNow.b * breathNow.depth;
    const wz0 = 0.1 + 1.0 * lift;
    const wy0 = 0;
    const t = simTime;
    const { x: bx, y: by, speed: bs, vx: bvx, vy: bvy } = breeze;
    const r2 = 1 / (0.6 * 0.6);
    const live = puffs.filter((p) => t - p.t < 0.6);
    for (let i = 0; i < n; i++) {
      const o = i * 3;
      const x = pos[o];
      const y = pos[o + 1];
      // slow, layered drift, so the sheet is never perfectly still
      const wz = wz0 + 0.16 * Math.sin(0.9 * x + 0.47 * t) * Math.cos(0.7 * y - 0.31 * t) + 0.08 * Math.sin(1.9 * x - 0.83 * t + y * 1.3);
      const wx = 0.1 * Math.sin(0.6 * y + 0.37 * t);
      const vx = (x - prev[o]) * inv;
      const vy = (y - prev[o + 1]) * inv;
      const vz = (pos[o + 2] - prev[o + 2]) * inv;
      const nX = N[o];
      const nY = N[o + 1];
      const nZ = N[o + 2];
      const f = aero * (nX * (wx - vx) + nY * (wy0 - vy) + nZ * (wz - vz));
      let ax = nX * f;
      let ay = nY * f - gravity;
      let az = nZ * f;
      if (bs > 0.02) {
        const dx = x - bx;
        const dy = y - by;
        const fall = Math.exp(-(dx * dx + dy * dy) * r2);
        if (fall > 0.01) {
          ax += bvx * fall * 2;
          ay += bvy * fall * 2;
          az -= bs * fall * 5;
        }
      }
      for (const p of live) {
        const age = t - p.t;
        const dx = x - p.x;
        const dy = y - p.y;
        const front = age * 2.6;
        const d = Math.sqrt(dx * dx + dy * dy) - front;
        az -= Math.exp(-d * d * 8) * (1 - age / 0.6) * p.k * 22;
      }
      acc[o] = ax;
      acc[o + 1] = ay;
      acc[o + 2] = az;
    }
  };

  const simulate = (dt: number) => {
    const substeps = Math.min(5, Math.ceil(dt / (1 / 95)));
    const dtSub = dt / substeps;
    for (let s = 0; s < substeps; s++) {
      simTime += dtSub;
      forces(dtSub);
      cloth.step(dtSub, iterations, damping);
    }
    cloth.computeShading();
  };

  // settle before the first frame: briefly in motion, fully for the still frame
  cloth.computeShading();
  const warm = reducedMotion ? 480 : 90;
  for (let i = 0; i < warm; i++) {
    placePins(breathNow.b);
    simTime += 1 / 90;
    forces(1 / 90);
    cloth.step(1 / 90, iterations, 2.4);
    if (i % 3 === 0) cloth.computeShading();
  }
  cloth.computeShading();

  // framing: fit BOUNDS into the slot, looking straight at the sheet
  const cam = { x: 0, y: 0, z: 10, px: 0, py: 0, tx: 0, ty: 0 };
  const frame = () => {
    const c = canvas.getBoundingClientRect();
    const r = slot.getBoundingClientRect();
    if (!c.width || !c.height || !r.width || !r.height) return;
    const ppu = Math.min(r.width / BOUNDS.w, r.height / BOUNDS.h);
    const visH = c.height / ppu;
    cam.z = visH / (2 * Math.tan(((FOV / 2) * Math.PI) / 180));
    const sx = r.left + r.width / 2 - c.left;
    const sy = r.top + r.height / 2 - c.top;
    cam.x = BOUNDS.cx - (sx - c.width / 2) / ppu;
    cam.y = BOUNDS.cy + (sy - c.height / 2) / ppu;
  };

  // a point on screen, on the plane the sheet hangs in, in the sheet's own coordinates
  const ndc = new Vector3();
  const planeN = new Vector3(Math.sin(TURN), 0, Math.cos(TURN));
  const toWorld = (clientX: number, clientY: number, camera: Stage['camera']) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1, 0.5).unproject(camera);
    ndc.sub(camera.position).normalize();
    const k = -camera.position.dot(planeN) / (ndc.dot(planeN) || 1e-4);
    const hit = camera.position.clone().addScaledVector(ndc, k);
    mesh.worldToLocal(hit);
    return { x: hit.x, y: hit.y };
  };

  let exposure = reducedMotion ? 1 : 0.5;
  // in motion, the script fades the canvas in itself (see the loop); the stylesheet's fade is for the still
  let lit = reducedMotion;
  if (!reducedMotion) {
    canvas.style.transition = 'none';
    canvas.style.opacity = '0';
  }
  let frames = 0;
  const born = performance.now();
  const stage = createStage(
    canvas,
    (time, dt, { camera }) => {
      uniforms.uTime.value = time;
      if (!reducedMotion) {
        const s = clock.sample();
        breathNow.b += (s.b - breathNow.b) * (1 - Math.exp(-dt * 5));
        breathNow.depth += (s.depth - breathNow.depth) * (1 - Math.exp(-dt * 1.2));
        placePins(breathNow.b * (0.4 + breathNow.depth * 0.6));

        const fade = Math.exp(-dt * 5);
        breeze.speed *= fade;
        breeze.vx *= fade;
        breeze.vy *= fade;

        // fast-forward while the light comes up, so the sheet has found its drape by the time you see it.
        // Wall-clock, so a busy GPU never leaves the silk in the dark.
        const age = (performance.now() - born) / 1000;
        const pace = age < 1.2 ? 2.6 : age < 2.4 ? 2.6 - (age - 1.2) * 1.5 : 0.8;
        simulate(Math.min(dt, 1 / 24) * pace);
        position.needsUpdate = true;
        normal.needsUpdate = true;
        tangent.needsUpdate = true;
        fold.needsUpdate = true;

        // the light comes up from dim, never from black, and the sheet fades in with it,
        // so it is never darker than the room behind it
        const rise = smoothstep((age - 0.25) / 2.4);
        exposure = 0.5 + 0.5 * rise;
        if (!lit) {
          canvas.style.opacity = String(smoothstep((age - 0.25) / 1.8));
          if (rise >= 1) {
            lit = true;
            canvas.style.opacity = '';
          }
        }
        const lift = breathNow.b * breathNow.depth;
        uniforms.uExposure.value = exposure * (0.97 + 0.06 * lift);
        uniforms.uGlowGain.value = 0.85 + 0.5 * lift;

        cam.px += (cam.tx - cam.px) * (1 - Math.exp(-dt * 1.6));
        cam.py += (cam.ty - cam.py) * (1 - Math.exp(-dt * 1.6));
      }
      camera.position.set(cam.x + cam.px * 0.2, cam.y + cam.py * 0.12, cam.z);
      camera.lookAt(cam.x + cam.px * 0.07, cam.y + cam.py * 0.04, 0);
      frames += 1;
      if (frames === 2) onReady();
    },
    { fov: FOV, onResize: () => frame() },
  );
  if (!stage) return null;
  stage.scene.add(mesh);
  frame();
  new ResizeObserver(() => {
    frame();
    stage.loop.invalidate();
  }).observe(slot);
  stage.loop.invalidate();
  if (import.meta.env.DEV) (window as unknown as { __silk: unknown }).__silk = { cloth, cam, breathNow, uniforms };

  if (!reducedMotion) {
    const inHero = (clientY: number) => {
      const r = hero.getBoundingClientRect();
      return clientY >= r.top && clientY <= r.bottom;
    };
    const move = (clientX: number, clientY: number) => {
      if (!inHero(clientY)) return;
      const p = toWorld(clientX, clientY, stage.camera);
      const now = performance.now();
      if (breeze.has) {
        const dts = Math.max(0.008, (now - breeze.lastT) / 1000);
        const vx = Math.max(-7, Math.min(7, (p.x - breeze.x) / dts));
        const vy = Math.max(-7, Math.min(7, (p.y - breeze.y) / dts));
        breeze.speed = Math.max(breeze.speed * 0.6, Math.min(7, Math.hypot(vx, vy)));
        breeze.vx = breeze.vx * 0.5 + vx * 0.5;
        breeze.vy = breeze.vy * 0.5 + vy * 0.5;
      }
      breeze.x = p.x;
      breeze.y = p.y;
      breeze.lastT = now;
      breeze.has = true;
    };
    window.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType === 'touch') return;
        move(event.clientX, event.clientY);
        cam.tx = (event.clientX / window.innerWidth) * 2 - 1;
        cam.ty = -((event.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true },
    );
    hero.addEventListener(
      'touchstart',
      (event) => {
        const t = event.touches[0];
        if (!t) return;
        breeze.has = false;
        move(t.clientX, t.clientY);
      },
      { passive: true },
    );
    hero.addEventListener(
      'touchmove',
      (event) => {
        const t = event.touches[0];
        if (t) move(t.clientX, t.clientY);
      },
      { passive: true },
    );
    hero.addEventListener('pointerdown', (event) => {
      if ((event.target as Element).closest('a, button, input, label, select, textarea')) return;
      const p = toWorld(event.clientX, event.clientY, stage.camera);
      puffs.push({ x: p.x, y: p.y, t: simTime, k: 1 });
      if (puffs.length > 4) puffs.shift();
    });
  }

  return {
    stage,
    puff(clientX, clientY, strength = 1) {
      if (reducedMotion) return;
      const p = toWorld(clientX, clientY, stage.camera);
      puffs.push({ x: p.x, y: p.y, t: simTime, k: strength });
      if (puffs.length > 4) puffs.shift();
    },
  };
}
