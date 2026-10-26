// Builds every logo and icon asset from the original Axiom artwork in brand/source/.
// Run with: node scripts/generate-brand-assets.mjs
//
// brand/source/axiom-logo-chrome.png  Original chrome lockup (mark + AXIOM wordmark).
// brand/source/axiom-mark-chrome.png  Original chrome mark on its own (higher resolution).
//
// Outputs:
//   public/brand/axiom-logo.webp   Lockup used by the site header and footer.
//   public/brand/axiom-mark.webp   Mark on its own, used as a watermark.
//   src/lib/logo.json              Lockup size plus the seam lines between the three blades
//                                  and the wordmark, used to animate each part separately.
//   public/*.png                   Favicons and app icons.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const NIGHT = '#0a1122';
const LOGO_SOURCE = 'brand/source/axiom-logo-chrome.png';
const MARK_SOURCE = 'brand/source/axiom-mark-chrome.png';
const LOGO_HEIGHT = 132; // Sharp at up to 44 CSS px tall on 3x screens.

// ── Seams ──────────────────────────────────────────────────────────────
// The blades touch in the artwork and are separated only by dark bevel
// seams, so each cut follows the darkest straight line through the mark.
const { data, info } = await sharp(LOGO_SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const weight = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) {
  const [r, g, b, a] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
  weight[i] = ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255);
}
const lineCost = (top, bottom) => {
  let sum = 0;
  for (let y = 0; y < H; y++) {
    const x = Math.round(top + ((bottom - top) * y) / (H - 1));
    if (x >= 0 && x < W) sum += weight[y * W + x];
  }
  return sum;
};
const darkestLine = (topRange, bottomRange) => {
  let best = { cost: Infinity, top: 0, bottom: 0 };
  for (let top = topRange[0]; top <= topRange[1]; top++) {
    for (let bottom = bottomRange[0]; bottom <= bottomRange[1]; bottom++) {
      const cost = lineCost(top, bottom);
      if (cost < best.cost) best = { cost, top, bottom };
    }
  }
  return best;
};

// The wordmark starts after the widest fully transparent column run past the mark.
const columnAlpha = Array.from({ length: W }, (_, x) => {
  let max = 0;
  for (let y = 0; y < H; y++) max = Math.max(max, data[(y * W + x) * 4 + 3]);
  return max;
});
let gap = { start: 0, end: 0 };
for (let x = 0, start = -1; x < W; x++) {
  if (columnAlpha[x] < 8 && start < 0) start = x;
  if ((columnAlpha[x] >= 8 || x === W - 1) && start >= 0) {
    if (x - start > gap.end - gap.start && start > W * 0.1) gap = { start, end: x };
    start = -1;
  }
}
const markWidth = gap.start;
const wordStart = Math.round((gap.start + gap.end) / 2);
const seam1 = darkestLine([Math.round(markWidth * 0.35), Math.round(markWidth * 0.75)], [0, Math.round(markWidth * 0.5)]);
const seam2 = darkestLine([Math.round(markWidth * 0.5), Math.round(markWidth * 0.8)], [Math.round(markWidth * 0.45), Math.round(markWidth * 0.9)]);

const pct = (x) => Number(((x / W) * 100).toFixed(3));
const width = Math.round((W / H) * LOGO_HEIGHT);
writeFileSync(
  'src/lib/logo.json',
  JSON.stringify(
    {
      src: '/brand/axiom-logo.webp',
      width,
      height: LOGO_HEIGHT,
      seams: {
        blade1: [pct(seam1.top), pct(seam1.bottom)],
        blade2: [pct(seam2.top), pct(seam2.bottom)],
        wordmark: pct(wordStart),
      },
    },
    null,
    2
  ) + '\n'
);

await sharp(LOGO_SOURCE)
  .resize({ height: LOGO_HEIGHT, kernel: 'lanczos3' })
  .webp({ quality: 88, alphaQuality: 100, effort: 6 })
  .toFile('public/brand/axiom-logo.webp');

await sharp(MARK_SOURCE).trim({ threshold: 1 }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile('public/brand/axiom-mark.webp');

// ── Icons ──────────────────────────────────────────────────────────────
// Chrome mark centred on a night tile, matching the original app icon.
const icon = async (file, size, radius, markScale = 0.66) => {
  const markHeight = Math.round(size * markScale);
  const mark = await sharp(MARK_SOURCE).trim({ threshold: 1 }).resize({ height: markHeight, kernel: 'lanczos3' }).toBuffer();
  const meta = await sharp(mark).metadata();
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${NIGHT}"/></svg>`
  );
  await sharp(tile)
    .composite([{ input: mark, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(file);
};

await icon('public/favicon-32x32.png', 32, 7, 0.74);
await icon('public/favicon-48x48.png', 48, 10, 0.72);
await icon('public/favicon.png', 48, 10, 0.72);
await icon('public/apple-touch-icon.png', 180, 0);
await icon('public/icon-192.png', 192, 40);
await icon('public/icon-512.png', 512, 104);

console.log(`Logo ${width}×${LOGO_HEIGHT}; seams`, { seam1, seam2, wordStart }, '; icons written.');
