/**
 * The living lawn: tens of thousands of instanced blades in a low, warm light, a sky with a
 * treeline, falling leaves and snow. A footstep (the pointer, a finger, or the opening walk)
 * presses the blades down; they spring back as the trail fades. The page sets the season.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  Mesh,
  NormalBlending,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UnsignedByteType,
  Vector3,
  WebGLRenderTarget,
} from 'three';
import { createStage } from '../_kit/stage3d';
import { blendLook, type Blend } from './seasons';
import {
  FLAKE_FRAG,
  FLAKE_VERT,
  GRASS_FRAG,
  GRASS_VERT,
  GROUND_FRAG,
  GROUND_VERT,
  LEAF_FRAG,
  LEAF_VERT,
  SKY_FRAG,
  SKY_VERT,
  TRAIL_FRAG,
  TRAIL_VERT,
} from './shaders';

const rad = Math.PI / 180;
const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);

// Trail map: depth from D0 to D1 metres on a log scale, width d * K + PAD either side.
const D0 = 0.35;
const D1 = 32;
const K = 0.85;
const PAD = 0.4;
const TRAIL_SIZE = 256;

export type LawnOptions = { low: boolean; still: boolean };

type Layout = { vfov: number; horizon: number; height: number; sunAzK: number };

function layoutFor(aspect: number): Layout {
  // Wide screens get a long, low view; tall ones a taller field of view so the sky still fits.
  const t = clamp((aspect - 0.55) / (1.45 - 0.55));
  return {
    vfov: 58 + (36 - 58) * t,
    horizon: 0.41 + (0.44 - 0.41) * t,
    height: 0.72 + (0.62 - 0.72) * t,
    sunAzK: 0.5 + 0.5 * t,
  };
}

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One blade: a tapered strip from root (y 0) to tip (y 1), x is the side, -1 to 1. */
function bladeGeometry(segments: number) {
  const pos: number[] = [];
  const index: number[] = [];
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    pos.push(-1, t, 0, 1, t, 0);
  }
  pos.push(0, 1, 0);
  for (let i = 0; i < segments - 1; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const last = (segments - 1) * 2;
  index.push(last, last + 1, segments * 2);
  const g = new InstancedBufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setIndex(index);
  return g;
}

/**
 * Blades fill the view: exponential in depth so near ground is dense, as wide as the view
 * (plus a margin for the camera's small turns), in four interleaved layers so the count
 * can drop without leaving holes. Each layer is sorted near to far for early depth tests.
 */
function plantBlades(count: number, halfTan: number, seed = 7) {
  const r = rand(seed);
  const dMin = 0.45;
  const dMax = 62;
  const layers = 4;
  const per = Math.floor(count / layers);
  const root = new Float32Array(per * layers * 4);
  const shape = new Float32Array(per * layers * 4);
  let o = 0;
  for (let l = 0; l < layers; l++) {
    const ds: number[] = [];
    for (let i = 0; i < per; i++) ds.push(dMin * Math.pow(dMax / dMin, r()));
    ds.sort((a, b) => a - b);
    for (const d of ds) {
      const hw = d * halfTan + 0.35;
      const x = (r() * 2 - 1) * hw;
      root[o] = x;
      root[o + 1] = -d;
      root[o + 2] = r() * Math.PI * 2;
      root[o + 3] = r();
      const tall = Math.pow(r(), 1.6);
      shape[o] = (0.1 + 0.17 * tall) * (1 + d * 0.012);
      shape[o + 1] = (0.0045 + 0.0045 * r()) * (1 + d * 0.11);
      shape[o + 2] = 0.12 + 0.42 * r();
      shape[o + 3] = r();
      o += 4;
    }
  }
  return { root, shape, count: per * layers };
}

export function createLawn(canvas: HTMLCanvasElement, options: LawnOptions) {
  const { low, still } = options;

  let aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1) || 1.6;
  let layout = layoutFor(aspect);

  const state = {
    /** Where the page wants the year to be, 0 summer to 3 spring. */
    target: 0,
    season: 0,
    /** Pointer position over the window, -1 to 1, for a little parallax. */
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    /** 0 to 1: the lawn fades up from dark on the first load. */
    reveal: still ? 1 : 0,
  };
  const look: Blend = blendLook(0);
  let ready = false;

  const stage = createStage(
    canvas,
    (time, dt, parts) => frame(time, dt, parts.renderer, parts.camera),
    {
      fov: layout.vfov,
      maxDpr: low ? 1.5 : 1.5,
      onResize: (a) => {
        aspect = a;
        layout = layoutFor(a);
        if (ready) {
          camera.fov = layout.vfov;
          camera.updateProjectionMatrix();
          replantIfNeeded();
        }
      },
    },
  );
  if (!stage) return null;
  const { renderer, scene, camera } = stage;
  camera.near = 0.05;
  camera.far = 600;
  camera.fov = layout.vfov;
  camera.updateProjectionMatrix();
  renderer.setClearColor(0x0d120c, 1);
  renderer.sortObjects = true;

  /* ---------- the trail ---------- */

  const rtOptions = {
    type: UnsignedByteType,
    format: RGBAFormat,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
  };
  let rtRead = new WebGLRenderTarget(TRAIL_SIZE, TRAIL_SIZE, rtOptions);
  let rtWrite = new WebGLRenderTarget(TRAIL_SIZE, TRAIL_SIZE, rtOptions);
  const trailMap = [D0, Math.log(D1 / D0), K, PAD];
  const trailUniforms = {
    uPrev: { value: rtRead.texture },
    uSeg: { value: [0, 0, 0, 0] },
    uRadius: { value: 0.3 },
    uStamp: { value: 0 },
    uDecay: { value: 0 },
    uMove: { value: [0, -1] },
    uTrailMap: { value: trailMap },
  };
  const trailScene = new Scene();
  const trailCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const trailQuad = new Mesh(
    new PlaneGeometry(2, 2),
    new ShaderMaterial({ uniforms: trailUniforms, vertexShader: TRAIL_VERT, fragmentShader: TRAIL_FRAG, depthTest: false, depthWrite: false }),
  );
  trailQuad.frustumCulled = false;
  trailScene.add(trailQuad);

  /* ---------- shared uniforms ---------- */

  const v3 = () => ({ value: new Vector3() });
  const shared = {
    uTime: { value: 0 },
    uSunDir: v3(),
    uSunCol: v3(),
    uSkyTop: v3(),
    uSkyHor: v3(),
    uFogCol: v3(),
    uAmb: v3(),
    uSnowAlb: { value: new Vector3(0.94, 0.955, 0.98) },
    uFogDen: { value: 0.03 },
    uSnow: { value: 0 },
    uTrail: { value: rtRead.texture },
    uTrailMap: { value: trailMap },
  };
  const seasonal = {
    uWind: { value: [0.86, 0.5] },
    uWindAmp: { value: 0.5 },
    uHeightK: { value: 1 },
    uStripe: { value: 1 },
    uWinter: { value: 0 },
  };

  /* ---------- blades ---------- */

  const bladeCount = low ? 30000 : 96000;
  const blade = bladeGeometry(low ? 4 : 5);
  const grassUniforms = {
    ...shared,
    ...seasonal,
    uRootCol: v3(),
    uTipCol: v3(),
    uAltCol: v3(),
    uAltAmt: { value: 0.2 },
  };
  const grass = new Mesh(blade, new ShaderMaterial({ uniforms: grassUniforms, vertexShader: GRASS_VERT, fragmentShader: GRASS_FRAG }));
  grass.frustumCulled = false;
  grass.renderOrder = 1;
  let plantedTan = 0;
  let planted = 0;
  const viewHalfTan = () => Math.tan((layout.vfov / 2) * rad) * aspect;
  function plant() {
    plantedTan = Math.min(viewHalfTan() * 1.08 + 0.06, 1.6);
    const share = clamp(plantedTan / 0.72, 0.45, 1.25);
    const field = plantBlades(Math.round(bladeCount * share), plantedTan);
    blade.setAttribute('aRoot', new InstancedBufferAttribute(field.root, 4));
    blade.setAttribute('aShape', new InstancedBufferAttribute(field.shape, 4));
    planted = field.count;
    blade.instanceCount = Math.round(planted * quality);
  }
  function replantIfNeeded() {
    const want = viewHalfTan() * 1.08 + 0.06;
    if (want > plantedTan * 1.04 || want < plantedTan * 0.6) plant();
  }
  let quality = 1;
  plant();

  /* ---------- ground ---------- */

  const groundUniforms = {
    ...shared,
    ...seasonal,
    uGroundCol: v3(),
    uGroundFar: v3(),
    uLitter: { value: 0 },
  };
  const groundGeo = new PlaneGeometry(900, 900);
  groundGeo.rotateX(-Math.PI / 2);
  groundGeo.translate(0, 0, -440);
  const ground = new Mesh(groundGeo, new ShaderMaterial({ uniforms: groundUniforms, vertexShader: GROUND_VERT, fragmentShader: GROUND_FRAG }));
  ground.frustumCulled = false;
  ground.renderOrder = 2;

  /* ---------- sky ---------- */

  const skyUniforms = {
    ...shared,
    uTreeCol: v3(),
    uCloud: { value: 0.5 },
    uSunVis: { value: 1 },
    uBare: { value: 0 },
  };
  const sky = new Mesh(
    new PlaneGeometry(2, 2),
    new ShaderMaterial({ uniforms: skyUniforms, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, depthWrite: false }),
  );
  sky.frustumCulled = false;
  sky.renderOrder = 4;

  /* ---------- falling leaves ---------- */

  const leafCount = low ? 150 : 380;
  const leafGeo = new InstancedBufferGeometry();
  leafGeo.setAttribute('position', new Float32BufferAttribute([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3));
  leafGeo.setIndex([0, 1, 2, 0, 2, 3]);
  {
    const r = rand(31);
    const a = new Float32Array(leafCount * 4);
    const tint = new Float32Array(leafCount * 3);
    const palette = [
      [0.8, 0.34, 0.06],
      [0.66, 0.16, 0.05],
      [0.86, 0.6, 0.13],
      [0.74, 0.46, 0.08],
      [0.46, 0.24, 0.08],
    ];
    for (let i = 0; i < leafCount; i++) {
      const d = 0.9 * Math.pow(14 / 0.9, r());
      a[i * 4] = (r() * 2 - 1) * (d * 0.72 + 0.4);
      a[i * 4 + 1] = -d;
      a[i * 4 + 2] = r();
      a[i * 4 + 3] = r();
      const c = palette[Math.floor(r() * palette.length)];
      const k = 0.85 + r() * 0.3;
      tint[i * 3] = c[0] * k;
      tint[i * 3 + 1] = c[1] * k;
      tint[i * 3 + 2] = c[2] * k;
    }
    leafGeo.setAttribute('aLeaf', new InstancedBufferAttribute(a, 4));
    leafGeo.setAttribute('aTint', new InstancedBufferAttribute(tint, 3));
    leafGeo.instanceCount = leafCount;
  }
  const leafUniforms = { ...shared, uFall: { value: 0 }, uHeightK: seasonal.uHeightK, uWind: seasonal.uWind };
  const leafMat = new ShaderMaterial({
    uniforms: leafUniforms,
    vertexShader: LEAF_VERT,
    fragmentShader: LEAF_FRAG,
    side: DoubleSide,
    alphaToCoverage: true,
  });
  const leaves = new Mesh(leafGeo, leafMat);
  leaves.frustumCulled = false;
  leaves.renderOrder = 3;

  /* ---------- snow and motes ---------- */

  const flakes = (count: number, mode: number, seed: number) => {
    const r = rand(seed);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
    const p = new Float32Array(count * 4);
    for (let i = 0; i < p.length; i++) p[i] = r();
    g.setAttribute('aP', new BufferAttribute(p, 4));
    const uniforms = { ...shared, uAmt: { value: 0 }, uScale: { value: 800 }, uMode: { value: mode }, uWind: seasonal.uWind };
    const points = new Points(
      g,
      new ShaderMaterial({
        uniforms,
        vertexShader: FLAKE_VERT,
        fragmentShader: FLAKE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: mode === 0 ? NormalBlending : AdditiveBlending,
      }),
    );
    points.frustumCulled = false;
    points.renderOrder = 6;
    return { points, uniforms };
  };
  const snow = flakes(low ? 900 : 2600, 0, 11);
  const motes = flakes(low ? 160 : 420, 1, 23);

  scene.add(grass, ground, sky, leaves, snow.points, motes.points);

  /* ---------- footsteps ---------- */

  type Pt = { x: number; z: number };
  let pending: { a: Pt; b: Pt } | null = null;
  let last: Pt | null = null;
  let lastAt = 0;
  let move = { x: 0, z: -1 };
  const ndc = new Vector3();
  const dir = new Vector3();

  function groundHit(clientX: number, clientY: number): Pt | null {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1, 0.5);
    ndc.unproject(camera);
    dir.copy(ndc).sub(camera.position).normalize();
    if (dir.y > -0.012) return null;
    const t = -camera.position.y / dir.y;
    const x = camera.position.x + dir.x * t;
    const z = camera.position.z + dir.z * t;
    const d = -z;
    if (d < D0 || d > D1 * 0.9) return null;
    return { x, z };
  }

  function stepWorld(p: Pt, now: number) {
    if (last && now - lastAt < 450) {
      const dx = p.x - last.x;
      const dz = p.z - last.z;
      const l = Math.hypot(dx, dz);
      if (l < 0.004) return;
      move = { x: dx / l, z: dz / l };
      if (pending) pending.b = p;
      else pending = { a: last, b: p };
    } else {
      pending = { a: p, b: p };
    }
    last = p;
    lastAt = now;
    loopRef?.invalidate();
  }

  /** A footstep where the pointer or finger is, in client pixels. */
  function step(clientX: number, clientY: number) {
    const p = groundHit(clientX, clientY);
    if (!p) {
      last = null;
      return;
    }
    stepWorld(p, performance.now());
  }

  function lift() {
    last = null;
  }

  /** A path across the lawn in world metres, walked over `duration` seconds. */
  let walk: { pts: Pt[]; t: number; duration: number } | null = null;
  function walkPath(points: Array<[number, number]>, duration: number) {
    walk = { pts: points.map(([x, z]) => ({ x, z })), t: 0, duration };
    last = null;
  }
  function samplePath(pts: Pt[], u: number): Pt {
    const f = clamp(u) * (pts.length - 1);
    const i = Math.min(Math.floor(f), pts.length - 2);
    const k = f - i;
    // Catmull-Rom through the points.
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cr = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * k + (2 * a - 5 * b + 4 * c - d) * k * k + (-a + 3 * b - 3 * c + d) * k * k * k);
    return { x: cr(p0.x, p1.x, p2.x, p3.x), z: cr(p0.z, p1.z, p2.z, p3.z) };
  }

  /** Presses a whole path at once, for the still frame shown with reduced motion. */
  const instantQueue: Array<{ a: Pt; b: Pt }> = [];
  function pressPath(points: Array<[number, number]>) {
    const pts = points.map(([x, z]) => ({ x, z }));
    let prev = samplePath(pts, 0);
    for (let i = 1; i <= 40; i++) {
      const p = samplePath(pts, i / 40);
      instantQueue.push({ a: prev, b: p });
      prev = p;
    }
    loopRef?.invalidate();
  }

  let decayBank = 0;
  function runTrail(dt: number) {
    let seg = pending;
    pending = null;
    if (!seg && instantQueue.length) seg = instantQueue.shift()!;
    // The trail is stored in 8 bits, so fading happens in whole steps of 1/255, banked
    // until there is at least one to spend. That keeps the fade the same at any frame rate.
    const fade = 5.5 + look.winter * 4;
    decayBank += still ? 0 : dt / fade;
    const steps = Math.floor(decayBank * 255);
    decayBank -= steps / 255;
    trailUniforms.uDecay.value = steps > 0 ? (steps + 0.02) / 255 : 0;
    if (seg) {
      const mx = (seg.a.x + seg.b.x) / 2;
      const mz = (seg.a.z + seg.b.z) / 2;
      const d = Math.hypot(mx - camera.position.x, mz - camera.position.z);
      trailUniforms.uSeg.value = [seg.a.x, seg.a.z, seg.b.x, seg.b.z];
      trailUniforms.uRadius.value = clamp(0.055 * d + 0.075, 0.11, 1.1);
      trailUniforms.uMove.value = [move.x, move.z];
      trailUniforms.uStamp.value = 1;
    } else {
      trailUniforms.uStamp.value = 0;
    }
    trailUniforms.uPrev.value = rtRead.texture;
    renderer.setRenderTarget(rtWrite);
    renderer.render(trailScene, trailCam);
    renderer.setRenderTarget(null);
    const swap = rtRead;
    rtRead = rtWrite;
    rtWrite = swap;
    shared.uTrail.value = rtRead.texture;
    if (instantQueue.length) loopRef?.invalidate();
  }

  /* ---------- per frame ---------- */

  let loopRef: { invalidate: () => void } | null = null;
  let slowFrames = 0;
  let sampled = 0;
  let qualityLevel = 0;

  const setV = (u: { value: Vector3 }, c: [number, number, number], k = 1) => u.value.set(c[0] * k, c[1] * k, c[2] * k);

  function frame(time: number, dt: number, _renderer: unknown, cam: typeof camera) {
    // The year follows the page, eased so a flick of the wheel still looks like weather.
    if (still) state.season = state.target;
    else state.season += (state.target - state.season) * (1 - Math.exp(-dt * 2.4));
    blendLook(state.season, look);

    state.px += (state.tx - state.px) * (1 - Math.exp(-dt * 2));
    state.py += (state.ty - state.py) * (1 - Math.exp(-dt * 2));
    if (!still && state.reveal < 1) state.reveal = Math.min(1, state.reveal + dt / 2.2);

    const t = still ? 2.5 : time;
    shared.uTime.value = t;

    // Camera: low over the lawn, a slow drift, a little parallax.
    const breathe = still ? 0 : 1;
    const pitchBase = -Math.atan((0.5 - layout.horizon) * 2 * Math.tan((layout.vfov / 2) * rad)) / rad;
    const pitch = (pitchBase + look.pitch - state.py * 0.9) * rad;
    const yaw = (look.yaw + state.px * 1.4 + Math.sin(t * 0.07) * 0.6 * breathe) * rad;
    cam.position.set(Math.sin(t * 0.11) * 0.05 * breathe, layout.height + Math.sin(t * 0.19) * 0.008 * breathe, 0);
    cam.rotation.set(pitch, -yaw, 0, 'YXZ');
    cam.updateMatrixWorld();

    // Light and colour.
    const az = look.sunAz * layout.sunAzK * rad;
    const el = look.sunEl * rad;
    shared.uSunDir.value.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    const lift = 0.15 + 0.85 * easeOut(state.reveal);
    setV(shared.uSunCol, look.sun, lift);
    setV(shared.uSkyTop, look.skyTop, lift);
    setV(shared.uSkyHor, look.skyHor, lift);
    setV(shared.uFogCol, look.fog, lift);
    setV(shared.uAmb, look.amb, lift);
    shared.uFogDen.value = look.fogDen;
    shared.uSnow.value = look.snow;
    seasonal.uWindAmp.value = look.wind;
    seasonal.uHeightK.value = look.height;
    seasonal.uStripe.value = look.stripe;
    seasonal.uWinter.value = look.winter;
    seasonal.uWind.value = [Math.cos(0.52 + Math.sin(t * 0.05) * 0.2), Math.sin(0.52 + Math.sin(t * 0.05) * 0.2)];

    setV(grassUniforms.uRootCol, look.root);
    setV(grassUniforms.uTipCol, look.tip);
    setV(grassUniforms.uAltCol, look.alt);
    grassUniforms.uAltAmt.value = look.altAmt;
    setV(groundUniforms.uGroundCol, look.ground);
    setV(groundUniforms.uGroundFar, look.groundFar);
    groundUniforms.uLitter.value = look.litter;
    setV(skyUniforms.uTreeCol, look.tree, lift);
    skyUniforms.uCloud.value = look.cloud;
    skyUniforms.uSunVis.value = look.sunVis;
    skyUniforms.uBare.value = look.weights[2];

    leafUniforms.uFall.value = look.leafFall;
    leaves.visible = look.leafFall > 0.01;
    const h = canvas.clientHeight * renderer.getPixelRatio();
    const scale = h / (2 * Math.tan((cam.fov / 2) * rad));
    snow.uniforms.uAmt.value = look.snowFall;
    snow.uniforms.uScale.value = scale;
    snow.points.visible = look.snowFall > 0.01;
    motes.uniforms.uAmt.value = look.motes * 0.8;
    motes.uniforms.uScale.value = scale;
    motes.points.visible = look.motes > 0.01;

    // Footsteps: the opening walk, then whoever is at the screen.
    if (walk) {
      walk.t += dt;
      const u = walk.t / walk.duration;
      const p = samplePath(walk.pts, Math.min(u, 1));
      stepWorld(p, performance.now());
      if (u >= 1) {
        walk = null;
        last = null;
      }
    }
    runTrail(still ? 0 : dt);

    // Keep it smooth on slower graphics: fewer blades before anything else.
    if (!still && dt > 0) {
      sampled += 1;
      if (dt > 1 / 38) slowFrames += 1;
      if (sampled >= 90) {
        if (slowFrames > 40 && qualityLevel < 2) {
          qualityLevel += 1;
          quality = qualityLevel === 1 ? 0.7 : 0.5;
          blade.instanceCount = Math.round(planted * quality);
        }
        sampled = 0;
        slowFrames = 0;
      }
    }
  }

  loopRef = stage.loop;
  ready = true;

  /** Where on screen a point in the world lands, for the hint label. */
  const tmp = new Vector3();
  function project(x: number, y: number, z: number) {
    tmp.set(x, y, z).project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * canvas.clientWidth, y: (-tmp.y * 0.5 + 0.5) * canvas.clientHeight };
  }

  return { stage, state, step, lift, walkPath, pressPath, project };
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export type Lawn = NonNullable<ReturnType<typeof createLawn>>;
