/**
 * Sculpting with distance fields. A bone is written as a small function that returns how
 * far a point is from its surface; `meshFromSDF` turns that into a smooth triangle mesh
 * (surface nets), with normals from the field's gradient and a baked occlusion term so
 * the creases between the processes and the body read as sculpted.
 */
export type SDF = (x: number, y: number, z: number) => number;

export const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

export const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

export const ellipsoid = (cx: number, cy: number, cz: number, rx: number, ry: number, rz: number): SDF => {
  return (x, y, z) => {
    const px = x - cx;
    const py = y - cy;
    const pz = z - cz;
    const k0 = Math.hypot(px / rx, py / ry, pz / rz);
    const k1 = Math.hypot(px / (rx * rx), py / (ry * ry), pz / (rz * rz));
    return k1 < 1e-9 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
  };
};

/** A tapered capsule from a to b with radius r1 at a and r2 at b. */
export const roundCone = (
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  r1: number, r2: number,
): SDF => {
  const bax = bx - ax;
  const bay = by - ay;
  const baz = bz - az;
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = r1 - r2;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  const sr = Math.sign(rr);
  return (x, y, z) => {
    const pax = x - ax;
    const pay = y - ay;
    const paz = z - az;
    const yy = pax * bax + pay * bay + paz * baz;
    const zz = yy - l2;
    const qx = pax * l2 - bax * yy;
    const qy = pay * l2 - bay * yy;
    const qz = paz * l2 - baz * yy;
    const x2 = qx * qx + qy * qy + qz * qz;
    const y2 = yy * yy * l2;
    const z2 = zz * zz * l2;
    const k = sr * rr * rr * x2;
    if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
    if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
    return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - r1;
  };
};

/** An elliptical ring lying in the xz plane, with a section a little taller than wide. */
export const ring = (cx: number, cy: number, cz: number, fx: number, fz: number, tube: number, ky = 1): SDF => {
  const m = Math.min(fx, fz);
  return (x, y, z) => {
    const q = (Math.hypot((x - cx) / fx, (z - cz) / fz) - 1) * m;
    return Math.hypot(q, (y - cy) * ky) - tube;
  };
};

/** A cylinder with an elliptical section, rounded edges and a slightly pinched waist. */
export const body = (ax: number, az: number, h: number, r: number, waist: number): SDF => {
  const m = Math.min(ax, az);
  return (x, y, z) => {
    const t = Math.max(-1, Math.min(1, y / h));
    const s = 1 - waist * (1 - t * t);
    const w = (Math.hypot(x / ax, z / az) / s - 1) * m * s + r;
    const v = Math.abs(y) - h + r;
    return Math.hypot(Math.max(w, 0), Math.max(v, 0)) + Math.min(Math.max(w, v), 0) - r;
  };
};

export const union = (k: number, ...fields: SDF[]): SDF => {
  return (x, y, z) => {
    let d = fields[0](x, y, z);
    for (let i = 1; i < fields.length; i++) d = smin(d, fields[i](x, y, z), k);
    return d;
  };
};

export const mirrorX = (make: (sign: number) => SDF): SDF => {
  const a = make(1);
  const b = make(-1);
  return (x, y, z) => Math.min(a(x, y, z), b(x, y, z));
};

export type MeshData = {
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
};

export function meshFromSDF(
  sdf: SDF,
  min: [number, number, number],
  max: [number, number, number],
  cell: number,
): MeshData {
  const block = 4;
  const round = (n: number) => Math.ceil(n / block) * block;
  const nx = round((max[0] - min[0]) / cell);
  const ny = round((max[1] - min[1]) / cell);
  const nz = round((max[2] - min[2]) / cell);
  const sx = nx + 1;
  const sy = ny + 1;
  const sz = nz + 1;
  const at = (i: number, j: number, k: number) => i + sx * (j + sy * k);
  const field = new Float32Array(sx * sy * sz);

  // Coarse pass: find the blocks the surface can pass through, so only those are sampled finely.
  const bx = nx / block;
  const by = ny / block;
  const bz = nz / block;
  const csx = bx + 1;
  const csy = by + 1;
  const coarse = new Float32Array(csx * csy * (bz + 1));
  const cstep = cell * block;
  for (let k = 0; k <= bz; k++) {
    for (let j = 0; j <= by; j++) {
      for (let i = 0; i <= bx; i++) {
        coarse[i + csx * (j + csy * k)] = sdf(min[0] + i * cstep, min[1] + j * cstep, min[2] + k * cstep);
      }
    }
  }
  const reach = cstep * 0.87 * 1.6;
  const active = new Uint8Array(bx * by * bz);
  for (let k = 0; k < bz; k++) {
    for (let j = 0; j < by; j++) {
      for (let i = 0; i < bx; i++) {
        let lo = Infinity;
        let sum = 0;
        for (let c = 0; c < 8; c++) {
          const v = coarse[i + (c & 1) + csx * (j + ((c >> 1) & 1) + csy * (k + (c >> 2)))];
          sum += v;
          lo = Math.min(lo, Math.abs(v));
        }
        const isActive = lo < reach;
        active[i + bx * (j + by * k)] = isActive ? 1 : 0;
        if (!isActive) {
          const mean = sum / 8;
          for (let c = 0; c < 125; c++) {
            const li = c % 5;
            const lj = Math.floor(c / 5) % 5;
            const lk = Math.floor(c / 25);
            field[at(i * block + li, j * block + lj, k * block + lk)] = mean;
          }
        }
      }
    }
  }
  for (let k = 0; k < bz; k++) {
    for (let j = 0; j < by; j++) {
      for (let i = 0; i < bx; i++) {
        if (!active[i + bx * (j + by * k)]) continue;
        for (let lk = 0; lk <= block; lk++) {
          for (let lj = 0; lj <= block; lj++) {
            for (let li = 0; li <= block; li++) {
              const gi = i * block + li;
              const gj = j * block + lj;
              const gk = k * block + lk;
              field[at(gi, gj, gk)] = sdf(min[0] + gi * cell, min[1] + gj * cell, min[2] + gk * cell);
            }
          }
        }
      }
    }
  }

  // Surface nets: one vertex per cell the surface crosses.
  const cellIndex = new Int32Array(nx * ny * nz).fill(-1);
  const positions: number[] = [];
  const corner = new Float32Array(8);
  const edges = [
    [0, 1], [2, 3], [4, 5], [6, 7],
    [0, 2], [1, 3], [4, 6], [5, 7],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        let mask = 0;
        for (let c = 0; c < 8; c++) {
          const v = field[at(i + (c & 1), j + ((c >> 1) & 1), k + (c >> 2))];
          corner[c] = v;
          if (v < 0) mask |= 1 << c;
        }
        if (mask === 0 || mask === 255) continue;
        let vx = 0;
        let vy = 0;
        let vz = 0;
        let count = 0;
        for (const [a, b] of edges) {
          const da = corner[a];
          const db = corner[b];
          if (da < 0 === db < 0) continue;
          const t = da / (da - db);
          vx += (a & 1) + t * ((b & 1) - (a & 1));
          vy += ((a >> 1) & 1) + t * (((b >> 1) & 1) - ((a >> 1) & 1));
          vz += (a >> 2) + t * ((b >> 2) - (a >> 2));
          count++;
        }
        cellIndex[i + nx * (j + ny * k)] = positions.length / 3;
        positions.push(
          min[0] + (i + vx / count) * cell,
          min[1] + (j + vy / count) * cell,
          min[2] + (k + vz / count) * cell,
        );
      }
    }
  }

  const indices: number[] = [];
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) indices.push(a, c, b, a, d, c);
    else indices.push(a, b, c, a, c, d);
  };
  const cellAt = (i: number, j: number, k: number) => cellIndex[i + nx * (j + ny * k)];
  for (let k = 1; k < nz; k++) {
    for (let j = 1; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = field[at(i, j, k)] < 0;
        if (a !== field[at(i + 1, j, k)] < 0) {
          quad(cellAt(i, j - 1, k - 1), cellAt(i, j, k - 1), cellAt(i, j, k), cellAt(i, j - 1, k), !a);
        }
      }
    }
  }
  for (let k = 1; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 1; i < nx; i++) {
        const a = field[at(i, j, k)] < 0;
        if (a !== field[at(i, j + 1, k)] < 0) {
          quad(cellAt(i - 1, j, k - 1), cellAt(i - 1, j, k), cellAt(i, j, k), cellAt(i, j, k - 1), !a);
        }
      }
    }
  }
  for (let k = 0; k < nz; k++) {
    for (let j = 1; j < ny; j++) {
      for (let i = 1; i < nx; i++) {
        const a = field[at(i, j, k)] < 0;
        if (a !== field[at(i, j, k + 1)] < 0) {
          quad(cellAt(i - 1, j - 1, k), cellAt(i, j - 1, k), cellAt(i, j, k), cellAt(i - 1, j, k), !a);
        }
      }
    }
  }

  // Settle each vertex onto the true surface, then read the normal and occlusion there.
  const count = positions.length / 3;
  const pos = new Float32Array(positions);
  const normals = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const e = cell * 0.6;
  for (let v = 0; v < count; v++) {
    let x = pos[v * 3];
    let y = pos[v * 3 + 1];
    let z = pos[v * 3 + 2];
    for (let pass = 0; pass < 2; pass++) {
      const d = sdf(x, y, z);
      const gx = sdf(x + e, y, z) - sdf(x - e, y, z);
      const gy = sdf(x, y + e, z) - sdf(x, y - e, z);
      const gz = sdf(x, y, z + e) - sdf(x, y, z - e);
      const gl = Math.hypot(gx, gy, gz) || 1;
      const step = Math.max(-cell, Math.min(cell, d)) * 0.8;
      x -= (gx / gl) * step;
      y -= (gy / gl) * step;
      z -= (gz / gl) * step;
    }
    const gx = sdf(x + e, y, z) - sdf(x - e, y, z);
    const gy = sdf(x, y + e, z) - sdf(x, y - e, z);
    const gz = sdf(x, y, z + e) - sdf(x, y, z - e);
    const gl = Math.hypot(gx, gy, gz) || 1;
    const nx_ = gx / gl;
    const ny_ = gy / gl;
    const nz_ = gz / gl;
    pos[v * 3] = x;
    pos[v * 3 + 1] = y;
    pos[v * 3 + 2] = z;
    normals[v * 3] = nx_;
    normals[v * 3 + 1] = ny_;
    normals[v * 3 + 2] = nz_;
    let occlusion = 0;
    let weight = 1;
    for (let s = 1; s <= 4; s++) {
      const h = 0.03 + s * 0.065;
      occlusion += (h - sdf(x + nx_ * h, y + ny_ * h, z + nz_ * h)) * weight;
      weight *= 0.62;
    }
    const ao = Math.max(0.42, Math.min(1, 1 - occlusion * 1.5));
    colors[v * 3] = colors[v * 3 + 1] = colors[v * 3 + 2] = ao;
  }

  return { positions: pos, normals, colors, indices: new Uint32Array(indices) };
}
