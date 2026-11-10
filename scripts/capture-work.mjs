// Captures the preview image for each concept demo from the running page, in Chrome on the
// real GPU, so the previews on /work/ and the home page lens always show the real thing.
// Writes two WebP sizes per demo to public/images/work/. Needs a server already running.
//
// Usage: node scripts/capture-work.mjs [--base=http://localhost:4321] [--only=kelvin,vernis]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import sharp from 'sharp';

// Where on each page the preview looks best, and how long to let its effect develop.
const demos = {
  kelvin: { scroll: 0, wait: 7000 },
  'atlas-axis': { scroll: 0, wait: 5000 },
  vernis: { scroll: 0, wait: 5000 },
  'cinder-salt': { scroll: 0, wait: 6000 },
  'aldous-wren': { scroll: 0, wait: 9000 },
  'orrin-vale': { scroll: 0, wait: 4500 },
  tidewater: { scroll: 0, wait: 5000 },
  fernhill: { scroll: 0, wait: 3800 },
  mirrorline: { scroll: 0, wait: 7000 },
  'marigold-moss': { scroll: 0, wait: 6000 },
  // The everyday builds are ordinary pages, so there is nothing to wait for but fonts and images.
  fennmoor: { scroll: 0, wait: 2500 },
  'thorne-linden': { scroll: 0, wait: 2500 },
  millrace: { scroll: 0, wait: 2500 },
};

const option = (name, fallback) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const base = option('base', 'http://localhost:4321');
const only = option('only', Object.keys(demos).join(',')).split(',');
const out = 'public/images/work';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
});

for (const slug of only) {
  const { scroll, wait } = demos[slug];
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(`${base}/work/${slug}/`, { waitUntil: 'load' });
  await page.mouse.move(1100, 420);
  // The concept label belongs to the page, not the preview.
  await page.addStyleTag({ content: '.concept-pill, astro-dev-toolbar { display: none !important; }' });
  if (scroll) await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), scroll);
  await new Promise((resolve) => setTimeout(resolve, wait));
  const shot = await page.screenshot({ type: 'png' });
  await page.close();

  for (const [width, quality] of [[960, 76], [1600, 78]]) {
    const file = `${out}/${slug}-${width}.webp`;
    const info = await sharp(shot).resize({ width }).webp({ quality, effort: 6, smartSubsample: true }).toFile(file);
    console.log(`${file}: ${Math.round(info.size / 1024)}KB`);
  }
}

await browser.close();
