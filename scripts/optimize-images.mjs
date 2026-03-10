import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const fromRoot = (...segments) => path.join(rootDir, ...segments);

const photoJobs = [
  {
    input: fromRoot('public', 'images', 'work-aether.jpg'),
    baseName: fromRoot('public', 'images', 'work-aether'),
    widths: [640, 960, 1280],
    fallback: { path: fromRoot('public', 'images', 'work-aether.jpg'), width: 1280, quality: 76 },
  },
  {
    input: fromRoot('public', 'images', 'work-restaurant.jpg'),
    baseName: fromRoot('public', 'images', 'work-restaurant'),
    widths: [640, 960, 1280],
    fallback: { path: fromRoot('public', 'images', 'work-restaurant.jpg'), width: 1280, quality: 76 },
  },
  {
    input: fromRoot('public', 'images', 'case-study-1.jpg'),
    baseName: fromRoot('public', 'images', 'case-study-1'),
    widths: [640, 960, 1280],
    fallback: { path: fromRoot('public', 'images', 'case-study-1.jpg'), width: 1280, quality: 76 },
  },
  {
    input: fromRoot('public', 'images', 'case-study-2.jpg'),
    baseName: fromRoot('public', 'images', 'case-study-2'),
    widths: [640, 960, 1280],
    fallback: { path: fromRoot('public', 'images', 'case-study-2.jpg'), width: 1280, quality: 76 },
  },
  {
    input: fromRoot('public', 'images', 'case-study-3.jpg'),
    baseName: fromRoot('public', 'images', 'case-study-3'),
    widths: [480, 800, 1120],
    fallback: { path: fromRoot('public', 'images', 'case-study-3.jpg'), width: 1120, quality: 74 },
  },
  {
    input: fromRoot('public', 'images', 'case-study-4.jpg'),
    baseName: fromRoot('public', 'images', 'case-study-4'),
    widths: [480, 800, 1120],
    fallback: { path: fromRoot('public', 'images', 'case-study-4.jpg'), width: 1120, quality: 74 },
  },
  {
    input: fromRoot('public', 'images', 'hero-chip.jpg'),
    baseName: fromRoot('public', 'images', 'hero-chip'),
    widths: [640, 960, 1280],
    fallback: { path: fromRoot('public', 'images', 'hero-chip.jpg'), width: 1280, quality: 74 },
  },
  {
    input: fromRoot('public', 'images', 'avatar-daniel.jpg'),
    baseName: fromRoot('public', 'images', 'avatar-daniel'),
    widths: [320, 480, 768],
    fallback: { path: fromRoot('public', 'images', 'avatar-daniel.jpg'), width: 768, quality: 72 },
  },
  {
    input: fromRoot('public', 'images', 'avatar-sarah.jpg'),
    baseName: fromRoot('public', 'images', 'avatar-sarah'),
    widths: [320, 480, 768],
    fallback: { path: fromRoot('public', 'images', 'avatar-sarah.jpg'), width: 768, quality: 72 },
  },
  {
    input: fromRoot('public', 'images', 'avatar-jake.jpg'),
    baseName: fromRoot('public', 'images', 'avatar-jake'),
    widths: [320, 480, 768],
    fallback: { path: fromRoot('public', 'images', 'avatar-jake.jpg'), width: 768, quality: 72 },
  },
];

const transparentJobs = [
  {
    input: fromRoot('public', 'photos', 'logoclear.png'),
    baseName: fromRoot('public', 'photos', 'logoclear'),
    widths: [320, 512, 768],
    fallback: { path: fromRoot('public', 'photos', 'logoclear.png'), width: 768 },
  },
];

async function processPhotoJob(job) {
  const source = sharp(job.input);
  const metadata = await source.metadata();
  const maxWidth = metadata.width || 1280;
  const widths = job.widths.filter((width) => width <= maxWidth);
  const effectiveWidths = widths.length > 0 ? widths : [maxWidth];

  await Promise.all(
    effectiveWidths.flatMap((width) => [
      source
        .clone()
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 48, effort: 6, chromaSubsampling: '4:2:0' })
        .toFile(`${job.baseName}-${width}.avif`),
      source
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72, effort: 6, smartSubsample: true })
        .toFile(`${job.baseName}-${width}.webp`),
    ])
  );

  const tempFallbackPath = `${job.fallback.path}.tmp`;
  await source
    .clone()
    .resize({ width: job.fallback.width, withoutEnlargement: true })
    .jpeg({
      quality: job.fallback.quality,
      mozjpeg: true,
      progressive: true,
      optimizeScans: true,
      chromaSubsampling: '4:2:0',
    })
    .toFile(tempFallbackPath);
  await fs.rename(tempFallbackPath, job.fallback.path);
}

async function processTransparentJob(job) {
  const source = sharp(job.input);
  const metadata = await source.metadata();
  const maxWidth = metadata.width || 768;
  const widths = job.widths.filter((width) => width <= maxWidth);
  const effectiveWidths = widths.length > 0 ? widths : [maxWidth];

  await Promise.all(
    effectiveWidths.flatMap((width) => [
      source
        .clone()
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 56, effort: 6, chromaSubsampling: '4:4:4' })
        .toFile(`${job.baseName}-${width}.avif`),
      source
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6, alphaQuality: 90 })
        .toFile(`${job.baseName}-${width}.webp`),
    ])
  );

  const tempFallbackPath = `${job.fallback.path}.tmp`;
  await source
    .clone()
    .resize({ width: job.fallback.width, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10, palette: true, quality: 85 })
    .toFile(tempFallbackPath);
  await fs.rename(tempFallbackPath, job.fallback.path);
}

async function processFavicon() {
  const input = fromRoot('public', 'favicon.png');
  const sourceBuffer = await sharp(input).toBuffer();
  const source = sharp(sourceBuffer);

  const tempFaviconPath = fromRoot('public', 'favicon.png.tmp');
  await Promise.all([
    source
      .clone()
      .resize({ width: 32, height: 32, fit: 'cover' })
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toFile(fromRoot('public', 'favicon-32x32.png')),
    source
      .clone()
      .resize({ width: 48, height: 48, fit: 'cover' })
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toFile(fromRoot('public', 'favicon-48x48.png')),
    source
      .clone()
      .resize({ width: 180, height: 180, fit: 'cover' })
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toFile(fromRoot('public', 'apple-touch-icon.png')),
    source
      .clone()
      .resize({ width: 48, height: 48, fit: 'cover' })
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toFile(tempFaviconPath),
  ]);
  await fs.rename(tempFaviconPath, fromRoot('public', 'favicon.png'));
}

async function run() {
  await Promise.all(photoJobs.map(processPhotoJob));
  await Promise.all(transparentJobs.map(processTransparentJob));
  await processFavicon();
  console.log('Image optimization complete.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
