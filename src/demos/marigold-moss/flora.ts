/**
 * Procedural flowers. Every petal is a small grid whose shape is worked out on the GPU from a
 * handful of numbers: where it sits on the flower, how long and wide it is, how far it has
 * opened. So a bloom can open petal by petal for the price of one uniform.
 */
import {
  BufferGeometry,
  CatmullRomCurve3,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  Mesh,
  Quaternion,
  ShaderMaterial,
  Sphere,
  TubeGeometry,
  Vector2,
  Vector3,
  Vector4,
} from 'three';

/* ---------------------------------------------------------------------------------------------
 * Light, shared by every material. Values are linear; colours are written as sRGB hex.
 * ------------------------------------------------------------------------------------------- */

export const TIME = { value: 0 };

export const LIGHT = {
  uKeyDir: { value: new Vector3(-0.58, 0.72, -0.22).normalize() },
  uKeyCol: { value: new Vector3(1.55, 1.3, 0.98) },
  uFillDir: { value: new Vector3(0.6, 0.15, 0.8).normalize() },
  uFillCol: { value: new Vector3(0.17, 0.17, 0.16) },
  uAmbTop: { value: new Vector3(0.12, 0.13, 0.1) },
  uAmbBot: { value: new Vector3(0.025, 0.03, 0.02) },
  uFogCol: { value: new Vector3(0.09, 0.11, 0.075) },
};

const LIGHT_GLSL = /* glsl */ `
uniform vec3 uKeyDir;
uniform vec3 uKeyCol;
uniform vec3 uFillDir;
uniform vec3 uFillCol;
uniform vec3 uAmbTop;
uniform vec3 uAmbBot;
uniform vec3 uFogCol;
uniform float uFog;

vec3 toLin(vec3 c) { return pow(c, vec3(2.2)); }
vec3 toOut(vec3 c) {
  c = c / (1.0 + 0.16 * c);
  return pow(max(c, 0.0), vec3(1.0 / 2.2));
}

// Soft wrap lighting, light through thin tissue, and a little sheen at grazing angles.
vec3 shade(vec3 albedo, vec3 N, vec3 V, float thin, float ao, float sheen) {
  vec3 a = toLin(albedo);
  float ndl = dot(N, uKeyDir);
  float wrap = clamp((ndl + 0.35) / 1.35, 0.0, 1.0);
  float lit = wrap * wrap * mix(0.25, 1.0, ao);
  vec3 c = a * mix(uAmbBot, uAmbTop, N.y * 0.5 + 0.5) * (0.3 + 0.7 * ao);
  c += a * uKeyCol * lit;
  // light coming through the tissue: deeper, more saturated colour
  float through = max(-ndl, 0.0);
  float glow = pow(max(dot(-V, uKeyDir), 0.0), 2.0);
  c += a * sqrt(a) * uKeyCol * thin * (through * 1.4 + glow * 0.7) * mix(0.25, 1.0, ao);
  c += a * uFillCol * max(dot(N, uFillDir) * 0.75 + 0.25, 0.0) * mix(0.4, 1.0, ao);
  float fres = pow(1.0 - abs(dot(N, V)), 3.0);
  c += uKeyCol * a * fres * sheen * ao * (0.4 + 0.6 * wrap);
  // a painter's shadows: cooler and greener away from the light, warmer in it
  c *= mix(vec3(0.82, 0.9, 0.86), vec3(1.04, 1.0, 0.94), smoothstep(0.0, 0.7, lit));
  return c;
}

float hash11(float n) { return fract(sin(n * 91.3458) * 47453.5453); }
`;

/* ---------------------------------------------------------------------------------------------
 * Petals
 * ------------------------------------------------------------------------------------------- */

const PETAL_VERT = /* glsl */ `
#define PI 3.14159265
attribute vec4 aPetal;   // azimuth, ring (1 outer, 0 inner), length, seed
attribute vec4 aPetal2;  // base radius, base height, opening order, lean
uniform float uOpen;
uniform float uTime;
uniform vec4 uA; // closed angle, open angle inner, open angle outer, stagger
uniform vec4 uB; // curl closed, curl open inner, curl open outer, cup
uniform vec4 uC; // edge roll, ruffle, ruffle frequency, width
uniform vec4 uD; // where the petal reaches full width, where the tip starts, notch, droop
uniform vec4 uE; // inner width boost, tip roundness, how much petals hug the axis, shadow lift
varying vec3 vWorld;
varying vec3 vN;
varying vec4 vInfo;
varying float vOpen;

// Narrow at the claw, full through the middle, then a rounded (or pointed) tip.
float profile(float v) {
  float b = pow(sin(1.5707963 * clamp(v / uD.x, 0.0, 1.0)), 0.7);
  float t = clamp((v - uD.y) / (1.0 - uD.y), 0.0, 1.0);
  float q = uE.y;
  return b * pow(max(1.0 - pow(t, q), 0.0), 1.0 / q);
}

vec3 petalPoint(vec2 uv, float o) {
  float u = uv.x;
  float v = uv.y;
  float phi = aPetal.x;
  float rp = pow(aPetal.y, 1.35);
  float L = aPetal.z;
  float tooth = uD.z * (0.5 - 0.5 * cos(u * 3.0 * PI)) * smoothstep(0.72, 1.0, v);
  float s = v * L * (1.0 - tooth);
  float a0 = mix(uA.x, mix(uA.y, uA.z, rp), o) + aPetal2.w;
  float curl = mix(uB.x, mix(uB.y, uB.z, rp), o) + uD.w * o * rp;
  float k = curl / L;
  float a = a0 + k * s;
  vec2 sp = abs(k) < 0.001 ? s * vec2(sin(a0), cos(a0)) : vec2(cos(a0) - cos(a), sin(a) - sin(a0)) / k;
  vec2 n2 = vec2(cos(a), -sin(a));
  float w = uC.w * L * profile(v) * mix(uE.x, 1.0, rp);
  float cup = uB.w * (1.0 - 0.5 * o * rp);
  float off = -cup * u * u * w;
  off += uC.x * o * rp * pow(max(abs(u) - 0.42, 0.0) / 0.58, 2.0) * w * smoothstep(0.25, 1.0, v);
  off += uC.y * w * sin(u * uC.z + v * uC.z * 0.6 + aPetal.w * 6.2831) * smoothstep(0.35, 1.0, v) * (0.35 + 0.65 * abs(u));
  // Wrap the petal around the flower's axis, so neighbouring petals nest like shells
  // instead of cutting through each other.
  float rho = aPetal2.x + sp.x;
  float x = u * w;
  float theta = phi + uE.z * x / max(rho, 0.55 * w + 0.03);
  vec3 R = vec3(cos(theta), 0.0, sin(theta));
  vec3 T = vec3(-sin(theta), 0.0, cos(theta));
  vec3 N = R * n2.x + vec3(0.0, n2.y, 0.0);
  return R * rho + vec3(0.0, aPetal2.y + sp.y, 0.0) + T * (x * (1.0 - uE.z)) + N * off;
}

void main() {
  float start = aPetal2.z * uA.w;
  float o = smoothstep(start, start + 1.0 - uA.w, uOpen);
  o *= 1.0 + sin(uTime * 0.8 + aPetal.w * 37.0) * 0.012;
  vec2 uv = position.xy;
  vec3 p = petalPoint(uv, o);
  vec2 q = vec2(uv.x, clamp(uv.y, 0.1, 0.9));
  vec3 pq = petalPoint(q, o);
  float du = q.x > 0.0 ? -0.08 : 0.08;
  vec3 pu = (petalPoint(q + vec2(du, 0.0), o) - pq) * sign(du);
  vec3 pv = petalPoint(q + vec2(0.0, 0.06), o) - pq;
  vec3 n = cross(pu, pv);
  n = n / max(length(n), 1e-6);
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vN = normalize(mat3(modelMatrix) * n);
  vInfo = vec4(uv, aPetal.y, aPetal.w);
  vOpen = o;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const PETAL_FRAG = /* glsl */ `
${LIGHT_GLSL}
uniform vec3 uCol0;
uniform vec3 uCol1;
uniform vec3 uCol2;
uniform vec4 uEye;   // centre colour, how far out it reaches
uniform float uThin;
uniform float uVein;
uniform float uSheen;
uniform vec4 uE;
varying vec3 vWorld;
varying vec3 vN;
varying vec4 vInfo;
varying float vOpen;

void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vWorld);
  N = gl_FrontFacing ? N : -N;
  float u = vInfo.x;
  float v = vInfo.y;
  float ring = vInfo.z;
  float seed = vInfo.w;
  float edge = smoothstep(0.5, 1.0, abs(u));
  vec3 col = mix(uCol0, uCol1, smoothstep(0.0, 0.55, v));
  col = mix(col, uCol2, clamp(smoothstep(0.45, 1.0, v) * 0.75 + edge * v * 0.35, 0.0, 1.0));
  col = mix(uEye.rgb, col, smoothstep(uEye.a * 0.4, uEye.a, ring));
  col *= 0.9 + 0.16 * hash11(seed * 13.7);
  col = mix(col, col * col * 1.25, 0.25 * (1.0 - v) * (1.0 - ring));
  float vein = 0.5 + 0.5 * cos(u * 24.0 + sin(v * 4.0 + seed * 9.0) * 1.4);
  col *= 1.0 - uVein * vein * smoothstep(0.05, 0.7, v) * (1.0 - edge * 0.6);
  if (!gl_FrontFacing) col = mix(col, uCol2, 0.18);
  float depth = v * 0.55 + pow(ring, 0.8) * 0.55 + vOpen * 0.2;
  float ao = smoothstep(0.05, 1.0, depth);
  ao *= ao;
  ao = mix(ao, 1.0, uE.w);
  vec3 c = shade(col, N, V, uThin * (0.7 + 0.5 * edge + 0.3 * v), ao, uSheen);
  c = mix(c, toLin(uFogCol), uFog);
  gl_FragColor = vec4(toOut(c), 1.0);
}`;

/* ---------------------------------------------------------------------------------------------
 * Stems, leaves and flower centres share one simpler surface shader.
 * ------------------------------------------------------------------------------------------- */

const SURFACE_VERT = /* glsl */ `
attribute vec4 aAnchor; // where a leaf joins the stem, and when along the stem it grows
uniform float uGrow;
uniform float uTime;
varying vec3 vWorld;
varying vec3 vN;
varying vec2 vUv;
varying float vT;
void main() {
  vec3 p = position;
  #ifdef LEAF
  float g = smoothstep(aAnchor.w, aAnchor.w + 0.14, uGrow);
  p = aAnchor.xyz + (p - aAnchor.xyz) * g;
  vT = 0.0;
  #else
  vT = uv.x;
  #endif
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const SURFACE_FRAG = /* glsl */ `
${LIGHT_GLSL}
uniform vec3 uCol0;
uniform vec3 uCol1;
uniform float uThin;
uniform float uGrow;
uniform float uPattern; // 0 plain, 1 stem, 2 leaf, 3 cosmos disc, 4 anemone centre, 5 vase
varying vec3 vWorld;
varying vec3 vN;
varying vec2 vUv;
varying float vT;

void main() {
  #ifndef LEAF
  if (uPattern < 1.5 && uPattern > 0.5 && vT > uGrow * 1.02) discard;
  #endif
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vWorld);
  N = gl_FrontFacing ? N : -N;
  vec3 col = uCol0;
  float ao = 1.0;
  float sheen = 0.2;
  if (uPattern > 0.5 && uPattern < 1.5) {
    col = mix(uCol0, uCol1, smoothstep(0.0, 1.0, vT));
  } else if (uPattern > 1.5 && uPattern < 2.5) {
    float u = vUv.x;
    float v = vUv.y;
    float rib = smoothstep(0.08, 0.0, abs(u));
    float side = 0.5 + 0.5 * cos(abs(u) * 18.0 - v * 10.0);
    col = mix(uCol0, uCol1, smoothstep(0.0, 1.0, v) * 0.5 + rib * 0.45);
    col *= 1.0 - 0.06 * side * (1.0 - rib);
    ao = smoothstep(0.0, 0.25, v) * 0.5 + 0.5;
    sheen = 0.5;
  } else if (uPattern > 2.5 && uPattern < 3.5) {
    float r = length(vUv - 0.5) * 2.0;
    float a = atan(vUv.y - 0.5, vUv.x - 0.5);
    float dots = 0.5 + 0.5 * sin(r * 48.0) * sin(a * 28.0 + r * 30.0);
    col = mix(uCol0, uCol1, smoothstep(0.35, 0.95, dots) * smoothstep(0.1, 0.6, r));
    ao = 0.65 + 0.35 * smoothstep(0.0, 0.9, r);
  } else if (uPattern > 3.5 && uPattern < 4.5) {
    float r = length(vUv - 0.5) * 2.0;
    col = mix(uCol0, uCol1, smoothstep(0.2, 0.9, r));
    sheen = 0.9;
  } else if (uPattern > 5.5) {
    // stamens: fine filaments that thin out into a fringe, each with a dark anther
    float strand = 0.5 + 0.5 * cos(vUv.x * 6.2831 * 52.0 + sin(vUv.x * 40.0) * 0.6);
    if (vUv.y > 0.35 && strand < smoothstep(0.35, 0.95, vUv.y) * 0.82) discard;
    col = mix(uCol0, uCol1, smoothstep(0.7, 1.0, vUv.y));
    sheen = 0.8;
  } else if (uPattern > 4.5) {
    float speck = step(0.985, fract(sin(dot(floor(vWorld.xy * 140.0), vec2(12.9898, 78.233))) * 43758.5453));
    col = mix(uCol0, uCol1, smoothstep(-1.4, 0.4, vWorld.y));
    col *= 1.0 - speck * 0.35;
    sheen = 0.35;
  }
  vec3 c = shade(col, N, V, uThin, ao, sheen);
  c = mix(c, toLin(uFogCol), uFog);
  gl_FragColor = vec4(toOut(c), 1.0);
}`;

/* ---------------------------------------------------------------------------------------------
 * Species
 * ------------------------------------------------------------------------------------------- */

type V4 = [number, number, number, number];

type SpeciesDef = {
  count: number;
  even?: boolean;
  lenIn: number;
  lenOut: number;
  lenPow: number;
  r0In: number;
  r0Out: number;
  y0In: number;
  /** closed angle, open angle inner, open angle outer, stagger */
  A: V4;
  /** curl closed, curl open inner, curl open outer, extra cup */
  B: V4;
  /** edge roll, ruffle, ruffle frequency, width */
  C: V4;
  /** full width at, tip starts at, notch, droop */
  D: V4;
  /** inner width boost, tip roundness (1 pointed, 2 round, 3 square), wrap */
  E: [number, number, number];
  thin: number;
  vein: number;
  /** lifts the deep shadows between densely packed petals */
  lift?: number;
  sheen?: number;
  eye?: [string, number];
  centre?: 'cosmos' | 'anemone';
  nv?: number;
};

export type FlowerKind = 'rose' | 'ranunculus' | 'marigold' | 'cosmos' | 'anemone' | 'jasmine';

const SPECIES: Record<FlowerKind, SpeciesDef> = {
  rose: {
    count: 42,
    lenIn: 0.46,
    lenOut: 1.0,
    lenPow: 0.7,
    r0In: 0.03,
    r0Out: 0.15,
    y0In: 0.12,
    A: [0.3, 0.2, 1.36, 0.6],
    B: [-1.0, -1.3, 0.4, 0.22],
    C: [0.7, 0.03, 7, 0.8],
    D: [0.5, 0.55, 0, 0.35],
    E: [1.15, 2.3, 1],
    thin: 0.8,
    vein: 0.05,
  },
  ranunculus: {
    count: 92,
    lenIn: 0.2,
    lenOut: 0.6,
    lenPow: 0.65,
    r0In: 0.02,
    r0Out: 0.08,
    y0In: 0.1,
    A: [0.3, 0.55, 1.05, 0.55],
    B: [-1.1, -1.25, -1.35, 0.3],
    C: [0.0, 0.015, 6, 1.05],
    D: [0.4, 0.45, 0, 0.05],
    E: [1.1, 2.0, 1],
    thin: 0.9,
    vein: 0.06,
    eye: ['#3f5119', 0.26],
  },
  marigold: {
    count: 110,
    lenIn: 0.24,
    lenOut: 0.56,
    lenPow: 0.7,
    r0In: 0.02,
    r0Out: 0.18,
    y0In: 0.12,
    A: [0.35, 0.45, 1.4, 0.6],
    B: [-0.9, -0.7, 0.15, 0.15],
    C: [0.06, 0.036, 5, 1.0],
    D: [0.55, 0.72, 0.1, 0.2],
    E: [1.0, 2.6, 0.8],
    thin: 0.8,
    vein: 0.06,
    lift: 0.35,
    sheen: 0.0,
    eye: ['#8a4a0c', 0.08],
  },
  cosmos: {
    count: 8,
    even: true,
    lenIn: 1,
    lenOut: 1,
    lenPow: 1,
    r0In: 0.13,
    r0Out: 0.13,
    y0In: 0,
    A: [0.25, 1.48, 1.48, 0.28],
    B: [-1.2, 0.12, 0.12, 0.12],
    C: [0, 0.03, 9, 0.44],
    D: [0.32, 0.86, 0.12, 0.15],
    E: [1, 3.0, 0.35],
    thin: 1,
    vein: 0.1,
    centre: 'cosmos',
    nv: 15,
  },
  anemone: {
    count: 8,
    even: true,
    lenIn: 0.88,
    lenOut: 1,
    lenPow: 1,
    r0In: 0.13,
    r0Out: 0.14,
    y0In: 0.01,
    A: [0.25, 1.0, 1.2, 0.3],
    B: [-1.4, -0.5, -0.3, 0.25],
    C: [0, 0.03, 7, 0.88],
    D: [0.45, 0.55, 0, 0.05],
    E: [1, 2.2, 0.75],
    thin: 0.9,
    vein: 0.05,
    centre: 'anemone',
  },
  jasmine: {
    count: 5,
    even: true,
    lenIn: 1,
    lenOut: 1,
    lenPow: 1,
    r0In: 0.08,
    r0Out: 0.08,
    y0In: 0.0,
    A: [0.1, 1.5, 1.5, 0.2],
    B: [-0.6, 0.3, 0.3, 0.12],
    C: [0, 0.02, 6, 0.42],
    D: [0.28, 0.35, 0, 0.1],
    E: [1, 1.2, 0.25],
    thin: 1,
    vein: 0.04,
  },
};

export type Palette = [string, string, string];

export const PALETTES = {
  roseBlush: ['#b9605a', '#eaa69a', '#f9dccf'] as Palette,
  roseApricot: ['#b9502a', '#ee965c', '#fcd3a8'] as Palette,
  roseMauve: ['#7f4a5c', '#c08e9c', '#ead0d2'] as Palette,
  roseCream: ['#c9a57c', '#f0dfc6', '#fff8ec'] as Palette,
  ranCoral: ['#b83a28', '#ec7656', '#ffc2a6'] as Palette,
  ranButter: ['#c1902a', '#f0cd76', '#fff0c8'] as Palette,
  ranBlush: ['#bf6f69', '#f0b5aa', '#ffe9e1'] as Palette,
  ranTerracotta: ['#963a1f', '#d27146', '#f3b48a'] as Palette,
  marigold: ['#9a3208', '#e66a10', '#f99a2e'] as Palette,
  marigoldGold: ['#b45808', '#f08e18', '#fbb846'] as Palette,
  cosmosWhite: ['#dcc3cd', '#f5ede9', '#fffaf6'] as Palette,
  cosmosPink: ['#a92c5f', '#e2709d', '#f6bfd5'] as Palette,
  cosmosChoc: ['#2a080e', '#5c1620', '#842d37'] as Palette,
  anemoneWhite: ['#cfd2dd', '#f1efec', '#fffdfb'] as Palette,
  anemoneWine: ['#3d0812', '#7c1626', '#a83846'] as Palette,
  jasmine: ['#dc96ab', '#f8eee9', '#ffffff'] as Palette,
};

/* ---------------------------------------------------------------------------------------------
 * Geometry
 * ------------------------------------------------------------------------------------------- */

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function rng(seed: number) {
  let s = Math.floor(seed * 2147483647) || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const headCache = new Map<string, BufferGeometry>();

function headGeometry(kind: FlowerKind, low: boolean, variant: number, hi = false) {
  const key = `${kind}-${low ? 1 : 0}-${variant}-${hi ? 1 : 0}`;
  const cached = headCache.get(key);
  if (cached) return cached;
  const sp = SPECIES[kind];
  const fine = sp.count < 80;
  let nu = low ? (fine ? 8 : 6) : fine ? 12 : kind === 'marigold' ? 10 : 8;
  let nv = (sp.nv ?? (fine ? 16 : 12)) - (low ? 4 : 0);
  if (hi) {
    nu = low ? 13 : 22;
    nv = low ? 19 : 34;
  }
  const count = low && sp.count > 60 ? Math.round(sp.count * 0.75) : sp.count;
  const rand = rng(0.137 + variant * 0.31 + kind.length * 0.017);
  const verts = (nu + 1) * (nv + 1);
  const pos = new Float32Array(count * verts * 3);
  const p1 = new Float32Array(count * verts * 4);
  const p2 = new Float32Array(count * verts * 4);
  const index: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0;
    let ring = 1 - t;
    let phi = i * GOLDEN + (rand() - 0.5) * 0.25;
    if (sp.even) {
      phi = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.18;
      ring = kind === 'anemone' ? (i % 2 ? 0.72 : 1) : 1;
    }
    const len = (sp.lenIn + (sp.lenOut - sp.lenIn) * Math.pow(ring, sp.lenPow)) * (0.9 + rand() * 0.2);
    const r0 = sp.r0In + (sp.r0Out - sp.r0In) * Math.sqrt(ring);
    const y0 = sp.y0In * (1 - ring);
    const order = sp.even ? (kind === 'anemone' ? (i % 2 ? 0.5 : 0) + rand() * 0.3 : rand() * 0.6) : Math.pow(t, 0.85);
    const lean = (rand() - 0.5) * 0.14;
    const seed = rand();
    const base = i * verts;
    for (let j = 0; j <= nv; j++) {
      for (let k = 0; k <= nu; k++) {
        const n = base + j * (nu + 1) + k;
        pos[n * 3] = -1 + (2 * k) / nu;
        pos[n * 3 + 1] = j / nv;
        pos[n * 3 + 2] = i;
        p1.set([phi, ring, len, seed], n * 4);
        p2.set([r0, y0, order, lean], n * 4);
      }
    }
    for (let j = 0; j < nv; j++) {
      for (let k = 0; k < nu; k++) {
        const a = base + j * (nu + 1) + k;
        const b = a + 1;
        const c = a + nu + 1;
        const d = c + 1;
        index.push(a, b, c, b, d, c);
      }
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('aPetal', new Float32BufferAttribute(p1, 4));
  geo.setAttribute('aPetal2', new Float32BufferAttribute(p2, 4));
  geo.setIndex(index);
  geo.boundingSphere = new Sphere(new Vector3(0, 0.4, 0), 1.6);
  headCache.set(key, geo);
  return geo;
}

const centreCache = new Map<string, BufferGeometry>();

function centreGeometry(kind: 'cosmos' | 'anemone') {
  const cached = centreCache.get(kind);
  if (cached) return cached;
  const r = kind === 'cosmos' ? 0.19 : 0.17;
  const h = kind === 'cosmos' ? 0.08 : 0.12;
  const pts: Vector2[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    pts.push(new Vector2(Math.max(r * Math.sin((t * Math.PI) / 2), 0.0001), h * Math.cos((t * Math.PI) / 2) + 0.03));
  }
  const geo = new LatheGeometry(pts.reverse(), 22);
  // Planar UVs, so the shader can draw florets in rings from the middle.
  const p = geo.getAttribute('position');
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = 0.5 + p.getX(i) / (2 * r);
    uv[i * 2 + 1] = 0.5 + p.getZ(i) / (2 * r);
  }
  geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  centreCache.set(kind, geo);
  return geo;
}

/** The dark crown of stamens around an anemone's centre; the shader cuts it into filaments. */
function stamenGeometry() {
  const cached = centreCache.get('stamens');
  if (cached) return cached;
  const pts = [
    [0.12, 0.07],
    [0.17, 0.1],
    [0.22, 0.13],
    [0.27, 0.15],
    [0.31, 0.15],
    [0.33, 0.13],
  ].map(([x, y]) => new Vector2(x, y));
  const geo = new LatheGeometry(pts, 96);
  centreCache.set('stamens', geo);
  return geo;
}

export type LeafSpec = {
  at: Vector3;
  dir: Vector3;
  up: Vector3;
  length: number;
  width: number;
  shape: 'ovate' | 'round' | 'lance';
  fold: number;
  droop: number;
  t: number;
};

function leafProfile(shape: LeafSpec['shape'], v: number) {
  if (shape === 'round') return Math.pow(Math.max(Math.sin(Math.PI * Math.pow(v, 0.85)), 0), 0.55);
  if (shape === 'lance') return Math.pow(Math.max(Math.sin(Math.PI * Math.pow(v, 0.7)), 0), 1.1);
  return Math.pow(Math.max(Math.sin(Math.PI * Math.pow(v, 0.72)), 0), 0.8);
}

export function leavesGeometry(leaves: LeafSpec[], low: boolean) {
  const nu = low ? 4 : 6;
  const nv = low ? 6 : 9;
  const pos: number[] = [];
  const anchor: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  const side = new Vector3();
  const nrm = new Vector3();
  const p = new Vector3();
  leaves.forEach((leaf, li) => {
    const dir = leaf.dir.clone().normalize();
    nrm.copy(leaf.up).addScaledVector(dir, -leaf.up.dot(dir)).normalize();
    side.crossVectors(dir, nrm).normalize();
    const base = li * (nu + 1) * (nv + 1);
    for (let j = 0; j <= nv; j++) {
      const v = j / nv;
      const w = leaf.width * leafProfile(leaf.shape, v);
      for (let k = 0; k <= nu; k++) {
        const u = -1 + (2 * k) / nu;
        p.copy(leaf.at)
          .addScaledVector(dir, v * leaf.length)
          .addScaledVector(side, u * w)
          .addScaledVector(nrm, leaf.fold * Math.abs(u) * w - leaf.droop * v * v * leaf.length);
        pos.push(p.x, p.y, p.z);
        anchor.push(leaf.at.x, leaf.at.y, leaf.at.z, leaf.t);
        uv.push(u, v);
      }
    }
    for (let j = 0; j < nv; j++) {
      for (let k = 0; k < nu; k++) {
        const a = base + j * (nu + 1) + k;
        index.push(a, a + 1, a + nu + 1, a + 1, a + nu + 2, a + nu + 1);
      }
    }
  });
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('aAnchor', new Float32BufferAttribute(anchor, 4));
  geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

/* ---------------------------------------------------------------------------------------------
 * Materials
 * ------------------------------------------------------------------------------------------- */

// The shaders take colours as plain sRGB numbers and do their own conversion.
const srgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

export type BloomUniforms = {
  uOpen: { value: number };
  uGrow: { value: number };
  uFog: { value: number };
};

function petalMaterial(kind: FlowerKind, palette: Palette, shared: BloomUniforms) {
  const sp = SPECIES[kind];
  const eye = sp.eye ? srgb(sp.eye[0]) : srgb(palette[0]);
  return new ShaderMaterial({
    uniforms: {
      ...LIGHT,
      uTime: TIME,
      uOpen: shared.uOpen,
      uFog: shared.uFog,
      uA: { value: new Vector4(...sp.A) },
      uB: { value: new Vector4(...sp.B) },
      uC: { value: new Vector4(...sp.C) },
      uD: { value: new Vector4(...sp.D) },
      uE: { value: new Vector4(sp.E[0], sp.E[1], sp.E[2], sp.lift ?? 0) },
      uCol0: { value: srgb(palette[0]) },
      uCol1: { value: srgb(palette[1]) },
      uCol2: { value: srgb(palette[2]) },
      uEye: { value: new Vector4(eye.x, eye.y, eye.z, sp.eye ? sp.eye[1] : 0) },
      uThin: { value: sp.thin },
      uVein: { value: sp.vein },
      uSheen: { value: sp.sheen ?? 0.22 },
    },
    vertexShader: PETAL_VERT,
    fragmentShader: PETAL_FRAG,
    side: DoubleSide,
  });
}

export function surfaceMaterial(
  pattern: number,
  col0: string,
  col1: string,
  shared: Partial<BloomUniforms> = {},
  options: { leaf?: boolean; thin?: number } = {},
) {
  return new ShaderMaterial({
    uniforms: {
      ...LIGHT,
      uTime: TIME,
      uGrow: shared.uGrow ?? { value: 1 },
      uFog: shared.uFog ?? { value: 0 },
      uCol0: { value: srgb(col0) },
      uCol1: { value: srgb(col1) },
      uThin: { value: options.thin ?? 0.35 },
      uPattern: { value: pattern },
    },
    defines: options.leaf ? { LEAF: '' } : {},
    vertexShader: SURFACE_VERT,
    fragmentShader: SURFACE_FRAG,
    side: DoubleSide,
  });
}

/* ---------------------------------------------------------------------------------------------
 * Blooms: a stem, its leaves, and a head that can open.
 * ------------------------------------------------------------------------------------------- */

const UP = new Vector3(0, 1, 0);

export type BloomSpec = {
  kind: FlowerKind;
  palette: Palette;
  /** Where the stem starts, and where the head sits. */
  base: Vector3;
  head: Vector3;
  /** Which way the face of the flower looks. */
  face: Vector3;
  size: number;
  variant?: number;
  leaves?: number;
  stemColour?: [string, string];
  bend?: Vector3;
  sway?: number;
  /** Extra petal detail, for the one or two flowers the eye lands on. */
  hi?: boolean;
};

export type Bloom = {
  kind: FlowerKind | 'eucalyptus' | 'vine';
  group: Group;
  uniforms: BloomUniforms;
  /** Set these; the frame loop applies them. */
  open: number;
  grow: number;
  seed: number;
  sway: number;
  update: (time: number) => void;
  dispose: () => void;
};

function stemCurve(base: Vector3, head: Vector3, face: Vector3, bend?: Vector3) {
  const span = head.distanceTo(base);
  const mid = base.clone().lerp(head, 0.45);
  if (bend) mid.add(bend);
  const near = head.clone().addScaledVector(face, -span * 0.16);
  return new CatmullRomCurve3([base.clone(), mid, near, head.clone().addScaledVector(face, -0.02)], false, 'centripetal');
}

function rotate(obj: Group, dir: Vector3) {
  obj.quaternion.copy(new Quaternion().setFromUnitVectors(UP, dir.clone().normalize()));
}

function finish(kind: Bloom['kind'], group: Group, uniforms: BloomUniforms, seed: number, sway: number, head?: Group, size = 1) {
  const swayer = group;
  const bloom: Bloom = {
    kind,
    group,
    uniforms,
    open: 0,
    grow: 1,
    seed,
    sway,
    update(time) {
      uniforms.uOpen.value = bloom.open;
      uniforms.uGrow.value = bloom.grow;
      const s = bloom.sway;
      swayer.rotation.z = Math.sin(time * 0.55 + seed * 11) * 0.012 * s + Math.sin(time * 1.3 + seed * 5) * 0.003 * s;
      swayer.rotation.x = Math.sin(time * 0.43 + seed * 7) * 0.009 * s;
      if (head) {
        const g = Math.min(Math.max((bloom.grow - 0.78) / 0.22, 0), 1);
        const e = g * g * (3 - 2 * g);
        head.scale.setScalar(Math.max(e, 0.0001) * size);
        head.visible = e > 0.001;
      }
    },
    dispose() {
      group.traverse((o: unknown) => {
        const m = o as Mesh;
        if (m.isMesh) {
          (m.material as ShaderMaterial).dispose();
          // geometries for heads and centres are shared and cached; stems and leaves are not
          if (!m.userData.shared) m.geometry.dispose();
        }
      });
    },
  };
  return bloom;
}

export function makeBloom(spec: BloomSpec, low: boolean): Bloom {
  const uniforms: BloomUniforms = { uOpen: { value: 0 }, uGrow: { value: 1 }, uFog: { value: 0 } };
  const seed = Math.abs(Math.sin(spec.head.x * 12.9 + spec.head.y * 78.2 + spec.head.z * 37.7)) % 1;
  const group = new Group();
  group.position.copy(spec.base);
  const local = (v: Vector3) => v.clone().sub(spec.base);
  const face = spec.face.clone().normalize();

  // stem
  const [s0, s1] = spec.stemColour ?? ['#2e4220', '#5d7438'];
  const curve = stemCurve(local(spec.base), local(spec.head), face, spec.bend);
  const stemRadius = spec.kind === 'cosmos' || spec.kind === 'jasmine' ? 0.018 : 0.03;
  const stem = new Mesh(new TubeGeometry(curve, low ? 18 : 32, stemRadius * Math.max(spec.size, 0.7), 5, false), surfaceMaterial(1, s0, s1, uniforms, { thin: 0.5 }));
  stem.frustumCulled = false;
  group.add(stem);

  // leaves along the stem
  const leafCount = spec.leaves ?? (spec.kind === 'rose' ? 3 : spec.kind === 'cosmos' ? 2 : spec.kind === 'jasmine' ? 0 : 1);
  if (leafCount > 0) {
    const rand = rng(seed + 0.11);
    const leaves: LeafSpec[] = [];
    for (let i = 0; i < leafCount; i++) {
      const t = 0.62 + (i / Math.max(leafCount, 1)) * 0.26 + rand() * 0.05;
      const at = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      const a = i * 2.3 + rand() * 1.2;
      const outward = new Vector3(Math.cos(a), 0, Math.sin(a)).addScaledVector(tan, 0.6).normalize();
      const fine = spec.kind === 'cosmos';
      leaves.push({
        at,
        dir: outward,
        up: tan,
        length: (fine ? 0.5 : 0.62) * spec.size,
        width: (fine ? 0.05 : 0.22) * spec.size,
        shape: fine ? 'lance' : 'ovate',
        fold: 0.35,
        droop: 0.25,
        t,
      });
    }
    const leafMesh = new Mesh(leavesGeometry(leaves, low), surfaceMaterial(2, '#2f4a26', '#6f8a46', uniforms, { leaf: true, thin: 0.9 }));
    leafMesh.frustumCulled = false;
    group.add(leafMesh);
  }

  // head
  const head = new Group();
  head.position.copy(local(spec.head));
  rotate(head, face);
  const petals = new Mesh(headGeometry(spec.kind, low, spec.variant ?? 0, spec.hi), petalMaterial(spec.kind, spec.palette, uniforms));
  petals.frustumCulled = false;
  petals.userData.shared = true;
  head.add(petals);
  const sp = SPECIES[spec.kind];
  if (sp.centre === 'cosmos') {
    const disc = new Mesh(centreGeometry('cosmos'), surfaceMaterial(3, '#b9790c', '#f7c430', uniforms, { thin: 0.4 }));
    disc.userData.shared = true;
    disc.frustumCulled = false;
    head.add(disc);
  } else if (sp.centre === 'anemone') {
    const disc = new Mesh(centreGeometry('anemone'), surfaceMaterial(4, '#0b0d1c', '#1d2440', uniforms, { thin: 0.1 }));
    const stamens = new Mesh(stamenGeometry(), surfaceMaterial(6, '#141528', '#2a1f3a', uniforms, { thin: 0.1 }));
    disc.userData.shared = true;
    stamens.userData.shared = true;
    disc.frustumCulled = false;
    stamens.frustumCulled = false;
    head.add(disc, stamens);
  }
  group.add(head);
  return finish(spec.kind, group, uniforms, seed, spec.sway ?? 1, head, spec.size);
}

/**
 * A sprig of eucalyptus (pairs of round, silvery leaves getting smaller to the tip), or with
 * `look: 'foliage'`, a darker spray of garden leaves to fill the back of a bunch.
 */
export function makeEucalyptus(
  spec: { base: Vector3; tip: Vector3; bend?: Vector3; size: number; pairs?: number; sway?: number; look?: 'eucalyptus' | 'foliage' },
  low: boolean,
): Bloom {
  const foliage = spec.look === 'foliage';
  const uniforms: BloomUniforms = { uOpen: { value: 1 }, uGrow: { value: 1 }, uFog: { value: 0 } };
  const seed = Math.abs(Math.sin(spec.tip.x * 4.1 + spec.tip.y * 9.7)) % 1;
  const group = new Group();
  group.position.copy(spec.base);
  const tip = spec.tip.clone().sub(spec.base);
  const dir = tip.clone().normalize();
  const curve = stemCurve(new Vector3(), tip, dir, spec.bend);
  const stem = new Mesh(new TubeGeometry(curve, low ? 18 : 30, 0.014 * spec.size + 0.006, 4, false), surfaceMaterial(1, '#4b5a44', '#8b7b62', uniforms, { thin: 0.4 }));
  stem.frustumCulled = false;
  group.add(stem);
  const rand = rng(seed + 0.3);
  const leaves: LeafSpec[] = [];
  const pairs = spec.pairs ?? 7;
  for (let i = 0; i < pairs; i++) {
    const t = 0.3 + (i / pairs) * 0.68;
    const at = curve.getPointAt(Math.min(t, 0.99));
    const tan = curve.getTangentAt(Math.min(t, 0.99));
    const twist = i * 1.57 + rand() * 0.4;
    const ax = new Vector3(Math.cos(twist), 0, Math.sin(twist));
    ax.addScaledVector(tan, -ax.dot(tan)).normalize();
    const scale = (1 - (i / pairs) * 0.55) * spec.size;
    for (const s of foliage ? [i % 2 ? 1 : -1] : [1, -1]) {
      leaves.push({
        at,
        dir: ax.clone().multiplyScalar(s).addScaledVector(tan, foliage ? 0.9 : 0.35).normalize(),
        up: tan.clone().cross(ax).normalize(),
        length: (foliage ? 0.62 : 0.3) * scale,
        width: (foliage ? 0.24 : 0.16) * scale,
        shape: foliage ? 'ovate' : 'round',
        fold: foliage ? 0.3 : 0.12,
        droop: foliage ? 0.3 : 0.12,
        t,
      });
    }
  }
  const leafMesh = new Mesh(
    leavesGeometry(leaves, low),
    foliage
      ? surfaceMaterial(2, '#2a4320', '#5d7a38', uniforms, { leaf: true, thin: 0.9 })
      : surfaceMaterial(2, '#6f8a80', '#a9bdb2', uniforms, { leaf: true, thin: 0.55 }),
  );
  leafMesh.frustumCulled = false;
  group.add(leafMesh);
  return finish('eucalyptus', group, uniforms, seed, spec.sway ?? 1);
}

/** A trailing jasmine vine: an arching stem, small pointed leaves, a few starry flowers. */
export function makeVine(
  spec: { base: Vector3; points: Vector3[]; size: number; flowers?: number; sway?: number },
  low: boolean,
): { bloom: Bloom; flowers: Bloom[] } {
  const uniforms: BloomUniforms = { uOpen: { value: 1 }, uGrow: { value: 1 }, uFog: { value: 0 } };
  const seed = Math.abs(Math.sin(spec.points[0].x * 3.7 + spec.points[0].y * 5.3)) % 1;
  const group = new Group();
  group.position.copy(spec.base);
  const curve = new CatmullRomCurve3([new Vector3(), ...spec.points.map((p) => p.clone().sub(spec.base))], false, 'centripetal');
  const stem = new Mesh(new TubeGeometry(curve, low ? 28 : 48, 0.011, 4, false), surfaceMaterial(1, '#3a4a26', '#62763a', uniforms, { thin: 0.5 }));
  stem.frustumCulled = false;
  group.add(stem);
  const rand = rng(seed + 0.5);
  const leaves: LeafSpec[] = [];
  const n = low ? 10 : 16;
  for (let i = 0; i < n; i++) {
    const t = 0.12 + (i / n) * 0.86;
    const at = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    const a = i * 2.4 + rand();
    const out = new Vector3(Math.cos(a), Math.sin(a) * 0.5, Math.sin(a)).addScaledVector(tan, 0.8).normalize();
    leaves.push({
      at,
      dir: out,
      up: new Vector3(0, 1, 0),
      length: (0.22 + rand() * 0.08) * spec.size,
      width: 0.07 * spec.size,
      shape: 'lance',
      fold: 0.25,
      droop: 0.2,
      t,
    });
  }
  const leafMesh = new Mesh(leavesGeometry(leaves, low), surfaceMaterial(2, '#24401f', '#557a35', uniforms, { leaf: true, thin: 0.8 }));
  leafMesh.frustumCulled = false;
  group.add(leafMesh);

  const flowers: Bloom[] = [];
  const count = spec.flowers ?? 4;
  for (let i = 0; i < count; i++) {
    const t = 0.35 + (i / count) * 0.6 + rand() * 0.04;
    const at = curve.getPointAt(Math.min(t, 0.98)).add(spec.base);
    const face = new Vector3(rand() - 0.5, 0.4 + rand() * 0.4, 0.9).normalize();
    const f = makeBloom(
      {
        kind: 'jasmine',
        palette: PALETTES.jasmine,
        base: at.clone(),
        head: at.clone().addScaledVector(face, 0.06),
        face,
        size: 0.13 * spec.size,
        leaves: 0,
        sway: 0,
      },
      low,
    );
    // the little flowers ride on the vine, so they sway with it
    f.group.position.sub(spec.base);
    group.add(f.group);
    flowers.push(f);
  }
  return { bloom: finish('vine', group, uniforms, seed, spec.sway ?? 1), flowers };
}

/** A footed stoneware compote, the classic vessel for a loose arrangement. */
export function makeCompote(low: boolean) {
  const pts = [
    [0.0, -1.62],
    [0.42, -1.62],
    [0.46, -1.58],
    [0.44, -1.54],
    [0.2, -1.48],
    [0.13, -1.36],
    [0.12, -1.18],
    [0.16, -1.05],
    [0.42, -0.96],
    [0.78, -0.82],
    [0.98, -0.62],
    [1.06, -0.46],
    [1.08, -0.41],
    [1.05, -0.4],
    [0.96, -0.55],
    [0.7, -0.74],
    [0.0, -0.82],
  ].map(([x, y]) => new Vector2(Math.max(x, 0.0001), y));
  const geo = new LatheGeometry(pts, low ? 40 : 72);
  const mat = surfaceMaterial(5, '#d9cbb4', '#efe6d6', {}, { thin: 0.05 });
  const mesh = new Mesh(geo, mat);
  // a dark pool of water and moss inside the bowl
  const fill = new Mesh(new LatheGeometry([new Vector2(0.0001, -0.52), new Vector2(0.96, -0.5)], low ? 32 : 56), surfaceMaterial(0, '#1d2416', '#1d2416', {}, { thin: 0 }));
  const group = new Group();
  group.add(mesh, fill);
  return group;
}

export function disposeGroup(group: Group) {
  group.traverse((o: unknown) => {
    const m = o as Mesh;
    if (m.isMesh) {
      (m.material as ShaderMaterial).dispose();
      if (!m.userData.shared) m.geometry.dispose();
    }
  });
}
