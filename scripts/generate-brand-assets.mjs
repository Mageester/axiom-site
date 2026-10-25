// Regenerates favicons and app icons from the vector mark in src/lib/brand.ts.
// Run with: node scripts/generate-brand-assets.mjs
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const MARK_PATHS = ['M39.5 86 14 108 0 189 33 168Z', 'M52.5 30 84 0 85 141 44 165Z', 'M94.5 3 105 12 144 148 94.5 90Z'];
const NIGHT = '#0a1122';
const ACCENT = '#9db5ff';

// Mark centred on a rounded navy tile; the middle blade carries the accent.
const tile = (size, radius) => {
  const inner = size * 0.6;
  const scale = inner / 189;
  const x = (size - 145 * scale) / 2;
  const y = (size - 189 * scale) / 2;
  const paths = MARK_PATHS.map((d, i) => `<path d="${d}" fill="${i === 1 ? ACCENT : '#ffffff'}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${NIGHT}"/>` +
    `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)})">${paths}</g></svg>`;
};

writeFileSync('public/favicon.svg', tile(64, 14) + '\n');

const outputs = [
  ['public/favicon-32x32.png', 32, 7],
  ['public/favicon-48x48.png', 48, 10],
  ['public/favicon.png', 48, 10],
  ['public/apple-touch-icon.png', 180, 0],
  ['public/icon-192.png', 192, 40],
  ['public/icon-512.png', 512, 104],
];

for (const [file, size, radius] of outputs) {
  await sharp(Buffer.from(tile(size, radius))).png({ compressionLevel: 9 }).toFile(file);
}

console.log(`Wrote favicon.svg and ${outputs.length} PNG icons.`);
