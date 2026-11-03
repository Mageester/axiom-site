/**
 * The seven bone shapes the spine is made from, each a small sculpture in distance fields.
 * Local axes: +y toward the head, +z toward the front of the body, x across.
 * Sizes are nominal; each vertebra scales one of these to its place along the spine.
 */
import { body, ellipsoid, mirrorX, meshFromSDF, ring, roundCone, smax, smin, union, type MeshData, type SDF } from './sdf';

export type BoneKind = 'atlas' | 'axis' | 'cervical' | 'thoracicUpper' | 'thoracicLower' | 'lumbar' | 'sacrum';

export type BoneSpec = {
  sdf: SDF;
  min: [number, number, number];
  max: [number, number, number];
  /** Half-extents of the weight-bearing body, used to size the discs. */
  ax: number;
  az: number;
  h: number;
};

const vertebra = (o: {
  ax: number; az: number; h: number; r: number; waist: number;
  fx: number; fz: number; tube: number; ky: number;
  pedicle: number;
  spinous: { len: number; drop: number; r1: number; r2: number; wide?: number };
  transverse: { len: number; back: number; up: number; r1: number; r2: number };
  articular: { x: number; up: number; back: number; rx: number; ry: number; rz: number };
}): SDF => {
  const cz = -o.az * 0.86 - o.fz;
  const backZ = cz - o.fz - o.tube;
  const solidBody = body(o.ax, o.az, o.h, o.r, o.waist);
  const notch = ellipsoid(0, 0, -o.az - 0.02, o.fx * 1.15, o.h * 4, o.az * 0.38);
  const bean: SDF = (x, y, z) => smax(solidBody(x, y, z), -notch(x, y, z), 0.08);
  const parts: SDF[] = [
    bean,
    ring(0, 0, cz, o.fx, o.fz, o.tube, o.ky),
    mirrorX((s) => roundCone(s * o.pedicle, 0, -o.az * 0.7, s * (o.fx + o.tube * 0.2), 0, cz + o.fz * 0.3, o.tube * 1.15, o.tube * 1.05)),
    mirrorX((s) =>
      roundCone(s * (o.fx + o.tube * 0.4), 0.01, cz - 0.0, s * (o.fx + o.transverse.len), o.transverse.up, cz - o.transverse.back, o.transverse.r1, o.transverse.r2),
    ),
    mirrorX((s) => ellipsoid(s * o.articular.x, o.articular.up, cz - o.articular.back, o.articular.rx, o.articular.ry, o.articular.rz)),
  ];
  const sp = o.spinous;
  const rootZ = backZ + o.tube * 1.4;
  const wide = sp.wide ?? 0.03;
  parts.push(roundCone(0, wide, rootZ, 0, wide - sp.drop, rootZ - sp.len, sp.r1, sp.r2));
  parts.push(roundCone(0, -wide, rootZ, 0, -wide - sp.drop, rootZ - sp.len, sp.r1, sp.r2));
  return union(0.09, ...parts);
};

export const bones: Record<BoneKind, BoneSpec> = {
  cervical: {
    ax: 0.3, az: 0.24, h: 0.17,
    sdf: vertebra({
      ax: 0.3, az: 0.24, h: 0.17, r: 0.07, waist: 0.1,
      fx: 0.16, fz: 0.14, tube: 0.06, ky: 0.55,
      pedicle: 0.21,
      spinous: { len: 0.24, drop: 0.05, r1: 0.06, r2: 0.04, wide: 0.03 },
      transverse: { len: 0.3, back: -0.05, up: -0.03, r1: 0.07, r2: 0.05 },
      articular: { x: 0.19, up: 0.0, back: 0.04, rx: 0.065, ry: 0.15, rz: 0.09 },
    }),
    min: [-0.75, -0.42, -0.95], max: [0.75, 0.42, 0.45],
  },
  axis: {
    ax: 0.3, az: 0.24, h: 0.17,
    sdf: (() => {
      const base = vertebra({
        ax: 0.3, az: 0.24, h: 0.17, r: 0.07, waist: 0.1,
        fx: 0.16, fz: 0.14, tube: 0.065, ky: 0.55,
        pedicle: 0.21,
        spinous: { len: 0.36, drop: 0.07, r1: 0.085, r2: 0.05, wide: 0.04 },
        transverse: { len: 0.2, back: -0.03, up: -0.05, r1: 0.055, r2: 0.04 },
        articular: { x: 0.2, up: 0.1, back: 0.02, rx: 0.1, ry: 0.04, rz: 0.12 },
      });
      const dens = roundCone(0, 0.1, 0.0, 0, 0.5, 0.02, 0.135, 0.105);
      return (x, y, z) => smin(base(x, y, z), dens(x, y, z), 0.05);
    })(),
    min: [-0.75, -0.42, -1.05], max: [0.75, 0.75, 0.45],
  },
  atlas: {
    ax: 0.3, az: 0.24, h: 0.13,
    sdf: (() => {
      const r = ring(0, 0, 0, 0.4, 0.37, 0.085, 0.7);
      const masses = mirrorX((s) => ellipsoid(s * 0.38, 0, 0.02, 0.15, 0.1, 0.2));
      const front = ellipsoid(0, 0, 0.37, 0.12, 0.085, 0.085);
      const back = ellipsoid(0, 0.01, -0.4, 0.075, 0.09, 0.08);
      const wings = mirrorX((s) => roundCone(s * 0.42, 0, -0.02, s * 0.88, -0.02, -0.08, 0.095, 0.065));
      return union(0.06, r, masses, front, back, wings);
    })(),
    min: [-1.15, -0.3, -0.7], max: [1.15, 0.3, 0.7],
  },
  thoracicUpper: {
    ax: 0.38, az: 0.32, h: 0.22,
    sdf: vertebra({
      ax: 0.38, az: 0.31, h: 0.21, r: 0.09, waist: 0.1,
      fx: 0.2, fz: 0.17, tube: 0.075, ky: 0.55,
      pedicle: 0.27,
      spinous: { len: 0.6, drop: 0.3, r1: 0.085, r2: 0.045, wide: 0.04 },
      transverse: { len: 0.4, back: 0.14, up: 0.04, r1: 0.1, r2: 0.078 },
      articular: { x: 0.17, up: 0.17, back: 0.06, rx: 0.075, ry: 0.05, rz: 0.1 },
    }),
    min: [-0.95, -0.7, -1.4], max: [0.95, 0.45, 0.45],
  },
  thoracicLower: {
    ax: 0.44, az: 0.36, h: 0.25,
    sdf: vertebra({
      ax: 0.44, az: 0.36, h: 0.25, r: 0.1, waist: 0.09,
      fx: 0.23, fz: 0.19, tube: 0.085, ky: 0.55,
      pedicle: 0.31,
      spinous: { len: 0.5, drop: 0.14, r1: 0.1, r2: 0.065, wide: 0.06 },
      transverse: { len: 0.36, back: 0.1, up: 0.03, r1: 0.105, r2: 0.08 },
      articular: { x: 0.2, up: 0.2, back: 0.05, rx: 0.08, ry: 0.06, rz: 0.105 },
    }),
    min: [-1.0, -0.6, -1.45], max: [1.0, 0.5, 0.5],
  },
  lumbar: {
    ax: 0.6, az: 0.45, h: 0.3,
    sdf: vertebra({
      ax: 0.6, az: 0.45, h: 0.3, r: 0.12, waist: 0.07,
      fx: 0.29, fz: 0.23, tube: 0.1, ky: 0.55,
      pedicle: 0.42,
      spinous: { len: 0.4, drop: 0.02, r1: 0.12, r2: 0.1, wide: 0.1 },
      transverse: { len: 0.5, back: 0.03, up: 0.0, r1: 0.115, r2: 0.08 },
      articular: { x: 0.28, up: 0.26, back: 0.02, rx: 0.09, ry: 0.07, rz: 0.12 },
    }),
    min: [-1.25, -0.6, -1.5], max: [1.25, 0.6, 0.62],
  },
  sacrum: {
    ax: 0.62, az: 0.42, h: 0.22,
    sdf: (() => {
      const top = body(0.62, 0.42, 0.22, 0.12, 0.0);
      const taper = roundCone(0, 0.0, -0.02, 0, -0.95, -0.34, 0.5, 0.2);
      const tip = roundCone(0, -0.9, -0.32, 0, -1.45, -0.18, 0.2, 0.08);
      const wings = mirrorX((s) => ellipsoid(s * 0.62, 0.02, -0.16, 0.36, 0.2, 0.46));
      const crest = roundCone(0, 0.12, -0.5, 0, -0.95, -0.7, 0.1, 0.06);
      return union(0.12, top, taper, tip, wings, crest);
    })(),
    min: [-1.15, -1.65, -1.0], max: [1.15, 0.5, 0.55],
  },
};

export function buildBone(kind: BoneKind, cell: number): MeshData {
  const spec = bones[kind];
  return meshFromSDF(spec.sdf, spec.min, spec.max, cell);
}
