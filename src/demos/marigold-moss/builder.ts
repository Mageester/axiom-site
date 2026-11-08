/**
 * The bouquet builder's scene: a footed bowl, and stems that grow into it one at a time. Each
 * kind of stem has its own places in the arrangement, so whatever order people add them in,
 * the result looks arranged rather than piled up.
 */
import { Vector3 } from 'three';
import { createGarden } from './garden';
import { disposeGroup, makeBloom, makeCompote, makeEucalyptus, makeVine, PALETTES, type Bloom, type FlowerKind, type Palette } from './flora';

export type StemKind = 'rose' | 'ranunculus' | 'marigold' | 'cosmos' | 'anemone' | 'eucalyptus' | 'jasmine';

type Grown = {
  kind: StemKind;
  slot: number;
  parts: Bloom[];
  grow: number;
  open: number;
  rest: number;
  born: number;
  leaving: boolean;
};

const deg = Math.PI / 180;
const CENTRE = new Vector3(0, -0.22, 0);
const TOWARD_VIEWER = new Vector3(0, 0.35, 1).normalize();

// Places in the arrangement, as [azimuth, elevation] in degrees. Azimuth 0 faces the viewer.
const FOCAL: Array<[number, number]> = [
  [4, 26], [-44, 18], [46, 22], [-16, 52], [24, 48], [-80, 8], [84, 10], [-28, 0],
  [-58, 42], [62, 38], [34, 2], [-112, 24], [116, 26], [6, 70], [160, 46], [-150, 38],
];
const AIRY: Array<[number, number]> = [[-30, 58], [36, 62], [-64, 44], [68, 42], [4, 72], [-98, 36], [100, 38], [180, 64]];
const GREEN: Array<[number, number]> = [[-70, 22], [74, 26], [-118, 30], [120, 28], [-32, 34], [36, 30], [180, 38], [-160, 26]];
const TRAIL: Array<[number, number]> = [[-58, 0], [62, 0], [-20, 0], [24, 0], [-110, 0], [112, 0]];

const PALETTE_FOR: Record<string, Palette[]> = {
  rose: [PALETTES.roseApricot, PALETTES.roseBlush, PALETTES.roseMauve, PALETTES.roseCream],
  ranunculus: [PALETTES.ranCoral, PALETTES.ranButter, PALETTES.ranBlush, PALETTES.ranTerracotta],
  marigold: [PALETTES.marigold, PALETTES.marigoldGold],
  cosmos: [PALETTES.cosmosWhite, PALETTES.cosmosChoc, PALETTES.cosmosPink],
  anemone: [PALETTES.anemoneWhite, PALETTES.anemoneWine],
};

const SIZE: Record<string, number> = { rose: 0.44, ranunculus: 0.6, marigold: 0.58, anemone: 0.42, cosmos: 0.32 };

export type Builder = {
  add: (kind: StemKind) => void;
  undo: () => void;
  clear: () => void;
  /** Drag to turn the arrangement. */
  turn: (dx: number) => void;
};

export function createBuilder(canvas: HTMLCanvasElement, options: { low: boolean; still: boolean }): Builder | null {
  const { low, still } = options;
  const grown: Grown[] = [];
  const used: Record<string, number> = {};
  const view = { az: 0, target: 0, drift: 0 };
  let clock = 0;
  // Every bouquet starts on a low bed of greens; it grows in with the first stem.
  const bed: Bloom[] = [];
  let bedGrow = 0;

  const garden = createGarden(canvas, {
    low,
    dof: false,
    fov: 30,
    fit: (a) => (a < 1 ? Math.min(1 / a, 1.4) : 1),
    onFrame: (time, dt) => {
      clock = time;
      if (!still) view.drift = Math.sin(time * 0.18) * 9;
      view.az += (view.target - view.az) * (still ? 1 : 0.06);
      const c = garden!.cam;
      c.az = view.az + view.drift;
      c.el = 12;
      c.dist = 7.2;
      c.tx = 0;
      c.ty = 0.05;
      c.tz = 0;
      const want = grown.some((g) => !g.leaving) ? 1 : 0;
      bedGrow = still ? want : want > bedGrow ? Math.min(bedGrow + dt * 0.9, 1) : Math.max(bedGrow - dt * 1.6, 0);
      bed.forEach((b, k) => {
        b.grow = ease(clamp(bedGrow * 1.3 - k * 0.06));
        b.update(time + k);
      });
      for (let i = grown.length - 1; i >= 0; i--) {
        const g = grown[i];
        if (still) {
          g.grow = g.leaving ? 0 : 1;
          g.open = g.leaving ? 0 : g.rest;
        } else if (g.leaving) {
          g.grow = Math.max(g.grow - dt * 2.4, 0);
          g.open = Math.max(g.open - dt * 2.4, 0);
        } else {
          const age = time - g.born;
          g.grow = ease(clamp(age / 1.25));
          g.open = g.rest * ease(clamp((age - 1.0) / 2.2));
        }
        g.parts.forEach((p, k) => {
          p.grow = g.grow;
          p.open = k === 0 ? g.open : Math.min(g.open * 1.2, 0.85);
          p.update(time + i * 0.7);
        });
        if (g.leaving && g.grow <= 0.001) {
          g.parts.forEach((p) => {
            garden!.mid.remove(p.group);
            disposeGroup(p.group);
          });
          grown.splice(i, 1);
        }
      }
    },
  });
  if (!garden) return null;

  const bowl = makeCompote(low);
  bowl.scale.setScalar(0.82);
  bowl.position.y = -0.08;
  garden.add('mid', bowl);

  const take = (list: Array<[number, number]>, kind: string) => {
    const n = used[kind] ?? 0;
    used[kind] = n + 1;
    const [az, el] = list[n % list.length];
    const lap = Math.floor(n / list.length);
    return { az: (az + lap * 17) * deg, el: (el - lap * 6) * deg, slot: n };
  };

  const onDome = (az: number, el: number, r: number) =>
    new Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)).multiplyScalar(r).add(CENTRE);

  const stemBase = (az: number, spread = 0.42) => new Vector3(Math.sin(az) * spread * 0.5, -0.5, Math.cos(az) * spread * 0.32);

  ([[-104, 4], [-42, -4], [22, -8], [88, 2], [160, 16], [-160, 12]] as Array<[number, number]>).forEach(([az, el]) => {
    const a = az * deg;
    const spray = makeEucalyptus(
      { base: stemBase(a, 0.2), tip: onDome(a, el * deg, 1.22), bend: new Vector3(0, 0.25, 0), size: 0.66, pairs: 4, look: 'foliage', sway: 0.5 },
      low,
    );
    spray.grow = 0;
    bed.push(spray);
    garden.add('mid', spray.group);
  });

  function grow(kind: StemKind) {
    let parts: Bloom[] = [];
    let slot = 0;
    const jitter = () => (Math.random() - 0.5) * 0.12;
    if (kind === 'eucalyptus') {
      const s = take(GREEN, kind);
      slot = s.slot;
      const tip = onDome(s.az, s.el, 1.62 + jitter());
      parts = [makeEucalyptus({ base: stemBase(s.az), tip, bend: new Vector3(0, 0.45, 0), size: 0.9, pairs: 7 }, low)];
    } else if (kind === 'jasmine') {
      const s = take(TRAIL, kind);
      slot = s.slot;
      const side = Math.sin(s.az);
      const fwd = Math.cos(s.az);
      const rim = new Vector3(side * 0.95, -0.3, fwd * 0.75);
      const vine = makeVine(
        {
          base: stemBase(s.az, 0.3),
          points: [
            new Vector3(side * 0.6, 0.2, fwd * 0.5),
            rim,
            new Vector3(side * 1.45, -0.62, fwd * 1.05),
            new Vector3(side * 1.7, -1.25, fwd * 1.2),
            new Vector3(side * 1.75, -1.85 + jitter(), fwd * 1.15),
          ],
          size: 0.75,
          flowers: 3,
        },
        low,
      );
      parts = [vine.bloom, ...vine.flowers];
    } else {
      const airy = kind === 'cosmos';
      const s = take(airy ? AIRY : FOCAL, airy ? 'airy' : 'focal');
      slot = s.slot;
      const head = onDome(s.az, s.el, (airy ? 1.7 : 1.04) + jitter());
      const out = head.clone().sub(CENTRE).normalize();
      const face = out.lerp(TOWARD_VIEWER, airy ? 0.3 : 0.42).normalize();
      const palettes = PALETTE_FOR[kind];
      const count = grown.filter((g) => g.kind === kind).length;
      parts = [
        makeBloom(
          {
            kind: kind as FlowerKind,
            palette: palettes[count % palettes.length],
            base: stemBase(s.az),
            head,
            face,
            size: SIZE[kind] * (0.94 + Math.random() * 0.12),
            variant: count % 2,
            bend: out.clone().multiplyScalar(0.25),
            leaves: kind === 'rose' ? 2 : 1,
            hi: kind !== 'ranunculus' && kind !== 'marigold',
          },
          low,
        ),
      ];
    }
    parts.forEach((p) => {
      p.grow = still ? 1 : 0;
      p.open = 0;
      if (!garden!.mid.children.includes(p.group) && !p.group.parent) garden!.add('mid', p.group);
    });
    const rest = kind === 'cosmos' ? 0.95 : kind === 'anemone' ? 0.9 : kind === 'eucalyptus' || kind === 'jasmine' ? 1 : 0.68 + Math.random() * 0.1;
    grown.push({ kind, slot, parts, grow: 0, open: 0, rest, born: clock, leaving: false });
    garden!.stage.loop.invalidate();
  }

  return {
    add: (kind) => grow(kind),
    undo: () => {
      const last = [...grown].reverse().find((g) => !g.leaving);
      if (!last) return;
      last.leaving = true;
      const key = last.kind === 'cosmos' ? 'airy' : last.kind === 'eucalyptus' || last.kind === 'jasmine' ? last.kind : 'focal';
      used[key] = Math.max((used[key] ?? 1) - 1, 0);
      garden.stage.loop.invalidate();
    },
    clear: () => {
      grown.forEach((g) => (g.leaving = true));
      Object.keys(used).forEach((k) => (used[k] = 0));
      garden.stage.loop.invalidate();
    },
    turn: (dx) => {
      view.target = clamp(view.target + dx * 0.25, -70, 70);
      garden.stage.loop.invalidate();
    },
  };
}

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
