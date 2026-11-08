/**
 * The opening still life: a loose, hand-tied bunch that opens petal by petal as the page scrolls,
 * with soft blooms out of focus behind and in front of it.
 */
import { Vector3 } from 'three';
import { createGarden, type Cam } from './garden';
import { makeBloom, makeEucalyptus, makeVine, PALETTES, type Bloom, type BloomSpec, type FlowerKind, type Palette } from './flora';

const V = (x: number, y: number, z: number) => new Vector3(x, y, z);

type Placed = { layer: 'far' | 'mid' | 'near'; bloom: Bloom; delay: number; rest: number };

export type Hero = {
  /** 0 to 1 through the opening section. */
  setProgress: (p: number) => void;
  /** 0 to 1, the first unfurl on arrival. */
  intro: { value: number };
  parallax: { x: number; y: number };
  invalidate: () => void;
};

const flower = (kind: FlowerKind, palette: Palette, head: Vector3, face: Vector3, size: number, extra: Partial<BloomSpec> = {}): BloomSpec => ({
  kind,
  palette,
  base: V(0.25, -6.2, 0.6),
  head,
  face,
  size,
  ...extra,
});

export function createHero(canvas: HTMLCanvasElement, options: { low: boolean; still: boolean }): Hero | null {
  const { low, still } = options;
  const placed: Placed[] = [];
  let progress = 0;
  let shown = 0;
  const intro = { value: still ? 1 : 0 };
  const target = { x: 0, y: 0 };

  const keys: Record<'wide' | 'tall', Cam[]> = {
    wide: [
      { az: 3, el: 12, dist: 10.0, tx: 0.3, ty: 0.6, tz: 0, ox: 0.2, oy: 0.0 },
      { az: -8, el: 17, dist: 9.0, tx: 0.35, ty: 0.6, tz: 0, ox: 0.21, oy: 0 },
      { az: -15, el: 23, dist: 8.3, tx: 0.4, ty: 0.65, tz: 0, ox: 0.22, oy: 0 },
    ],
    tall: [
      { az: 3, el: 12, dist: 10.2, tx: 0.35, ty: 0.3, tz: 0, ox: 0, oy: 0.245 },
      { az: -8, el: 17, dist: 9.4, tx: 0.35, ty: 0.4, tz: 0, ox: 0, oy: 0.17 },
      { az: -15, el: 23, dist: 8.8, tx: 0.4, ty: 0.55, tz: 0, ox: 0, oy: 0.13 },
    ],
  };
  let aspect = 1.6;
  let nearRose: Bloom | null = null;

  const garden = createGarden(canvas, {
    low,
    dof: true,
    fov: 28,
    fit: (a) => {
      aspect = a;
      return a < 0.95 ? Math.min(Math.max(0.92 / a, 1), 2.3) : 1;
    },
    onFrame: (time) => {
      shown += (progress - shown) * (still ? 1 : 0.08);
      const p = shown;
      const set = aspect < 0.95 ? keys.tall : keys.wide;
      const seg = p < 0.5 ? 0 : 1;
      const f = smooth(seg === 0 ? p / 0.5 : (p - 0.5) / 0.5);
      const a = set[seg];
      const b = set[seg + 1];
      const c = garden!.cam;
      (Object.keys(a) as Array<keyof Cam>).forEach((k) => (c[k] = a[k] + (b[k] - a[k]) * f));
      garden!.parallax.x += (target.x - garden!.parallax.x) * 0.04;
      garden!.parallax.y += (target.y - garden!.parallax.y) * 0.04;
      garden!.blur.far = 2.6 + p * 1.6;
      garden!.blur.near = 6.5;
      // on a tall screen the close-up bloom would sit over the words
      if (nearRose) nearRose.group.visible = aspect >= 0.95;

      placed.forEach((item, i) => {
        const b = item.bloom;
        const arrive = clamp((intro.value * 3.2 - item.delay) / 1.6);
        const first = item.rest * ease(arrive);
        const scrolled = smooth(clamp((p - item.delay * 0.08) / 0.55));
        b.open = still ? 0.9 : Math.max(first, item.rest + (1 - item.rest) * scrolled);
        b.update(time + i * 0.37);
      });
    },
  });
  if (!garden) return null;

  const add = (layer: Placed['layer'], bloom: Bloom, delay: number, rest = 0.5, fog = 0) => {
    bloom.uniforms.uFog.value = fog;
    garden.add(layer, bloom.group);
    placed.push({ layer, bloom, delay, rest });
    return bloom;
  };

  // The sharp middle plane: the bouquet itself.
  // [spec, when it arrives, how open it rests before any scrolling]
  const mid: Array<[BloomSpec, number, number]> = [
    // the focal rose, and the mass around it
    [flower('rose', PALETTES.roseApricot, V(0.15, 0.1, 0.65), V(0.0, 0.5, 1), 0.98, { hi: true }), 0, 0.58],
    [flower('rose', PALETTES.roseBlush, V(1.42, 0.78, 0.05), V(0.65, 0.62, 0.55), 0.84, { variant: 1, hi: true }), 0.25, 0.55],
    [flower('ranunculus', PALETTES.ranCoral, V(-0.95, -0.55, 0.75), V(-0.5, 0.22, 1), 0.62), 0.15, 0.6],
    [flower('marigold', PALETTES.marigold, V(1.3, -0.72, 0.72), V(0.45, 0.08, 1), 0.66), 0.35, 0.62],
    [flower('ranunculus', PALETTES.ranButter, V(-0.5, 1.0, 0.05), V(-0.35, 0.85, 0.5), 0.56, { variant: 1 }), 0.5, 0.55],
    [flower('anemone', PALETTES.anemoneWhite, V(0.5, 1.62, -0.45), V(0.1, 0.72, 0.7), 0.6), 0.45, 0.8],
    [flower('rose', PALETTES.roseMauve, V(-1.6, 0.4, -0.2), V(-0.92, 0.38, 0.32), 0.66, { variant: 1 }), 0.6, 0.5],
    [flower('ranunculus', PALETTES.ranTerracotta, V(0.45, -1.38, 0.9), V(0.15, -0.15, 1), 0.55), 0.3, 0.6],
    [flower('marigold', PALETTES.marigoldGold, V(2.25, 0.02, -0.25), V(0.85, 0.22, 0.55), 0.54, { variant: 1 }), 0.65, 0.6],
    [flower('anemone', PALETTES.anemoneWine, V(-1.3, -1.42, 0.45), V(-0.6, -0.05, 0.85), 0.5, { variant: 1 }), 0.55, 0.8],
    // buds that wait for the scroll
    [flower('rose', PALETTES.roseBlush, V(1.85, 1.95, -0.6), V(0.4, 0.9, 0.2), 0.4, { variant: 1 }), 1.2, 0.06],
    [flower('ranunculus', PALETTES.ranCoral, V(-1.05, 1.9, -0.55), V(-0.3, 0.95, 0.25), 0.36, { variant: 1 }), 1.4, 0.08],
    // airy cosmos on long stems
    [flower('cosmos', PALETTES.cosmosWhite, V(-1.4, 2.2, -0.6), V(-0.45, 0.6, 0.7), 0.55, { bend: V(-0.5, 0, 0) }), 0.8, 0.82],
    [flower('cosmos', PALETTES.cosmosChoc, V(2.55, 1.9, -0.8), V(0.6, 0.45, 0.7), 0.46, { bend: V(0.5, 0, 0), variant: 1 }), 0.9, 0.82],
  ];
  mid.forEach(([spec, delay, rest]) => add('mid', makeBloom(spec, low), delay, rest));
  add('mid', makeEucalyptus({ base: V(0.25, -6.2, 0.6), tip: V(-2.75, -1.25, 0.2), bend: V(-0.6, 0.4, 0), size: 1.15 }, low), 0, 1);
  add('mid', makeEucalyptus({ base: V(0.25, -6.2, 0.6), tip: V(3.05, 0.9, -0.55), bend: V(0.7, 0.2, 0), size: 1.0, pairs: 6 }, low), 0, 1);
  add('mid', makeEucalyptus({ base: V(0.25, -6.2, 0.2), tip: V(-0.4, 2.9, -1.1), bend: V(-0.3, 0, 0), size: 0.9, pairs: 6 }, low), 0, 1);
  // dark garden leaves behind the heads, so the bunch reads as one mass
  const B = V(0.25, -6.2, 0.2);
  add('mid', makeEucalyptus({ base: B, tip: V(1.2, 2.1, -1.2), bend: V(0.3, 0, 0), size: 1.2, pairs: 7, look: 'foliage' }, low), 0, 1);
  add('mid', makeEucalyptus({ base: B, tip: V(-1.9, 1.3, -1.0), bend: V(-0.4, 0, 0), size: 1.15, pairs: 7, look: 'foliage' }, low), 0, 1);
  add('mid', makeEucalyptus({ base: B, tip: V(2.6, -0.9, -0.6), bend: V(0.4, 0, 0), size: 1.05, pairs: 6, look: 'foliage' }, low), 0, 1);
  add('mid', makeEucalyptus({ base: B, tip: V(-1.4, -2.2, 0.3), bend: V(-0.3, 0, 0), size: 1.0, pairs: 5, look: 'foliage' }, low), 0, 1);
  const vine = makeVine(
    { base: V(0.25, -6.2, 0.6), points: [V(0.9, -2.4, 0.85), V(1.75, -1.25, 1.0), V(2.55, -1.5, 1.05), V(2.95, -2.5, 1.0), V(3.05, -3.6, 0.85)], size: 1, flowers: 4 },
    low,
  );
  add('mid', vine.bloom, 0, 1);
  vine.flowers.forEach((f, i) => placed.push({ layer: 'mid', bloom: f, delay: 0.5 + i * 0.2, rest: 0.6 }));

  // Soft, out-of-focus blooms behind...
  const fog = 0.42;
  add('far', makeBloom(flower('marigold', PALETTES.marigold, V(-2.1, 2.2, -4.6), V(-0.2, 0.5, 1), 1.25), low), 0.3, 0.8, fog);
  add('far', makeBloom(flower('rose', PALETTES.roseBlush, V(3.7, 1.7, -4.2), V(0.4, 0.4, 1), 1.4, { variant: 1 }), low), 0.2, 0.75, fog);
  add('far', makeBloom(flower('ranunculus', PALETTES.ranBlush, V(1.0, 3.3, -5.6), V(0.1, 0.6, 1), 1.25), low), 0.4, 0.7, fog);
  add('far', makeBloom(flower('ranunculus', PALETTES.ranCoral, V(4.6, -1.0, -3.6), V(0.5, 0.3, 1), 1.1, { variant: 1 }), low), 0.5, 0.7, fog);
  add('far', makeEucalyptus({ base: V(0, -6.2, -3.5), tip: V(-1.8, 2.0, -4.2), bend: V(-0.4, 0, 0), size: 1.6 }, low), 0, 1, fog);

  // ...and one so close it is only a blush of colour.
  nearRose = add('near', makeBloom(flower('rose', PALETTES.roseCream, V(2.35, -2.35, 4.3), V(0.1, 0.3, 1), 0.95, { base: V(2.5, -7, 4.5) }), low), 0.1, 0.85);

  return {
    setProgress: (p) => {
      progress = p;
      if (still) garden.stage.loop.invalidate();
    },
    intro,
    parallax: target,
    invalidate: () => garden.stage.loop.invalidate(),
  };
}

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (t: number) => t * t * (3 - 2 * t);
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
