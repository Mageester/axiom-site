/**
 * The four looks the lawn moves between as the page scrolls. Colours are in display space,
 * 0 to 1. The scene blends them by weight, so anything between two seasons is a mix.
 */
export type RGB = [number, number, number];

export type Look = {
  skyTop: RGB;
  skyHor: RGB;
  sun: RGB;
  amb: RGB;
  fog: RGB;
  tree: RGB;
  root: RGB;
  tip: RGB;
  alt: RGB;
  ground: RGB;
  groundFar: RGB;
  altAmt: number;
  wind: number;
  height: number;
  stripe: number;
  fogDen: number;
  cloud: number;
  sunVis: number;
  /** Degrees right of straight ahead, and above the horizon. */
  sunAz: number;
  sunEl: number;
  /** Camera tilt and turn, in degrees, added to the layout's own. */
  pitch: number;
  yaw: number;
};

// 0 summer evening, 1 autumn afternoon, 2 winter dusk, 3 spring morning.
export const LOOKS: Look[] = [
  {
    skyTop: [0.085, 0.13, 0.165],
    skyHor: [0.82, 0.58, 0.36],
    sun: [1.0, 0.7, 0.4],
    amb: [0.15, 0.18, 0.16],
    fog: [0.62, 0.47, 0.32],
    tree: [0.07, 0.085, 0.07],
    root: [0.02, 0.045, 0.018],
    tip: [0.22, 0.34, 0.085],
    alt: [0.36, 0.4, 0.1],
    ground: [0.035, 0.055, 0.02],
    groundFar: [0.15, 0.19, 0.065],
    altAmt: 0.2,
    wind: 0.55,
    height: 1.0,
    stripe: 1.0,
    fogDen: 0.036,
    cloud: 0.42,
    sunVis: 1,
    sunAz: 15,
    sunEl: 4.6,
    pitch: 0,
    yaw: 0,
  },
  {
    skyTop: [0.13, 0.1, 0.09],
    skyHor: [0.85, 0.48, 0.24],
    sun: [1.0, 0.55, 0.25],
    amb: [0.17, 0.14, 0.11],
    fog: [0.62, 0.4, 0.23],
    tree: [0.15, 0.08, 0.045],
    root: [0.035, 0.04, 0.018],
    tip: [0.28, 0.3, 0.09],
    alt: [0.56, 0.38, 0.09],
    ground: [0.055, 0.045, 0.02],
    groundFar: [0.23, 0.17, 0.065],
    altAmt: 0.52,
    wind: 0.85,
    height: 0.86,
    stripe: 0.2,
    fogDen: 0.034,
    cloud: 0.7,
    sunVis: 1,
    sunAz: 7,
    sunEl: 3.4,
    pitch: -1,
    yaw: 1.5,
  },
  {
    skyTop: [0.085, 0.125, 0.2],
    skyHor: [0.66, 0.66, 0.72],
    sun: [1.0, 0.8, 0.68],
    amb: [0.34, 0.41, 0.5],
    fog: [0.55, 0.6, 0.68],
    tree: [0.2, 0.2, 0.24],
    root: [0.045, 0.055, 0.035],
    tip: [0.2, 0.23, 0.13],
    alt: [0.42, 0.39, 0.26],
    ground: [0.045, 0.055, 0.035],
    groundFar: [0.45, 0.47, 0.52],
    altAmt: 0.45,
    wind: 0.28,
    height: 0.78,
    stripe: 0,
    fogDen: 0.046,
    cloud: 0.78,
    sunVis: 0.45,
    sunAz: 9,
    sunEl: 3.6,
    pitch: -2.5,
    yaw: -1.5,
  },
  {
    skyTop: [0.15, 0.25, 0.33],
    skyHor: [0.87, 0.79, 0.6],
    sun: [1.0, 0.86, 0.6],
    amb: [0.21, 0.26, 0.21],
    fog: [0.68, 0.68, 0.54],
    tree: [0.12, 0.16, 0.09],
    root: [0.025, 0.065, 0.02],
    tip: [0.27, 0.5, 0.11],
    alt: [0.44, 0.6, 0.15],
    ground: [0.045, 0.075, 0.028],
    groundFar: [0.21, 0.31, 0.085],
    altAmt: 0.3,
    wind: 0.5,
    height: 0.84,
    stripe: 0.85,
    fogDen: 0.026,
    cloud: 0.42,
    sunVis: 1,
    sunAz: 21,
    sunEl: 7,
    pitch: -0.5,
    yaw: 0.5,
  },
];

export type Blend = Look & {
  weights: [number, number, number, number];
  snow: number;
  litter: number;
  leafFall: number;
  snowFall: number;
  motes: number;
  winter: number;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** The look at a point in the year, from 0 (summer) to 3 (spring). */
export function blendLook(season: number, out: Partial<Blend> = {}): Blend {
  const s = Math.min(Math.max(season, 0), 3);
  const weights = [0, 1, 2, 3].map((i) => Math.max(0, 1 - Math.abs(s - i))) as Blend['weights'];
  const o = out as Blend;
  for (const key of Object.keys(LOOKS[0]) as (keyof Look)[]) {
    const first = LOOKS[0][key];
    if (Array.isArray(first)) {
      const v: RGB = (Array.isArray(o[key]) ? o[key] : [0, 0, 0]) as RGB;
      v[0] = v[1] = v[2] = 0;
      LOOKS.forEach((look, i) => {
        const c = look[key] as RGB;
        v[0] += c[0] * weights[i];
        v[1] += c[1] * weights[i];
        v[2] += c[2] * weights[i];
      });
      (o as Record<string, unknown>)[key] = v;
    } else {
      (o as Record<string, unknown>)[key] = LOOKS.reduce((sum, look, i) => sum + (look[key] as number) * weights[i], 0);
    }
  }
  o.weights = weights;
  o.snow = smooth(1.3, 1.95, s) * (1 - smooth(2.3, 2.85, s));
  o.winter = smooth(1.2, 1.8, s) * (1 - smooth(2.4, 2.9, s));
  o.litter = smooth(0.35, 0.95, s) * (1 - smooth(1.55, 2.0, s));
  o.leafFall = smooth(0.4, 0.85, s) * (1 - smooth(1.3, 1.7, s));
  o.snowFall = smooth(1.35, 1.8, s) * (1 - smooth(2.3, 2.7, s));
  o.motes = 1 - smooth(0.9, 1.6, s) + smooth(2.5, 3, s) * 0.8;
  return o;
}
