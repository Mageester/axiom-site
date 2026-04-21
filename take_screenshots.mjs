import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'pricing', path: '/pricing' },
  { name: 'privacy', path: '/privacy' },
  { name: 'process', path: '/process' },
  { name: 'start', path: '/start' },
  { name: 'start_a_project', path: '/start-a-project' },
  { name: 'terms', path: '/terms' },
  { name: 'work', path: '/work' },
  { name: '404', path: '/404' }
];

const screenshotsDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Start the Astro preview server
const server = spawn('npm', ['run', 'preview'], { shell: true });

let serverReady = false;
server.stdout.on('data', (data) => {
  if (data.toString().includes('Local')) {
    serverReady = true;
  }
});

// Helper to wait
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrollToLoadPage(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(240, Math.floor(window.innerHeight * 0.35));
    let lastHeight = 0;

    for (let i = 0; i < 60; i += 1) {
      const scrollHeight = document.documentElement.scrollHeight;
      const bottomReached = window.scrollY + window.innerHeight >= scrollHeight - 8;

      if (bottomReached) {
        break;
      }

      window.scrollBy({ top: step, left: 0, behavior: 'auto' });
      await sleep(180);

      const nextHeight = document.documentElement.scrollHeight;
      if (nextHeight === lastHeight && window.scrollY + window.innerHeight >= nextHeight - 8) {
        break;
      }

      lastHeight = nextHeight;
    }
  });

  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete), null, {
    timeout: 10000,
  }).catch(() => {});

  await page.evaluate(() => {
    document.querySelectorAll('details').forEach((detail) => {
      detail.open = true;
    });
  });

  await delay(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(250);
}

async function run() {
  console.log('Waiting for preview server to start...');
  for (let i = 0; i < 30; i++) {
    if (serverReady) break;
    await delay(1000);
  }

  if (!serverReady) {
    console.error('Server failed to start');
    server.kill();
    process.exit(1);
  }

  console.log('Server started. Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  for (const p of pages) {
    console.log(`Processing ${p.name}...`);
    const page = await context.newPage();
    
    // Some routes might not have trailing slash, but astro preview handles it
    await page.goto(`http://localhost:4321${p.path}`, { waitUntil: 'networkidle' });

    await scrollToLoadPage(page);

    await page.screenshot({
      path: path.join(screenshotsDir, `${p.name}.png`),
      fullPage: true,
      animations: 'disabled',
    });

    await page.close();
  }

  await browser.close();
  server.kill();
  console.log('All screenshots taken successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  server.kill();
  process.exit(1);
});
