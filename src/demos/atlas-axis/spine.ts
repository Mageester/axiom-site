/**
 * The porcelain spine: 24 vertebrae and a sacrum, sculpted in code, lit like a museum
 * piece, and posed along a curve that can be crooked or aligned, vertebra by vertebra.
 */
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  CatmullRomCurve3,
  DirectionalLight,
  Euler,
  Group,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PlaneGeometry,
  PCFShadowMap,
  PMREMGenerator,
  Quaternion,
  ShadowMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
  Raycaster,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createStage, type Stage } from '../_kit/stage3d';
import { bones, buildBone, type BoneKind } from './bones';

export type Region = 'neck' | 'upper' | 'lower' | 'pelvis';
export const regions: Region[] = ['neck', 'upper', 'lower', 'pelvis'];

const kinds: BoneKind[] = [
  'atlas', 'axis',
  'cervical', 'cervical', 'cervical', 'cervical', 'cervical',
  'thoracicUpper', 'thoracicUpper', 'thoracicUpper', 'thoracicUpper', 'thoracicUpper', 'thoracicUpper',
  'thoracicLower', 'thoracicLower', 'thoracicLower', 'thoracicLower', 'thoracicLower', 'thoracicLower',
  'lumbar', 'lumbar', 'lumbar', 'lumbar', 'lumbar',
  'sacrum',
];
const scales = [
  1.0, 1.05,
  0.92, 0.96, 1.0, 1.05, 1.12,
  0.95, 0.98, 1.0, 1.03, 1.06, 1.1,
  0.98, 1.02, 1.06, 1.1, 1.14, 1.18,
  1.0, 1.05, 1.09, 1.12, 1.14,
  1.15,
];
export const BONES = kinds.length;

export const regionRange: Record<Region, [number, number]> = {
  neck: [0, 6],
  upper: [7, 18],
  lower: [19, 23],
  pelvis: [24, 24],
};

export const regionOf = (index: number): Region =>
  index <= 6 ? 'neck' : index <= 18 ? 'upper' : index <= 23 ? 'lower' : 'pelvis';

const PORCELAIN = new Color('#faf7f0');
const COBALT = new Color('#2b3bff');
const CORAL = new Color('#ff7a63');
const CORAL_HOT = new Color('#ff4f3d');

// Control points, top of the neck to the tailbone. Curved more than a clinical spine, on purpose.
const ALIGNED: [number, number, number][] = [
  [0, 8.6, 0.9],
  [0, 6.9, 0.55],
  [0, 5.0, -0.25],
  [0, 2.8, -1.25],
  [0, 0.6, -1.1],
  [0, -1.6, 0.0],
  [0, -3.8, 0.95],
  [0, -5.6, 0.6],
  [0, -7.0, -0.6],
];
const CROOKED: [number, number, number][] = [
  [0.9, 8.4, 2.4],
  [1.6, 6.8, 1.4],
  [1.3, 5.0, -0.8],
  [-0.3, 2.9, -2.3],
  [-1.7, 0.6, -2.0],
  [-2.0, -1.6, -0.5],
  [-1.0, -3.8, 0.6],
  [0.4, -5.6, 0.9],
  [1.2, -7.0, -0.1],
];

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Pose = { p: Vector3[]; q: Quaternion[] };

function buildPose(points: [number, number, number][], target: number, t: number[], crooked: number): Pose {
  const make = (k: number) => new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x * k, y * k, z * k)), false, 'centripetal');
  const k = target / make(1).getLength();
  const curve = make(k);
  const p: Vector3[] = [];
  const q: Quaternion[] = [];
  const m = new Matrix4();
  const F0 = new Vector3(0, 0, 1);
  t.forEach((u, i) => {
    const pos = curve.getPointAt(u);
    const up = curve.getTangentAt(u).negate().normalize();
    const f = F0.clone().addScaledVector(up, -F0.dot(up)).normalize();
    const right = new Vector3().crossVectors(up, f).normalize();
    m.makeBasis(right, up, f);
    const quat = new Quaternion().setFromRotationMatrix(m);
    if (crooked > 0) {
      const twist = (0.55 * Math.sin(i * 0.62 + 0.8) + 0.25 * (hash(i) - 0.5)) * crooked;
      const lean = (0.2 * Math.sin(i * 0.5 + 2.1) + 0.12 * (hash(i + 40) - 0.5)) * crooked;
      const nod = (0.14 * (hash(i + 90) - 0.5)) * crooked;
      quat.multiply(new Quaternion().setFromEuler(new Euler(nod, twist, lean, 'YXZ')));
      pos.x += (hash(i + 7) - 0.5) * 0.28 * crooked;
      pos.z += (hash(i + 17) - 0.5) * 0.2 * crooked;
    }
    p.push(pos);
    q.push(quat);
  });
  return { p, q };
}

export type SpineLayout = {
  /** Where the middle of the spine sits on screen, in CSS pixels from the canvas's top left. */
  cx: number;
  cy: number;
  /** The height, in CSS pixels, the whole spine would span. */
  height: number;
  /** Radians. */
  tilt: number;
  yaw: number;
  pitch: number;
};

export type Spine = {
  stage: Stage;
  layout: SpineLayout;
  /** 0 is crooked and 1 is aligned. Each vertebra follows with its own spring. */
  align: number;
  region: Region | null;
  hover: Region | null;
  /** 0 to 1: how far the camera has eased in on the chosen region. */
  focusAmount: number;
  /** Slides the camera along the spine to a bone (fractional index), easing in by `amount`. */
  look: { index: number; amount: number; zoom: number };
  /** Scales how far the region zoom goes; smaller on phones. */
  zoomMul: number;
  /** Extra tint, 0 to 1 per bone, for effects that are not a region. */
  glow: number[];
  intro: number[];
  alignment: number[];
  pointer: { x: number; y: number };
  pick(clientX: number, clientY: number): Region | null;
  project(index: number): { x: number; y: number };
  onBeforeFrame?: (time: number, dt: number) => void;
};

const FOV = 28;
const DISTANCE = 40;
const SPINE_LENGTH = 16.4;

const spring = (cur: number, vel: number, target: number, k: number, c: number, dt: number): [number, number] => {
  const steps = Math.max(1, Math.ceil(dt / 0.008));
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    vel += (k * (target - cur) - c * vel) * h;
    cur += vel * h;
  }
  return [cur, vel];
};

export async function createSpine(canvas: HTMLCanvasElement): Promise<Spine | null> {
  const coarse = matchMedia('(pointer: coarse)').matches;
  let spine!: Spine;
  let ready = false;
  const stage = createStage(
    canvas,
    (time, dt) => frame(time, dt),
    { fov: FOV, maxDpr: coarse ? 1.5 : 2 },
  );
  if (!stage) return null;
  const { renderer, scene, camera } = stage;
  camera.position.set(0, 0, DISTANCE);
  camera.lookAt(0, 0, 0);
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
  scene.environmentIntensity = 0.62;
  pmrem.dispose();

  // anchor: moves and scales. rot: turns. spineGroup: re-centres on whatever we are looking at.
  const anchor = new Group();
  const rot = new Group();
  rot.rotation.order = 'ZXY';
  const spineGroup = new Group();
  scene.add(anchor);
  anchor.add(rot);
  rot.add(spineGroup);

  const key = new DirectionalLight('#fff3e4', 2.3);
  key.position.set(-6, 9, 16);
  key.castShadow = true;
  key.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  key.shadow.radius = 5;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.04;
  anchor.add(key);
  anchor.add(key.target);

  const wall = new Mesh(new PlaneGeometry(90, 90), new ShadowMaterial({ color: '#2a2740', opacity: 0.2 }));
  wall.position.z = -4.2;
  wall.receiveShadow = true;
  anchor.add(wall);

  // Build the bones, one kind per frame so the page never stalls.
  const kindsNeeded = [...new Set(kinds)];
  const geometries = new Map<BoneKind, BufferGeometry>();
  const cell = coarse ? 0.05 : 0.04;
  for (const kind of kindsNeeded) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const data = buildBone(kind, cell);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(data.positions, 3));
    geometry.setAttribute('normal', new BufferAttribute(data.normals, 3));
    geometry.setAttribute('color', new BufferAttribute(data.colors, 3));
    geometry.setIndex(new BufferAttribute(data.indices, 1));
    geometry.computeBoundingSphere();
    geometries.set(kind, geometry);
  }

  const boneMaterial = () =>
    new MeshPhysicalMaterial({
      color: PORCELAIN,
      roughness: 0.3,
      metalness: 0,
      clearcoat: 0.7,
      clearcoatRoughness: 0.14,
      sheen: 0.4,
      sheenRoughness: 0.5,
      sheenColor: new Color('#fff1e0'),
      vertexColors: true,
    });
  const discMaterial = () =>
    new MeshPhysicalMaterial({
      color: CORAL,
      roughness: 0.38,
      metalness: 0,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
      sheen: 0.8,
      sheenRoughness: 0.4,
      sheenColor: new Color('#ffc2b3'),
    });

  // Discs: a rounded, squat cylinder that scales to fit between two bodies.
  const profile: Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI;
    const bulge = 0.5 + 0.5 * Math.sin(a);
    profile.push(new Vector2(0.02 + 0.98 * Math.pow(Math.sin(a), 0.38) * (0.94 + 0.06 * bulge), -Math.cos(a) * 0.5));
  }
  const discGeometry = new LatheGeometry(profile, 56);

  const proxyGeometry = new SphereGeometry(1, 8, 6);
  const proxyMaterial = new MeshBasicMaterial({ visible: false });

  const meshes: Mesh<BufferGeometry, MeshPhysicalMaterial>[] = [];
  const discs: Mesh<BufferGeometry, MeshPhysicalMaterial>[] = [];
  for (let i = 0; i < BONES; i++) {
    const mesh = new Mesh(geometries.get(kinds[i])!, boneMaterial());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.index = i;
    const proxy = new Mesh(proxyGeometry, proxyMaterial);
    proxy.scale.set(bones[kinds[i]].ax * 1.9, bones[kinds[i]].h * 3.2, 0.9);
    proxy.position.z = -0.35;
    proxy.userData.index = i;
    mesh.add(proxy);
    spineGroup.add(mesh);
    meshes.push(mesh);
    if (i < BONES - 1) {
      const disc = new Mesh(discGeometry, discMaterial());
      disc.castShadow = true;
      disc.receiveShadow = true;
      spineGroup.add(disc);
      discs.push(disc);
    }
  }

  // Poses.
  const half = kinds.map((kind, i) => bones[kind].h * scales[i]);
  const gapBase = scales.map((s) => 0.27 * s);
  const pitch: number[] = [];
  let total = 0;
  for (let i = 0; i < BONES; i++) {
    pitch.push(total + half[i]);
    total += half[i] * 2 + (i < BONES - 1 ? (gapBase[i] + gapBase[i + 1]) / 2 : 0);
  }
  // The sacrum's body is only its top; give the tail room.
  const t = pitch.map((p) => Math.min(0.995, p / (total + 1.4)));
  const target = SPINE_LENGTH;
  const poseA = buildPose(ALIGNED, target, t, 0);
  const poseC = buildPose(CROOKED, target, t, 1);
  const centre = new Vector3();
  poseA.p.forEach((p) => centre.add(p));
  centre.divideScalar(BONES);

  const state = {
    s: new Array(BONES).fill(0),
    sv: new Array(BONES).fill(0),
    flush: new Array(BONES).fill(0),
    flushV: new Array(BONES).fill(0),
    gap: new Array(BONES).fill(0),
    gapV: new Array(BONES).fill(0),
    follow: new Array(BONES).fill(0),
    focus: new Vector3(),
    zoom: 1,
    zoomV: 0,
  };

  spine = {
    stage,
    layout: { cx: canvas.clientWidth * 0.7, cy: canvas.clientHeight * 0.5, height: canvas.clientHeight * 1.7, tilt: -0.4, yaw: -1, pitch: 0 },
    align: 0,
    region: null,
    hover: null,
    focusAmount: 0,
    look: { index: 0, amount: 0, zoom: 2.2 },
    zoomMul: 1,
    glow: new Array(BONES).fill(0),
    intro: new Array(BONES).fill(0),
    alignment: new Array(BONES).fill(0),
    pointer: { x: 0, y: 0 },
    pick() {
      return null;
    },
    project(index) {
      const v = meshes[index].getWorldPosition(new Vector3()).project(camera);
      return { x: ((v.x + 1) / 2) * canvas.clientWidth, y: ((1 - v.y) / 2) * canvas.clientHeight };
    },
  };

  const raycaster = new Raycaster();
  const ndc = new Vector2();
  spine.pick = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(meshes.map((m) => m.children[0]), false);
    return hits.length ? regionOf(hits[0].object.userData.index) : null;
  };

  const tmpP = new Vector3();
  const tmpUp = new Vector3();
  const tmpQ = new Quaternion();
  const yAxis = new Vector3(0, 1, 0);
  const offsets = new Array(BONES).fill(0);
  const positions: Vector3[] = Array.from({ length: BONES }, () => new Vector3());
  const ups: Vector3[] = Array.from({ length: BONES }, () => new Vector3());
  const quats: Quaternion[] = Array.from({ length: BONES }, () => new Quaternion());
  const mix = new Color();
  const lastFocus = new Vector3();
  let lastKnownRegion: Region = 'lower';
  const zoomFor: Record<Region, number> = { neck: 3.1, upper: 1.5, lower: 2.4, pelvis: 2.7 };

  function frame(time: number, dt: number) {
    if (!ready) return;
    spine.onBeforeFrame?.(time, dt);
    dt = Math.max(dt, 0.001);
    const layout = spine.layout;
    const vh = canvas.clientHeight || 1;
    const vw = canvas.clientWidth || 1;
    const worldPerPx = (2 * DISTANCE * Math.tan((FOV * Math.PI) / 360)) / vh;

    // Springs: align per vertebra, with a wave that runs from the tailbone up.
    for (let i = 0; i < BONES; i++) {
      const wave = (BONES - 1 - i) / BONES;
      const a = Math.min(1, Math.max(0, (spine.align - wave * 0.55) / 0.45));
      const eased = a * a * (3 - 2 * a);
      [state.s[i], state.sv[i]] = spring(state.s[i], state.sv[i], eased, 85, 7.5, dt);
      spine.alignment[i] = state.s[i];
      const inRegion = spine.region && regionOf(i) === spine.region ? 1 : 0;
      const hovered = spine.hover && regionOf(i) === spine.hover ? 0.38 : 0;
      const goal = Math.max(inRegion, hovered, spine.glow[i]);
      [state.flush[i], state.flushV[i]] = spring(state.flush[i], state.flushV[i], goal, 90, 13, dt);
    }
    // Gaps between bones open when both neighbours are in the chosen region.
    for (let k = 0; k < BONES - 1; k++) {
      const a = spine.region && regionOf(k) === spine.region ? 1 : 0;
      const b = spine.region && regionOf(k + 1) === spine.region ? 1 : 0;
      const goal = (a + b) / 2;
      [state.gap[k], state.gapV[k]] = spring(state.gap[k], state.gapV[k], goal, 60, 9, dt);
    }
    // Lift offsets accumulate along the spine, anchored on the middle of the chosen region.
    let cum = 0;
    const cumulative: number[] = [];
    for (let i = 0; i < BONES; i++) {
      cumulative.push(cum);
      if (i < BONES - 1) cum += state.gap[i] * 0.55 * scales[i];
    }
    let anchorOffset = 0;
    if (spine.region || state.zoom > 1.01) {
      const [lo, hi] = regionRange[spine.region ?? lastKnownRegion];
      anchorOffset = (cumulative[lo] + cumulative[hi]) / 2;
    }
    for (let i = 0; i < BONES; i++) offsets[i] = cumulative[i] - anchorOffset;

    // Pose every bone.
    const focusTarget = new Vector3();
    let focusCount = 0;
    const breath = Math.sin(time * 0.7);
    const pointerYaw = spine.pointer.x;
    for (let i = 0; i < BONES; i++) {
      const s = state.s[i];
      const pos = positions[i].copy(poseC.p[i]).lerp(poseA.p[i], s);
      quats[i].copy(poseC.q[i]).slerp(poseA.q[i], s);
      pos.z += Math.sin(time * 0.6 - i * 0.22) * 0.07 * (1 - s * 0.5);
      pos.x += Math.sin(time * 0.45 + i * 0.3) * 0.05 * (1 - s * 0.5);
      const rate = 7 - i * 0.18;
      state.follow[i] += (pointerYaw * 0.34 - state.follow[i]) * (1 - Math.exp(-dt * rate));
      tmpQ.setFromAxisAngle(yAxis, state.follow[i]);
      quats[i].multiply(tmpQ);
      ups[i].set(0, 1, 0).applyQuaternion(quats[i]);
      pos.addScaledVector(ups[i], offsets[i]);
      const e = spine.intro[i];
      const mesh = meshes[i];
      const sc = scales[i] * (1 + breath * 0.004) * Math.max(0.0001, e);
      pos.y += (1 - e) * 3.2;
      mesh.position.copy(pos);
      mesh.quaternion.copy(quats[i]);
      mesh.scale.setScalar(sc);
      mesh.rotateZ((1 - e) * 0.6);

      mix.copy(PORCELAIN).lerp(COBALT, Math.min(1, Math.max(0, state.flush[i])));
      mesh.material.color.copy(mix);
      mesh.material.roughness = 0.3 - state.flush[i] * 0.1;

      if (spine.region && regionOf(i) === spine.region) {
        focusTarget.add(pos);
        focusCount++;
      }
    }
    for (let i = 0; i < BONES - 1; i++) {
      const a = positions[i];
      const b = positions[i + 1];
      const disc = discs[i];
      disc.position.copy(a).add(b).multiplyScalar(0.5);
      disc.quaternion.copy(quats[i]).slerp(quats[i + 1], 0.5);
      tmpUp.set(0, 1, 0).applyQuaternion(disc.quaternion);
      const along = tmpP.copy(b).sub(a).dot(tmpUp);
      const thickness = Math.abs(along) - half[i] - half[i + 1];
      const ei = Math.min(spine.intro[i], spine.intro[i + 1]);
      const bi = bones[kinds[i]];
      const bj = bones[kinds[i + 1]];
      const wx = ((bi.ax * scales[i] + bj.ax * scales[i + 1]) / 2) * 0.96;
      const wz = ((bi.az * scales[i] + bj.az * scales[i + 1]) / 2) * 0.96;
      const flush = (state.flush[i] + state.flush[i + 1]) / 2;
      const th = Math.max(0.06, thickness) * (1 + flush * 0.0);
      disc.scale.set(wx * Math.max(0.0001, ei), th * Math.max(0.0001, ei), wz * Math.max(0.0001, ei));
      // The disc sits in the gap, which is already centred between the two bodies.
      disc.material.color.copy(CORAL).lerp(CORAL_HOT, Math.min(1, flush));
    }

    // Camera: easing in on the chosen region.
    if (spine.region) {
      focusTarget.divideScalar(Math.max(1, focusCount));
      lastFocus.copy(focusTarget);
      lastKnownRegion = spine.region;
    }
    const zoomGoal = spine.region ? 1 + (zoomFor[spine.region] - 1) * spine.zoomMul : 1;
    [state.zoom, state.zoomV] = spring(state.zoom, state.zoomV, zoomGoal, 40, 11, dt);
    const fa = Math.min(1, Math.max(0, (state.zoom - 1) / Math.max(0.001, (zoomFor[lastKnownRegion] - 1) * spine.zoomMul)));
    spine.focusAmount = fa;
    state.focus.copy(centre).lerp(lastFocus, fa);
    const look = spine.look;
    if (look.amount > 0.001) {
      const f = Math.min(BONES - 1, Math.max(0, look.index));
      const i0 = Math.floor(f);
      const i1 = Math.min(BONES - 1, i0 + 1);
      tmpP.copy(positions[i0]).lerp(positions[i1], f - i0);
      state.focus.lerp(tmpP, look.amount);
    }

    // Layout from the page.
    const scale = ((layout.height * worldPerPx) / SPINE_LENGTH) * state.zoom * (1 + (spine.look.zoom - 1) * spine.look.amount);
    anchor.position.set((layout.cx - vw / 2) * worldPerPx, -(layout.cy - vh / 2) * worldPerPx, 0);
    anchor.scale.setScalar(scale);
    rot.rotation.set(layout.pitch + spine.pointer.y * 0.1, layout.yaw + spine.pointer.x * 0.28, layout.tilt);
    spineGroup.position.copy(state.focus).negate();

    const R = 34 * scale;
    key.shadow.camera.left = -R;
    key.shadow.camera.right = R;
    key.shadow.camera.top = R;
    key.shadow.camera.bottom = -R;
    key.shadow.camera.near = 0.5 * scale;
    key.shadow.camera.far = 70 * scale;
    key.shadow.camera.updateProjectionMatrix();
    key.position.set(-6, 9, 16);
  }
  ready = true;
  return spine;
}
