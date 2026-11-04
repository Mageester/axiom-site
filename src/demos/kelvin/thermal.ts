/**
 * The heat model for the thermal view. The numbers below feed both the GLSL that paints the
 * house and the small JavaScript port that answers "what is the temperature under the
 * reticle?", so the readout agrees with the picture.
 */

export const FRONT_MAX = 14;
export const T_LO = -26;
export const T_HI = 42;

/** Ironbow, in degrees Celsius. */
export const STOPS: Array<[number, string]> = [
  [-26, '#000000'],
  [-18, '#0a0638'],
  [-9, '#2310a6'],
  [-1, '#5a17b8'],
  [6, '#9a1aa6'],
  [12, '#c6237a'],
  [17, '#ef4627'],
  [22, '#fc8a1a'],
  [28, '#ffc72b'],
  [34, '#fff1a2'],
  [42, '#ffffff'],
];

export const KIND = {
  WALL: 0,
  GLASS: 1,
  ROOF: 2,
  EARTH: 3,
  FURNACE: 4,
  FLUE: 5,
  DUCT: 6,
  BOOT: 7,
  OBJECT: 8,
  BODY: 9,
  AC: 10,
  FRAME: 11,
  RETURN: 12,
  BRICK: 13,
  GHOST: 14,
} as const;

export const KIND_NAMES = [
  'WALL',
  'GLASS',
  'ROOF DECK',
  'SOIL',
  'FURNACE',
  'FLUE',
  'SUPPLY DUCT',
  'REGISTER',
  'FURNITURE',
  'BODY',
  'CONDENSER',
  'FRAME',
  'RETURN DUCT',
  'BRICK',
  'AIR',
];

/** Heat sources: position and how far along the ductwork (metres) warm air has to travel. */
export const SOURCES: Array<{ pos: [number, number, number]; path: number }> = [
  { pos: [3.1, -1.9, -2.3], path: 0 },
  { pos: [0, -0.55, -2.7], path: 3.2 },
  { pos: [4.25, 0.35, -2.6], path: 1.95 },
  { pos: [4.25, 3.15, -2.6], path: 4.75 },
  { pos: [-1.2, 0.35, -2.6], path: 5.3 },
  { pos: [-1.2, 3.15, -2.6], path: 8.1 },
  { pos: [-4.2, 0.35, -2.6], path: 8.3 },
  { pos: [-4.2, 3.15, -2.6], path: 11.1 },
];

/** Windows: x, sill height, z, half width. */
export const WINDOWS: Array<[number, number, number, number]> = [
  [-2.9, 0.95, -2.98, 0.9],
  [2.0, 1.1, -2.98, 0.65],
  [-3.0, 3.75, -2.98, 0.85],
  [2.6, 3.75, -2.98, 0.8],
  [0.9, 4.4, -2.98, 0.35],
  [4.78, 0.95, -0.2, 0.8],
  [4.78, 3.75, -0.2, 0.8],
];

export const BODIES: Array<[number, number, number, number]> = [
  [-3.6, 3.2, -1.7, 0],
  [2.5, 3.1, -1.8, 0],
];

const C = {
  OUT_W: -18,
  OUT_S: 33,
  IN_OFF_W: -4,
  IN_OFF_S: 25,
  IN_ON_W: 21,
  IN_ON_S: 15,
  GROUND_W: 3,
  GROUND_S: 15,
};

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

export function ironbow(t: number): [number, number, number] {
  if (t <= STOPS[0][0]) return hexToRgb(STOPS[0][1]);
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const k = (t - STOPS[i - 1][0]) / (STOPS[i][0] - STOPS[i - 1][0]);
      const a = hexToRgb(STOPS[i - 1][1]);
      const b = hexToRgb(STOPS[i][1]);
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }
  }
  return hexToRgb(STOPS[STOPS.length - 1][1]);
}

export const ironbowCss = (t: number) => {
  const [r, g, b] = ironbow(t);
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
};

/** A CSS gradient of the whole scale, bottom cold and top hot unless told otherwise. */
export const scaleGradient = (direction = 'to top') =>
  `linear-gradient(${direction}, ${STOPS.map(([t, h]) => `${h} ${Math.round(((t - T_LO) / (T_HI - T_LO)) * 100)}%`).join(', ')})`;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export type HeatState = { front: number; season: number };

const act = (path: number, front: number) => smooth(path, path + 2.4, front);

/** Air temperature at a point in the house, matching the shader without its noise. */
export function airTemp(x: number, y: number, z: number, s: HeatState) {
  let c = 0;
  let blast = 0;
  SOURCES.forEach((src, i) => {
    const a = act(src.path, s.front);
    let dx = x - src.pos[0];
    let dy = y - src.pos[1];
    const dz = z - src.pos[2];
    const rawDy = dy;
    dy *= dy > 0 ? 0.7 : 1.9;
    const R = i === 0 ? 3.7 : 2.7;
    const q = Math.hypot(dx, dy, dz) / R;
    c += a * Math.exp(-q * q * 1.1) * (i === 1 ? 0.45 : 1);
    if (i > 1) {
      const h = Math.max(rawDy + 0.2, 0);
      const r = Math.hypot(dx, dz) / (0.5 + 0.3 * h);
      blast += a * Math.exp(-r * r) * Math.exp(-h / 1.5) * smooth(-0.5, 0, rawDy);
    }
  });
  const cond = 1 - Math.exp(-c * mix(2.3, 3.8, s.season));
  let tb = mix(C.IN_OFF_W, C.IN_OFF_S, s.season);
  tb = mix(tb, mix(C.GROUND_W, C.GROUND_S, s.season), smooth(-0.1, -0.7, y));
  tb += s.season * (Math.min(Math.max(y, -0.7), 6) - 1.5) * 1.7;
  const tt = mix(C.IN_ON_W, C.IN_ON_S, s.season);
  const ta = mix(tb, tt, cond) + blast * mix(26, -13, s.season);
  return { ta, tb, cond };
}

/** Surface temperature of a given kind at a world position. */
export function surfaceTemp(x: number, y: number, z: number, kind: number, s: HeatState) {
  const { ta, tb } = airTemp(x, y, z, s);
  const tout = mix(C.OUT_W, C.OUT_S, s.season);
  const act0 = smooth(0, 2.4, s.front);
  const dEnv = Math.min(z + 2.98, 4.78 - x);
  const prox = 1 - smooth(0, 1.6, Math.max(dEnv, 0));
  const winter = 1 - s.season;
  switch (kind) {
    case KIND.GLASS:
      return mix(ta, tout + 8 * s.season, 0.62);
    case KIND.ROOF: {
      const rt = mix(tout + s.season * 17, ta, 0.3);
      return rt + (ta - tout) * 0.12 * smooth(6.6, 8, y);
    }
    case KIND.EARTH: {
      const depth = Math.min(Math.max(-y / 3.6, 0), 1);
      const surf = tout - 2 * winter - 8 * s.season;
      const deep = mix(5, 13, s.season);
      const dx = Math.max(Math.abs(x) - 5, 0);
      const dz = Math.max(-3.2 - z, 0);
      const near = Math.exp(-Math.hypot(dx, dz) / 1.3);
      return mix(surf, deep, smooth(0, 1, depth * 1.15)) + near * 7 * smooth(0, 3, s.front) * (1 - 1.5 * s.season);
    }
    case KIND.FURNACE:
      return mix(mix(ta, 40, act0 * 0.95 * winter), mix(ta, 12, act0 * 0.6), s.season);
    case KIND.FLUE:
      return mix(ta, 64, act0 * winter);
    case KIND.DUCT:
    case KIND.BOOT: {
      return mix(ta, mix(52, 9, s.season), 1);
    }
    case KIND.OBJECT:
      return mix(ta, tb, 0.5);
    case KIND.BODY:
      return 28;
    case KIND.AC:
      return tout + s.season * act0 * 26;
    case KIND.FRAME:
      return mix(ta, tout + 6 * s.season, 0.4);
    case KIND.RETURN:
      return ta + (s.season * 2 - 3) * act0;
    case KIND.BRICK:
      return mix(tout, 60, act0 * winter * 0.4);
    default:
      return mix(ta, tout + 6 * s.season, (0.3 + 0.35 * s.season) * prox);
  }
}
/** Ducts warm in order along their length, so they need their own path. */
export function ductTemp(x: number, y: number, z: number, path: number, s: HeatState) {
  const { ta } = airTemp(x, y, z, s);
  const local = smooth(path - 0.4, path + 1.1, s.front);
  return mix(ta, mix(52, 9, s.season), local);
}

export const sampleSky = () => -24;

/** The shared GLSL: the palette and the temperature of any fragment. */
export function thermalGLSL(low: boolean) {
  const n = STOPS.length;
  const ps = STOPS.map(([t]) => t.toFixed(1)).join(',');
  const pc = STOPS.map(([, h]) => `vec3(${hexToRgb(h).map((v) => v.toFixed(4)).join(',')})`).join(',');
  const srcs = SOURCES.map((s) => `vec4(${s.pos.map((v) => v.toFixed(2)).join(',')},${s.path.toFixed(2)})`).join(',');
  const wins = WINDOWS.map((w) => `vec4(${w.map((v) => v.toFixed(2)).join(',')})`).join(',');
  const bodies = BODIES.map((b) => `vec4(${b.map((v) => v.toFixed(2)).join(',')})`).join(',');
  return /* glsl */ `
const float PS[${n}] = float[${n}](${ps});
const vec3 PC[${n}] = vec3[${n}](${pc});
const vec4 SRC[${SOURCES.length}] = vec4[${SOURCES.length}](${srcs});
const vec4 WIN[${WINDOWS.length}] = vec4[${WINDOWS.length}](${wins});
const vec4 BODY[${BODIES.length}] = vec4[${BODIES.length}](${bodies});

uniform float uTime;
uniform float uFront;
uniform float uSeason;

vec3 ironbow(float T) {
  vec3 c = PC[0];
  for (int i = 1; i < ${n}; i++) {
    float k = clamp((T - PS[i - 1]) / (PS[i] - PS[i - 1]), 0.0, 1.0);
    c = mix(c, PC[i], k);
  }
  return c;
}

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), f.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}

float act(float path) {
  return smoothstep(path, path + 2.4, uFront);
}

// x: air temperature, y: temperature with no conditioning, z: how conditioned (0 to 1)
vec3 airAt(vec3 p, float n) {
  float c = 0.0;
  float blast = 0.0;
  for (int i = 0; i < ${SOURCES.length}; i++) {
    vec4 s = SRC[i];
    float a = act(s.w);
    vec3 d = p - s.xyz;
    float rawDy = d.y;
    d.y *= d.y > 0.0 ? 0.7 : 1.9;
    float R = i == 0 ? 3.7 : 2.7;
    float q = length(d) / R;
    c += a * exp(-q * q * 1.1) * (i == 1 ? 0.45 : 1.0);
    if (i > 1) {
      float h = max(rawDy + 0.2, 0.0);
      float r = length(d.xz) / (0.5 + 0.3 * h);
      blast += a * exp(-r * r) * exp(-h / 1.5) * smoothstep(-0.5, 0.0, rawDy);
    }
  }
  float cond = 1.0 - exp(-c * mix(2.3, 3.8, uSeason));
  float tb = mix(${C.IN_OFF_W.toFixed(1)}, ${C.IN_OFF_S.toFixed(1)}, uSeason);
  tb = mix(tb, mix(${C.GROUND_W.toFixed(1)}, ${C.GROUND_S.toFixed(1)}, uSeason), smoothstep(-0.1, -0.7, p.y));
  tb += uSeason * (clamp(p.y, -0.7, 6.0) - 1.5) * 1.7;
  float tt = mix(${C.IN_ON_W.toFixed(1)}, ${C.IN_ON_S.toFixed(1)}, uSeason);
  float ta = mix(tb, tt, cond) + blast * mix(26.0, -13.0, uSeason) * (0.7 + 0.6 * n);
  return vec3(ta, tb, cond);
}

float surfaceT(vec3 p, vec3 nrm, float kind, float path) {
  float tm = uTime;
  float nz = vnoise(p * 1.6 + vec3(0.0, -tm * 0.35, tm * 0.1));
  ${low ? 'float fine = 0.5;' : 'float fine = vnoise(p * 7.0 + vec3(0.0, -tm * 0.6, 0.0));'}
  vec3 A = airAt(p, nz);
  float ta = A.x;
  float tb = A.y;
  float tout = mix(${C.OUT_W.toFixed(1)}, ${C.OUT_S.toFixed(1)}, uSeason);
  float winter = 1.0 - uSeason;
  float act0 = smoothstep(0.0, 2.4, uFront);
  float dEnv = min(p.z + 2.98, 4.78 - p.x);
  float prox = 1.0 - smoothstep(0.0, 1.6, max(dEnv, 0.0));
  float T = ta;

  if (kind < 0.5 || (kind > 10.5 && kind < 11.5)) {
    // Walls and frames: room air, pulled toward outside near the envelope, with cold
    // drafts pooling under every window.
    float sun = 6.0 * uSeason;
    T = kind < 0.5 ? mix(ta, tout + sun, (0.3 + 0.35 * uSeason) * prox) : mix(ta, tout + sun, 0.4);
    float hl = 0.0;
    float dr = 0.0;
    for (int i = 0; i < ${WINDOWS.length}; i++) {
      vec4 w = WIN[i];
      float hd = length(p.xz - w.xz);
      float dxh = max(hd - w.w, 0.0);
      float yb = w.y;
      float yt = w.y + 1.3;
      float dyr = p.y < yb ? yb - p.y : (p.y > yt ? p.y - yt : 0.0);
      hl += exp(-length(vec2(dxh, dyr)) / 0.26);
      float below = max(yb - p.y, 0.0);
      dr += exp(-pow(dxh / (0.35 + 0.18 * below), 2.0)) * exp(-below / 1.7) * step(0.0, yb - p.y + 0.02);
    }
    float vertical = 1.0 - smoothstep(0.4, 0.8, abs(nrm.y));
    T -= (ta - tout) * (0.22 * hl + 0.4 * dr * vertical);
    for (int i = 0; i < ${BODIES.length}; i++) {
      T += 8.0 * exp(-pow(length(p - BODY[i].xyz) / 1.2, 2.0));
    }
  } else if (kind < 1.5) {
    T = mix(ta, tout + 8.0 * uSeason, 0.62) + (nz - 0.5) * 1.5;
  } else if (kind < 2.5) {
    float rt = mix(tout + uSeason * 17.0, ta, 0.3);
    T = rt + (ta - tout) * 0.12 * smoothstep(6.6, 8.0, p.y);
  } else if (kind < 3.5) {
    float depth = clamp(-p.y / 3.6, 0.0, 1.0);
    float surf = tout - 2.0 * winter - 8.0 * uSeason;
    float deep = mix(5.0, 13.0, uSeason);
    T = mix(surf, deep, smoothstep(0.0, 1.0, depth * 1.15));
    float dx = max(abs(p.x) - 5.0, 0.0);
    float dz = max(-3.2 - p.z, 0.0);
    T += exp(-length(vec2(dx, dz)) / 1.3) * 7.0 * smoothstep(0.0, 3.0, uFront) * (1.0 - 1.5 * uSeason);
    T += (nz - 0.5) * 2.6;
    float iso = abs(fract(T / 5.0 + 0.5) - 0.5);
    T += 1.5 * smoothstep(0.06, 0.0, iso);
  } else if (kind < 4.5) {
    float hotCase = act0 * winter;
    float louver = step(0.55, fract(p.y * 8.0)) * smoothstep(0.5, 0.9, nrm.z) * step(p.y, -1.9);
    float casing = 31.0 + 15.0 * smoothstep(-1.85, -2.6, p.y) + nz * 3.0 - louver * 4.5;
    T = mix(mix(ta, casing, hotCase * 0.95), mix(ta, 12.0, act0 * 0.6), uSeason);
  } else if (kind < 5.5) {
    T = mix(ta, 64.0, act0 * winter) + nz * 4.0 * act0;
  } else if (kind < 7.5) {
    float local = smoothstep(path - 0.4, path + 1.1, uFront);
    T = mix(ta, mix(52.0, 9.0, uSeason), local);
    T += (1.0 - 2.0 * uSeason) * 10.0 * exp(-pow((uFront - path) / 0.55, 2.0)) * step(0.01, uFront);
    T += (nz - 0.5) * 2.0 * local;
  } else if (kind < 8.5) {
    T = mix(ta, tb, 0.5);
    for (int i = 0; i < ${BODIES.length}; i++) {
      T += 8.0 * exp(-pow(length(p - BODY[i].xyz) / 1.2, 2.0));
    }
  } else if (kind < 9.5) {
    T = 28.0 + (nz - 0.5) * 3.0;
  } else if (kind < 10.5) {
    T = tout + uSeason * act0 * 26.0 + (nz - 0.5) * 2.0 * uSeason;
  } else if (kind < 12.5) {
    T = ta + (uSeason * 2.0 - 3.0) * act0;
  } else if (kind < 13.5) {
    T = mix(tout, 60.0, act0 * winter * 0.4);
  }

  // Faces turned different ways read slightly differently, so the form stays readable.
  T += dot(nrm, normalize(vec3(-0.4, 0.75, 0.5))) * 1.25;
  // Convective shimmer.
  float body = smoothstep(-8.0, 20.0, T);
  T += (nz - 0.5) * 1.6 * body + (fine - 0.5) * 0.8 * body;
  return T;
}
`;
}
