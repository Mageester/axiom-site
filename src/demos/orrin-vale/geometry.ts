/**
 * A round brilliant, cut in code. The stone is the space inside 73 planes: a table, eight
 * stars, eight kites and sixteen upper girdle facets on the crown, a sixteen-sided girdle,
 * and eight mains with sixteen lower girdle facets on the pavilion. Proportions follow a
 * classic ideal cut (34.5° crown, 40.75° pavilion, 55% table), with the girdle radius as 1.
 *
 * The shader traces light through these planes, and the page's still drawing is cut from
 * the same list, so the two always agree.
 */
export type Vec3 = [number, number, number];
export type Plane = { n: Vec3; d: number; kind: 'table' | 'star' | 'kite' | 'upper' | 'girdle' | 'main' | 'lower' };

const DEG = Math.PI / 180;
const CROWN = 34.5 * DEG;
const PAVILION = 40.75 * DEG;
const TABLE = 0.55;
const GIRDLE = 0.018;
const STAR = 0.5;
const LOWER = 0.78;

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const at = (az: number, r: number, y: number): Vec3 => [r * Math.cos(az), y, r * Math.sin(az)];

function through(a: Vec3, b: Vec3, c: Vec3, kind: Plane['kind']): Plane {
  let n = norm(cross(sub(b, a), sub(c, a)));
  let d = dot(n, a);
  if (d < 0) {
    n = [-n[0], -n[1], -n[2]];
    d = -d;
  }
  return { n, d, kind };
}

export const TABLE_Y = GIRDLE + (1 - TABLE) * Math.tan(CROWN);
export const CULET_Y = -GIRDLE - Math.tan(PAVILION);

export function brilliant(): Plane[] {
  const planes: Plane[] = [];
  const yt = TABLE_Y;
  planes.push({ n: [0, 1, 0], d: yt, kind: 'table' });

  const kiteN = (az: number): Vec3 => [Math.sin(CROWN) * Math.cos(az), Math.cos(CROWN), Math.sin(CROWN) * Math.sin(az)];
  const mainN = (az: number): Vec3 => [Math.sin(PAVILION) * Math.cos(az), -Math.cos(PAVILION), Math.sin(PAVILION) * Math.sin(az)];
  const step = 45 * DEG;
  const half = 22.5 * DEG;

  // Where two kites meet, partway down: the star facets' lower points.
  const starY = GIRDLE + STAR * (yt - GIRDLE);
  const starR = (Math.sin(CROWN) + Math.cos(CROWN) * (GIRDLE - starY)) / (Math.sin(CROWN) * Math.cos(half));
  // Where two pavilion mains meet, most of the way to the culet: the lower girdle points.
  const lowY = -GIRDLE - LOWER * Math.tan(PAVILION);
  const lowR = (Math.sin(PAVILION) + Math.cos(PAVILION) * (GIRDLE + lowY)) / (Math.sin(PAVILION) * Math.cos(half));

  for (let k = 0; k < 8; k++) {
    const az = k * step;
    const azs = az + half;
    const T0 = at(az, TABLE, yt);
    const T1 = at(az + step, TABLE, yt);
    const S = at(azs, starR, starY);
    const G0 = at(az, 1, GIRDLE);
    const G1 = at(az + step, 1, GIRDLE);
    const M = at(azs, 1, GIRDLE);
    planes.push({ n: kiteN(az), d: dot(kiteN(az), G0), kind: 'kite' });
    planes.push(through(T0, T1, S, 'star'));
    planes.push(through(S, G0, M, 'upper'));
    planes.push(through(S, M, G1, 'upper'));

    const B0 = at(az, 1, -GIRDLE);
    const B1 = at(az + step, 1, -GIRDLE);
    const BM = at(azs, 1, -GIRDLE);
    const L = at(azs, lowR, lowY);
    planes.push({ n: mainN(az), d: dot(mainN(az), B0), kind: 'main' });
    planes.push(through(L, B0, BM, 'lower'));
    planes.push(through(L, BM, B1, 'lower'));
  }
  // A faceted girdle: sixteen flat sides through the girdle points.
  for (let k = 0; k < 16; k++) {
    const az = (k + 0.5) * half;
    planes.push({ n: [Math.cos(az), 0, Math.sin(az)], d: Math.cos(half / 2), kind: 'girdle' });
  }
  return planes;
}

/** Each facet as a polygon: a big square on its plane, clipped by every other plane. */
export function facets(planes: Plane[]) {
  return planes.map((plane, index) => {
    const n = plane.n;
    const helper: Vec3 = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const u = norm(cross(n, helper));
    const v = cross(n, u);
    const o: Vec3 = [n[0] * plane.d, n[1] * plane.d, n[2] * plane.d];
    const S = 4;
    let poly: Vec3[] = [
      [o[0] + (u[0] + v[0]) * S, o[1] + (u[1] + v[1]) * S, o[2] + (u[2] + v[2]) * S],
      [o[0] + (u[0] - v[0]) * S, o[1] + (u[1] - v[1]) * S, o[2] + (u[2] - v[2]) * S],
      [o[0] - (u[0] + v[0]) * S, o[1] - (u[1] + v[1]) * S, o[2] - (u[2] + v[2]) * S],
      [o[0] - (u[0] - v[0]) * S, o[1] - (u[1] - v[1]) * S, o[2] - (u[2] - v[2]) * S],
    ];
    planes.forEach((other, j) => {
      if (j === index || poly.length < 3) return;
      const next: Vec3[] = [];
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        const da = dot(other.n, a) - other.d;
        const db = dot(other.n, b) - other.d;
        if (da <= 1e-7) next.push(a);
        if ((da <= 1e-7) !== (db <= 1e-7)) {
          const t = da / (da - db);
          next.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
        }
      }
      poly = next;
    });
    return { plane, poly };
  });
}
