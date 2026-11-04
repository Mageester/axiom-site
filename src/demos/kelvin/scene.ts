/**
 * The thermal-camera scene: one house, one shader, one palette. Everything the page does to it
 * goes through `state`, and the frame loop reads that state every frame.
 */
import {
  AdditiveBlending,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  LineSegments,
  Mesh,
  PlaneGeometry,
  Points,
  Raycaster,
  ShaderMaterial,
  Vector2,
  Vector3,
} from 'three';
import { createStage } from '../_kit/stage3d';
import { buildHouse, houseGeometry, lineGeometry, type HouseData } from './house';
import { airTemp, ductTemp, FRONT_MAX, KIND, KIND_NAMES, surfaceTemp, thermalGLSL } from './thermal';

export type Cam = { az: number; el: number; dist: number; tx: number; ty: number; tz: number; ox: number; oy: number };

export type SceneState = {
  /** Metres of warm (or cool) air travelled along the ducts. */
  front: number;
  /** 0 for January, 1 for July. */
  season: number;
  /** The boot-up scan, 0 to 1. */
  build: number;
  cam: Cam;
  /** Pointer position from -1 to 1, used for a gentle parallax. */
  px: number;
  py: number;
};

export type Probe = { temp: number; kind: string };

const rad = Math.PI / 180;

const MESH_VERT = /* glsl */ `
attribute float aKind;
attribute float aPath;
varying vec3 vP;
varying vec3 vN;
varying float vKind;
varying float vPath;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vP = w.xyz;
  #ifdef LINE
  vN = vec3(0.0, 1.0, 0.0);
  #else
  vN = normalize(mat3(modelMatrix) * normal);
  #endif
  vKind = aKind;
  vPath = aPath;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export function createThermalScene(canvas: HTMLCanvasElement, options: { low: boolean; still: boolean }) {
  const { low } = options;
  const state: SceneState = {
    front: 0,
    season: 0,
    build: 0,
    cam: { az: -32, el: 15, dist: 31, tx: 0.5, ty: 1.2, tz: 0, ox: 0.17, oy: 0 },
    px: 0,
    py: 0,
  };

  const uniforms = {
    uTime: { value: 0 },
    uFront: { value: 0 },
    uSeason: { value: 0 },
    uBuild: { value: 0 },
  };
  const glsl = thermalGLSL(low);

  const data: HouseData = buildHouse();
  const geo = houseGeometry(data);
  const lines = lineGeometry(data);

  const meshMat = new ShaderMaterial({
    uniforms,
    vertexShader: MESH_VERT,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    fragmentShader: /* glsl */ `
${glsl}
uniform float uBuild;
varying vec3 vP;
varying vec3 vN;
varying float vKind;
varying float vPath;
void main() {
  float by = -3.95 + uBuild * 14.5;
  if (vP.y > by) discard;
  vec3 n = normalize(vN);
  float T = surfaceT(vP, n, vKind, vPath);
  T += 18.0 * exp(-pow((vP.y - by) / 0.2, 2.0)) * step(uBuild, 0.995);
  vec3 col = ironbow(T);
  float g = hash13(vec3(gl_FragCoord.xy, floor(uTime * 24.0)));
  col *= 0.935 + 0.13 * g;
  gl_FragColor = vec4(col, 1.0);
}`,
  });

  const lineMat = new ShaderMaterial({
    uniforms,
    defines: { LINE: '' },
    vertexShader: MESH_VERT,
    transparent: true,
    depthWrite: false,
    fragmentShader: /* glsl */ `
${glsl}
uniform float uBuild;
varying vec3 vP;
varying vec3 vN;
varying float vKind;
varying float vPath;
void main() {
  float by = -3.95 + uBuild * 14.5;
  if (vP.y > by) discard;
  if (vKind > 13.5) {
    gl_FragColor = vec4(0.42, 0.34, 0.95, 0.34);
    return;
  }
  float T = surfaceT(vP, vec3(0.0, 1.0, 0.0), vKind, vPath) + 3.6;
  vec3 col = ironbow(T);
  gl_FragColor = vec4(col, 0.5);
}`,
  });

  const house = new Mesh(geo, meshMat);
  const outline = new LineSegments(lines, lineMat);
  house.frustumCulled = false;
  outline.frustumCulled = false;
  outline.renderOrder = 2;

  // Plumes: heat escaping through the roof and the chimney, and shimmer off the condenser.
  const plumeMat = (hot: number, amb: number, wide: number, seed: number) =>
    new ShaderMaterial({
      uniforms: { ...uniforms, uStrength: { value: 0 }, uHot: { value: hot }, uAmb: { value: amb }, uWide: { value: wide }, uSeed: { value: seed } },
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
${glsl}
uniform float uStrength, uHot, uAmb, uWide, uSeed;
varying vec2 vUv;
void main() {
  float y = vUv.y;
  float x = (vUv.x - 0.5) * 2.0;
  float w = mix(0.22, 1.0, y * y) * uWide;
  float n = vnoise(vec3(x * 2.2 + uSeed, y * 3.0 - uTime * 0.7, uTime * 0.15));
  float n2 = vnoise(vec3(x * 5.0 + uSeed, y * 6.0 - uTime * 1.3, 3.0));
  float shape = exp(-pow(x / w + (n - 0.5) * 1.1, 2.0));
  float a = uStrength * shape * smoothstep(0.0, 0.14, y) * pow(1.0 - y, 1.5) * (0.5 + 0.9 * n2);
  float T = mix(uHot, uAmb, pow(y, 0.65));
  gl_FragColor = vec4(ironbow(T), clamp(a, 0.0, 0.8));
}`,
    });

  const plumes: Array<{ mesh: Mesh; mat: ShaderMaterial; kind: 'roof' | 'flue' | 'ac' }> = [];
  const addPlume = (x: number, y: number, z: number, w: number, h: number, hot: number, amb: number, wide: number, kind: 'roof' | 'flue' | 'ac') => {
    const mat = plumeMat(hot, amb, wide, Math.random() * 40);
    const mesh = new Mesh(new PlaneGeometry(w, h), mat);
    mesh.position.set(x, y + h / 2, z);
    mesh.renderOrder = 3;
    mesh.frustumCulled = false;
    plumes.push({ mesh, mat, kind });
  };
  addPlume(-1.4, 7.9, -0.9, 6.2, 4.4, 26, -14, 1, 'roof');
  addPlume(2.8, 7.9, -0.9, 4.4, 3.4, 22, -14, 1, 'roof');
  addPlume(3.9, 9.3, -2.5, 1.7, 4.8, 42, -12, 0.8, 'flue');
  addPlume(-7.4, 1.1, -1.0, 2.4, 3.4, 52, 20, 0.9, 'ac');

  // Snow in winter, rising heat motes in summer.
  const count = low ? 520 : 1500;
  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  const snowGeo = new BufferGeometry();
  snowGeo.setAttribute('position', new Float32BufferAttribute(new Float32Array(count * 3), 3));
  snowGeo.setAttribute('aSeed', new Float32BufferAttribute(seeds, 4));
  const snowUniforms = { ...uniforms, uScale: { value: 2000 } };
  const snowMat = new ShaderMaterial({
    uniforms: snowUniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
attribute vec4 aSeed;
uniform float uTime, uFront, uSeason, uScale;
varying float vA;
varying float vTone;
varying float vMote;
void main() {
  float H = 15.0;
  float winter = 1.0 - uSeason;
  float speed = mix(0.8 + aSeed.w * 0.9, 0.5, uSeason);
  float dir = mix(-1.0, 1.0, uSeason);
  float y = mod(aSeed.y * H + dir * uTime * speed, H);
  vec3 p;
  p.x = mix(-15.0, 15.0, aSeed.x) + sin(uTime * 0.5 + aSeed.z * 6.283) * 0.5;
  p.z = mix(-9.0, 8.0, aSeed.z) + cos(uTime * 0.4 + aSeed.x * 6.283) * 0.4;
  p.y = y - 0.3;
  bool inFoot = abs(p.x) < 5.4 && p.z > -3.5 && p.z < 3.5;
  float alive = 1.0;
  if (inFoot) alive *= smoothstep(8.9, 7.7, p.y);
  alive *= smoothstep(0.0, 0.9, y);
  float dist = length(p.xz - vec2(0.0, -1.0));
  float melt = (uFront / ${FRONT_MAX.toFixed(1)}) * 36.0;
  float snowAlive = alive * smoothstep(melt, melt + 6.0, dist);
  float mote = step(aSeed.w, 0.3);
  float moteAlive = alive * mote * smoothstep(0.0, 1.5, y) * smoothstep(13.0, 7.0, y);
  vA = mix(snowAlive, moteAlive, uSeason);
  vTone = aSeed.w;
  vMote = uSeason;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float world = mix(0.05 + aSeed.w * 0.07, 0.05, uSeason);
  gl_PointSize = max(vA > 0.01 ? world * uScale / -mv.z : 0.0, 0.0);
  gl_Position = projectionMatrix * mv;
}`,
    fragmentShader: /* glsl */ `
${glsl}
varying float vA;
varying float vTone;
varying float vMote;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float soft = smoothstep(0.5, 0.1, d);
  vec3 snow = mix(vec3(0.33, 0.27, 0.78), vec3(0.72, 0.68, 1.0), vTone);
  vec3 mote = ironbow(27.0);
  vec3 col = mix(snow, mote, vMote);
  gl_FragColor = vec4(col, soft * vA * mix(0.78, 0.5, vMote));
}`,
  });
  const snow = new Points(snowGeo, snowMat);
  snow.frustumCulled = false;
  snow.renderOrder = 4;

  // Raycasting for the reticle.
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const kinds = data.kind;
  const paths = data.path;

  const camPos = new Vector3();
  const target = new Vector3();
  const probeVec = new Vector3();
  let aspect = 1.6;
  const tick = { current: (_time: number, _dt: number) => {} };

  const stage = createStage(
    canvas,
    (time, dt, parts) => {
      const { camera, renderer } = parts;
      const c = state.cam;
      const fit = Math.max(1, 0.78 / aspect);
      const az = (c.az + state.px * 3.2) * rad;
      const el = (c.el - state.py * 2) * rad;
      const dist = c.dist * fit;
      target.set(c.tx, c.ty, c.tz);
      camPos.set(c.tx + dist * Math.cos(el) * Math.sin(az), c.ty + dist * Math.sin(el), c.tz + dist * Math.cos(el) * Math.cos(az));
      camera.position.copy(camPos);
      camera.lookAt(target);
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      camera.setViewOffset(w, h, -c.ox * w, c.oy * h, w, h);
      camera.updateMatrixWorld();

      uniforms.uTime.value = time;
      uniforms.uFront.value = state.front;
      uniforms.uSeason.value = state.season;
      uniforms.uBuild.value = state.build;
      snowUniforms.uScale.value = (h * renderer.getPixelRatio()) / (2 * Math.tan((camera.fov * rad) / 2));

      // Plume strengths follow the heat.
      const act0 = Math.min(Math.max(state.front / 2.4, 0), 1);
      const warm = Math.min(Math.max((state.front - 2) / 9, 0), 1) * (1 - state.season);
      const hot = state.season;
      plumes.forEach((p) => {
        p.mesh.quaternion.copy(camera.quaternion);
        const s =
          p.kind === 'roof' ? warm * 0.55 : p.kind === 'flue' ? act0 * (1 - state.season) * 0.8 : act0 * hot * 0.7;
        p.mat.uniforms.uStrength.value = s * Math.min(state.build * 1.4, 1);
        p.mesh.visible = s > 0.01;
      });
      tick.current(time, dt);
    },
    { fov: 26, maxDpr: low ? 1.5 : 1.75, onResize: (a) => (aspect = a) },
  );

  if (!stage) return null;
  stage.renderer.setClearColor(0x07060c, 1);
  stage.scene.add(house, outline, snow);
  plumes.forEach((p) => stage.scene.add(p.mesh));
  void AdditiveBlending;

  const heat = () => ({ front: state.front, season: state.season });

  /** What a thermal camera would read at this point on the screen. */
  function probe(clientX: number, clientY: number): Probe {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, stage!.camera);
    const hit = raycaster.intersectObject(house, false)[0];
    if (!hit || hit.faceIndex == null) return { temp: -24 + Math.sin(performance.now() / 900) * 0.3, kind: 'AIR' };
    const k = kinds[hit.faceIndex * 3];
    const pth = paths[hit.faceIndex * 3];
    const p = hit.point;
    const s = heat();
    const t = k === KIND.DUCT || k === KIND.BOOT ? ductTemp(p.x, p.y, p.z, pth, s) : surfaceTemp(p.x, p.y, p.z, k, s);
    return { temp: t + Math.sin(performance.now() / 700 + p.x) * 0.18, kind: KIND_NAMES[k] ?? 'SURFACE' };
  }

  /** Average temperature of the living spaces, for the big readout. */
  function insideTemp() {
    const s = heat();
    const pts: Array<[number, number, number]> = [
      [-2.2, 1.2, -1],
      [2.5, 1.2, -1],
      [-3, 4, -1],
      [3, 4, -1],
    ];
    return pts.reduce((sum, p) => sum + airTemp(p[0], p[1], p[2], s).ta, 0) / pts.length;
  }

  function project(x: number, y: number, z: number) {
    probeVec.set(x, y, z).project(stage!.camera);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    return { x: (probeVec.x * 0.5 + 0.5) * w, y: (-probeVec.y * 0.5 + 0.5) * h, behind: probeVec.z > 1 };
  }

  return { stage, state, probe, insideTemp, project, onTick: tick, canvas };
}

export type ThermalScene = NonNullable<ReturnType<typeof createThermalScene>>;
