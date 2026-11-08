/**
 * A sheet of silk as a grid of particles, solved with position-based Verlet.
 *
 * Three kinds of distance constraint hold it together: structural (neighbours), shear
 * (diagonals) and a soft bend (every second particle), which is what lets it drape in
 * fine folds instead of crumpling. Long-range attachments to each pin stop the sheet
 * stretching under its own weight without needing dozens of solver passes.
 *
 * Everything lives in flat typed arrays that the renderer reads directly: positions,
 * normals, a tangent running down the warp, and a fold value (positive in the valleys,
 * negative on the crests) that the shader uses for soft shadowing.
 */
export type ClothOptions = {
  nx: number;
  ny: number;
  width: number;
  height: number;
  /** Columns of the top row to pin, by index. */
  pinCols: number[];
  shear?: number;
  bend?: number;
};

export class Cloth {
  readonly nx: number;
  readonly ny: number;
  readonly n: number;
  readonly width: number;
  readonly height: number;
  /** Rest spacing between neighbours. */
  readonly h: number;

  readonly pos: Float32Array;
  readonly prev: Float32Array;
  /** External acceleration for the next step, filled by the caller. */
  readonly acc: Float32Array;
  readonly inv: Float32Array;

  readonly normal: Float32Array;
  readonly tangent: Float32Array;
  readonly fold: Float32Array;
  readonly uv: Float32Array;
  readonly index: Uint16Array | Uint32Array;

  readonly pins: { index: number; x: number; y: number; z: number }[];

  private readonly ca: Int32Array;
  private readonly cb: Int32Array;
  private readonly cl: Float32Array;
  private readonly ck: Float32Array;
  private readonly lra: Float32Array;
  private readonly foldTmp: Float32Array;

  constructor(options: ClothOptions) {
    const { nx, ny, width, height } = options;
    this.nx = nx;
    this.ny = ny;
    this.n = nx * ny;
    this.width = width;
    this.height = height;
    this.h = width / (nx - 1);
    const n = this.n;

    this.pos = new Float32Array(n * 3);
    this.prev = new Float32Array(n * 3);
    this.acc = new Float32Array(n * 3);
    this.inv = new Float32Array(n).fill(1);
    this.normal = new Float32Array(n * 3);
    this.tangent = new Float32Array(n * 3);
    this.fold = new Float32Array(n);
    this.foldTmp = new Float32Array(n);
    this.uv = new Float32Array(n * 2);

    const hy = height / (ny - 1);
    for (let r = 0; r < ny; r++) {
      for (let c = 0; c < nx; c++) {
        const i = r * nx + c;
        this.pos[i * 3] = (c / (nx - 1) - 0.5) * width;
        this.pos[i * 3 + 1] = -r * hy;
        this.pos[i * 3 + 2] = 0;
        this.uv[i * 2] = c / (nx - 1);
        this.uv[i * 2 + 1] = 1 - r / (ny - 1);
      }
    }
    this.prev.set(this.pos);

    // constraints
    const a: number[] = [];
    const b: number[] = [];
    const l: number[] = [];
    const k: number[] = [];
    const shear = options.shear ?? 0.5;
    const bend = options.bend ?? 0.22;
    const add = (i: number, j: number, stiffness: number) => {
      a.push(i);
      b.push(j);
      const dx = this.pos[j * 3] - this.pos[i * 3];
      const dy = this.pos[j * 3 + 1] - this.pos[i * 3 + 1];
      l.push(Math.hypot(dx, dy));
      k.push(stiffness);
    };
    for (let r = 0; r < ny; r++) {
      for (let c = 0; c < nx; c++) {
        const i = r * nx + c;
        if (c < nx - 1) add(i, i + 1, 1);
        if (r < ny - 1) add(i, i + nx, 1);
        if (c < nx - 1 && r < ny - 1) {
          add(i, i + nx + 1, shear);
          add(i + 1, i + nx, shear);
        }
        if (c < nx - 2) add(i, i + 2, bend);
        if (r < ny - 2) add(i, i + 2 * nx, bend);
        if (c < nx - 2 && r < ny - 2) {
          add(i, i + 2 * nx + 2, bend * 0.7);
          add(i + 2, i + 2 * nx, bend * 0.7);
        }
      }
    }
    this.ca = Int32Array.from(a);
    this.cb = Int32Array.from(b);
    this.cl = Float32Array.from(l);
    this.ck = Float32Array.from(k);

    // pins, and the furthest each particle may sit from each pin (its distance across the flat sheet)
    this.pins = options.pinCols.map((col) => ({ index: col, x: this.pos[col * 3], y: this.pos[col * 3 + 1], z: 0 }));
    for (const pin of this.pins) this.inv[pin.index] = 0;
    this.lra = new Float32Array(this.pins.length * n);
    this.pins.forEach((pin, p) => {
      for (let i = 0; i < n; i++) {
        const dx = this.pos[i * 3] - pin.x;
        const dy = this.pos[i * 3 + 1] - pin.y;
        this.lra[p * n + i] = Math.hypot(dx, dy);
      }
    });

    // two triangles per quad, wound to face +z, with the diagonal alternating so folds
    // that run across the grid do not pick up a sawtooth
    const quads = (nx - 1) * (ny - 1);
    this.index = n > 65535 ? new Uint32Array(quads * 6) : new Uint16Array(quads * 6);
    let o = 0;
    for (let r = 0; r < ny - 1; r++) {
      for (let c = 0; c < nx - 1; c++) {
        const i = r * nx + c;
        const tri = (a: number, b: number, d: number) => {
          this.index[o++] = a;
          this.index[o++] = b;
          this.index[o++] = d;
        };
        if ((r + c) % 2 === 0) {
          tri(i, i + nx, i + 1);
          tri(i + 1, i + nx, i + nx + 1);
        } else {
          tri(i, i + nx, i + nx + 1);
          tri(i, i + nx + 1, i + 1);
        }
      }
    }
  }

  /**
   * Lays the sheet between its pins with the slack taken up as soft vertical folds, so it
   * starts close to how it hangs instead of falling from flat.
   */
  drape(foldDepth = 1, seed = 0.7) {
    const { nx, ny, pos } = this;
    const left = this.pins[0];
    const right = this.pins[this.pins.length - 1];
    const span = Math.max(0.1, right.x - left.x);
    const ratio = Math.min(1, span / this.width);
    const slack = Math.max(0, 1 / ratio - 1);
    const hy = this.height / (ny - 1);
    for (let r = 0; r < ny; r++) {
      const v = r / (ny - 1);
      for (let c = 0; c < nx; c++) {
        const u = c / (nx - 1);
        const i = r * nx + c;
        const topY = left.y + (right.y - left.y) * u;
        // a soft swag across the top, deepest in the middle
        const sag = Math.sin(Math.PI * u) * span * 0.17 * Math.sqrt(slack * 4);
        // a soft belly forward, with one slow ripple to break the symmetry
        const wave = Math.sin(Math.PI * u) * 0.8 + Math.sin(u * Math.PI * 2 * 1.5 + seed) * 0.2;
        pos[i * 3] = left.x + span * u;
        pos[i * 3 + 1] = topY - sag * (1 - v * 0.35) - r * hy * 0.97;
        pos[i * 3 + 2] = wave * Math.sqrt(slack) * 0.55 * foldDepth * v;
      }
    }
    for (const pin of this.pins) {
      pos[pin.index * 3] = pin.x;
      pos[pin.index * 3 + 1] = pin.y;
      pos[pin.index * 3 + 2] = pin.z;
    }
    this.prev.set(pos);
  }

  setPin(p: number, x: number, y: number, z: number) {
    const pin = this.pins[p];
    pin.x = x;
    pin.y = y;
    pin.z = z;
  }

  private lastDt = 0;

  /**
   * One time-corrected Verlet step: integrate with `acc`, then satisfy the constraints.
   * Damping is given per second, so the sheet settles the same at any frame rate.
   */
  step(dt: number, iterations: number, dampingPerSecond: number) {
    const { pos, prev, acc, inv, n } = this;
    const d2 = dt * dt;
    const keep = Math.exp(-dampingPerSecond * dt) * (this.lastDt ? dt / this.lastDt : 1);
    this.lastDt = dt;
    for (let i = 0; i < n; i++) {
      if (inv[i] === 0) continue;
      const o = i * 3;
      const x = pos[o];
      const y = pos[o + 1];
      const z = pos[o + 2];
      pos[o] = x + (x - prev[o]) * keep + acc[o] * d2;
      pos[o + 1] = y + (y - prev[o + 1]) * keep + acc[o + 1] * d2;
      pos[o + 2] = z + (z - prev[o + 2]) * keep + acc[o + 2] * d2;
      prev[o] = x;
      prev[o + 1] = y;
      prev[o + 2] = z;
    }
    for (const pin of this.pins) {
      const o = pin.index * 3;
      pos[o] = pin.x;
      pos[o + 1] = pin.y;
      pos[o + 2] = pin.z;
    }

    const { ca, cb, cl, ck } = this;
    const m = ca.length;
    for (let it = 0; it < iterations; it++) {
      for (let c = 0; c < m; c++) {
        const i = ca[c];
        const j = cb[c];
        const wi = inv[i];
        const wj = inv[j];
        const w = wi + wj;
        if (w === 0) continue;
        const oi = i * 3;
        const oj = j * 3;
        const dx = pos[oj] - pos[oi];
        const dy = pos[oj + 1] - pos[oi + 1];
        const dz = pos[oj + 2] - pos[oi + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 1e-9) continue;
        const s = ((d - cl[c]) / (d * w)) * ck[c];
        pos[oi] += dx * s * wi;
        pos[oi + 1] += dy * s * wi;
        pos[oi + 2] += dz * s * wi;
        pos[oj] -= dx * s * wj;
        pos[oj + 1] -= dy * s * wj;
        pos[oj + 2] -= dz * s * wj;
      }
      this.tether();
    }
    this.fair(0.06);
  }

  /** A light fairing pass: irons out creases sharper than the grid can draw, like real silk's own stiffness. */
  private fair(k: number) {
    const { nx, ny, pos, inv } = this;
    for (let r = 1; r < ny - 1; r++) {
      for (let c = 1; c < nx - 1; c++) {
        const i = r * nx + c;
        if (inv[i] === 0) continue;
        const o = i * 3;
        const l = o - 3;
        const rr = o + 3;
        const u = o - nx * 3;
        const d = o + nx * 3;
        pos[o] += ((pos[l] + pos[rr] + pos[u] + pos[d]) * 0.25 - pos[o]) * k;
        pos[o + 1] += ((pos[l + 1] + pos[rr + 1] + pos[u + 1] + pos[d + 1]) * 0.25 - pos[o + 1]) * k;
        pos[o + 2] += ((pos[l + 2] + pos[rr + 2] + pos[u + 2] + pos[d + 2]) * 0.25 - pos[o + 2]) * k * 1.6;
      }
    }
  }

  /** Long-range attachments: no particle drifts further from a pin than the flat sheet allows. */
  private tether() {
    const { pos, inv, n, lra } = this;
    for (let p = 0; p < this.pins.length; p++) {
      const pin = this.pins[p];
      const base = p * n;
      for (let i = 0; i < n; i++) {
        if (inv[i] === 0) continue;
        const o = i * 3;
        const dx = pos[o] - pin.x;
        const dy = pos[o + 1] - pin.y;
        const dz = pos[o + 2] - pin.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        const max = lra[base + i] * 1.01;
        if (d2 > max * max) {
          const s = max / Math.sqrt(d2);
          pos[o] = pin.x + dx * s;
          pos[o + 1] = pin.y + dy * s;
          pos[o + 2] = pin.z + dz * s;
        }
      }
    }
  }

  /** Normals, the warp tangent and the fold value, for the renderer and for air forces. */
  computeShading() {
    const { nx, ny, pos, normal: N, tangent: T, fold, foldTmp } = this;
    N.fill(0);
    for (let r = 0; r < ny - 1; r++) {
      for (let c = 0; c < nx - 1; c++) {
        const a = r * nx + c;
        const b = a + 1;
        const cc = a + nx;
        const d = cc + 1;
        // quad normal from its diagonals: (c - b) x (d - a)
        const ux = pos[cc * 3] - pos[b * 3];
        const uy = pos[cc * 3 + 1] - pos[b * 3 + 1];
        const uz = pos[cc * 3 + 2] - pos[b * 3 + 2];
        const vx = pos[d * 3] - pos[a * 3];
        const vy = pos[d * 3 + 1] - pos[a * 3 + 1];
        const vz = pos[d * 3 + 2] - pos[a * 3 + 2];
        const qx = uy * vz - uz * vy;
        const qy = uz * vx - ux * vz;
        const qz = ux * vy - uy * vx;
        N[a * 3] += qx; N[a * 3 + 1] += qy; N[a * 3 + 2] += qz;
        N[b * 3] += qx; N[b * 3 + 1] += qy; N[b * 3 + 2] += qz;
        N[cc * 3] += qx; N[cc * 3 + 1] += qy; N[cc * 3 + 2] += qz;
        N[d * 3] += qx; N[d * 3 + 1] += qy; N[d * 3 + 2] += qz;
      }
    }
    const inv2h = 1 / this.h;
    for (let r = 0; r < ny; r++) {
      const up = r > 0 ? -nx : 0;
      const down = r < ny - 1 ? nx : 0;
      for (let c = 0; c < nx; c++) {
        const i = r * nx + c;
        const o = i * 3;
        const l = 1 / (Math.hypot(N[o], N[o + 1], N[o + 2]) || 1);
        const nX = (N[o] *= l);
        const nY = (N[o + 1] *= l);
        const nZ = (N[o + 2] *= l);

        const iu = i + up;
        const id = i + down;
        let tx = pos[id * 3] - pos[iu * 3];
        let ty = pos[id * 3 + 1] - pos[iu * 3 + 1];
        let tz = pos[id * 3 + 2] - pos[iu * 3 + 2];
        const tl = 1 / (Math.hypot(tx, ty, tz) || 1);
        tx *= tl; ty *= tl; tz *= tl;
        T[o] = tx; T[o + 1] = ty; T[o + 2] = tz;

        // how far the neighbours sit in front of this point, along its normal
        const il = c > 0 ? i - 1 : i + 1;
        const ir = c < nx - 1 ? i + 1 : i - 1;
        const ju = r > 0 ? i - nx : i + nx;
        const jd = r < ny - 1 ? i + nx : i - nx;
        const ax = (pos[il * 3] + pos[ir * 3] + pos[ju * 3] + pos[jd * 3]) * 0.25 - pos[o];
        const ay = (pos[il * 3 + 1] + pos[ir * 3 + 1] + pos[ju * 3 + 1] + pos[jd * 3 + 1]) * 0.25 - pos[o + 1];
        const az = (pos[il * 3 + 2] + pos[ir * 3 + 2] + pos[ju * 3 + 2] + pos[jd * 3 + 2]) * 0.25 - pos[o + 2];
        foldTmp[i] = (ax * nX + ay * nY + az * nZ) * inv2h;
      }
    }
    // two blur passes keep the fold shading soft
    const blur = (src: Float32Array, dst: Float32Array) => {
      for (let r = 0; r < ny; r++) {
        for (let c = 0; c < nx; c++) {
          const i = r * nx + c;
          const il = c > 0 ? i - 1 : i;
          const ir = c < nx - 1 ? i + 1 : i;
          const ju = r > 0 ? i - nx : i;
          const jd = r < ny - 1 ? i + nx : i;
          dst[i] = src[i] * 0.4 + (src[il] + src[ir] + src[ju] + src[jd]) * 0.15;
        }
      }
    };
    blur(foldTmp, fold);
    blur(fold, foldTmp);
    fold.set(foldTmp);
  }
}
