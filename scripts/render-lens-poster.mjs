// Renders the home page's liquid lens in headless Chromium and saves it as the
// static poster (public/images/lens-poster-{450,720,900}.{webp,avif}). The poster is
// the LCP image and the fallback for no-WebGL and reduced motion.
// Usage: node scripts/render-lens-poster.mjs [devServerUrl]
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import sharp from 'sharp';

const base = process.argv[2] || 'http://127.0.0.1:4321';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(`${base}/?lens-poster`, { waitUntil: 'networkidle' });
await page.waitForSelector('.lens-canvas.is-ready', { timeout: 60_000 });
await page.waitForTimeout(1800);

const { dataUrl, crop } = await page.evaluate(() => {
  const canvas = document.querySelector('.lens-canvas');
  const scale = canvas.width / window.innerWidth;
  // The poster box is the lens anchor in the hero: its rect is exactly the poster crop.
  const r = document.getElementById('lens-poster').getBoundingClientRect();
  return {
    dataUrl: canvas.toDataURL('image/png'),
    crop: {
      left: Math.round(r.left * scale),
      top: Math.round(r.top * scale),
      width: Math.round(r.width * scale),
      height: Math.round(r.width * scale),
    },
  };
});
await browser.close();

const png = Buffer.from(dataUrl.split(',')[1], 'base64');
mkdirSync('public/images', { recursive: true });
for (const size of [450, 720, 900]) {
  const image = sharp(png).extract(crop).resize(size, size);
  writeFileSync(`public/images/lens-poster-${size}.webp`, await image.clone().webp({ quality: 74, alphaQuality: 85 }).toBuffer());
  writeFileSync(`public/images/lens-poster-${size}.avif`, await image.clone().avif({ quality: 52 }).toBuffer());
  console.log(`wrote lens-poster-${size}`);
}
