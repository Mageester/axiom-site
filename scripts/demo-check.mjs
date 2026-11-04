// Drives a concept demo in Chrome on the real GPU and reports what a visitor would get:
// screenshots down the page on desktop and phone, frame rate while scrolling, console
// errors, sideways scroll, outside requests, and any text left invisible, including with
// reduced motion and without JavaScript. The dev server must already be running.
//
// Usage: node scripts/demo-check.mjs <slug> [--base=http://localhost:4321] [--stops=8]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith('--'));
const option = (name, fallback) => args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
if (!slug) {
  console.error('Usage: node scripts/demo-check.mjs <slug> [--base=http://localhost:4321] [--stops=8]');
  process.exit(1);
}
const base = option('base', 'http://localhost:4321');
const stops = Number(option('stops', 8));
const url = `${base}/work/${slug}/`;
const out = join('test-results', 'demos', slug);
mkdirSync(out, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
});

const listen = (page, origin, report) => {
  page.on('pageerror', (error) => report.errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('%cAstro')) report.errors.push(message.text());
  });
  page.on('request', (request) => {
    const target = new URL(request.url());
    if (/^https?:$/.test(target.protocol) && target.origin !== origin) report.outside.push(request.url());
  });
  page.on('requestfailed', (request) => {
    // Aborted just means the page moved on, such as closing while a request was open.
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') report.errors.push(`request failed: ${request.url()}`);
  });
};

// Text a visitor cannot see because something left it hidden.
const hiddenText = (page) =>
  page.evaluate(() => {
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent.trim();
      const el = walker.currentNode.parentElement;
      if (!text || !el || el.closest('script,style,noscript,.demo-skip,.visually-hidden,[hidden],[aria-hidden="true"],[data-check-skip]')) continue;
      let node = el;
      let hidden = false;
      while (node && node !== document.documentElement) {
        const style = getComputedStyle(node);
        if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) < 0.05) {
          hidden = true;
          break;
        }
        node = node.parentElement;
      }
      if (hidden) found.push(text.slice(0, 60));
    }
    return found;
  });

const walkPage = async (page, prefix, settle) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const files = [];
  for (let i = 0; i <= stops; i++) {
    const top = Math.round((height * i) / stops);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
    await sleep(settle);
    const file = join(out, `${prefix}-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: file });
    files.push(file);
  }
  return { height, files };
};

const report = { url, renderer: null, desktop: {}, phone: {}, reducedMotion: {}, noJavaScript: {} };

// Desktop
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const result = { errors: [], outside: [] };
  listen(page, new URL(base).origin, result);
  await page.goto(url, { waitUntil: 'load' });
  await page.mouse.move(720, 450);
  await sleep(3500);
  await page.screenshot({ path: join(out, 'desktop-first-screen.png') });
  report.renderer = await page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'no webgl2';
  });

  // Frame rate with a real wheel scrolling down the page.
  await page.evaluate(() => {
    window.__frames = [];
    let last = performance.now();
    const tick = (now) => {
      window.__frames.push(now - last);
      last = now;
      window.__raf = requestAnimationFrame(tick);
    };
    window.__raf = requestAnimationFrame(tick);
  });
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 90);
    await sleep(100);
  }
  const frames = await page.evaluate(() => {
    cancelAnimationFrame(window.__raf);
    return window.__frames;
  });
  const sorted = [...frames].sort((a, b) => a - b);
  result.fps = {
    average: Math.round(1000 / (frames.reduce((sum, value) => sum + value, 0) / frames.length)),
    worstFrameMs: Math.round(sorted.at(-1)),
    p95FrameMs: Math.round(sorted[Math.floor(sorted.length * 0.95)]),
  };

  const walked = await walkPage(page, 'desktop', 1300);
  result.pageHeight = walked.height;
  result.screenshots = walked.files;
  result.sideways = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  result.hiddenAfterFullScroll = await hiddenText(page);
  report.desktop = result;
  await context.close();
}

// Phone
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const result = { errors: [], outside: [] };
  listen(page, new URL(base).origin, result);
  await page.goto(url, { waitUntil: 'load' });
  await sleep(3500);
  const walked = await walkPage(page, 'phone', 1100);
  result.pageHeight = walked.height;
  result.screenshots = walked.files;
  result.sideways = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  result.hiddenAfterFullScroll = await hiddenText(page);
  report.phone = result;
  await context.close();
}

// Reduced motion
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const result = { errors: [], outside: [] };
  listen(page, new URL(base).origin, result);
  await page.goto(url, { waitUntil: 'load' });
  await sleep(1500);
  await page.screenshot({ path: join(out, 'reduced-motion-first-screen.png') });
  result.hiddenOnLoad = await hiddenText(page);
  report.reducedMotion = result;
  await context.close();
}

// No JavaScript
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await sleep(500);
  await page.screenshot({ path: join(out, 'no-javascript-first-screen.png') });
  report.noJavaScript = { screenshot: join(out, 'no-javascript-first-screen.png') };
  await context.close();
}

await browser.close();
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 2));

const problems = [];
for (const [name, section] of Object.entries({ desktop: report.desktop, phone: report.phone, reducedMotion: report.reducedMotion })) {
  if (section.errors.length) problems.push(`${name}: console or request errors: ${section.errors.slice(0, 4).join(' | ')}`);
  if (section.outside.length) problems.push(`${name}: outside requests: ${section.outside.slice(0, 4).join(' | ')}`);
  if (section.sideways > 0) problems.push(`${name}: scrolls sideways by ${section.sideways}px`);
  const hidden = section.hiddenAfterFullScroll ?? section.hiddenOnLoad;
  if (hidden?.length) problems.push(`${name}: ${hidden.length} text blocks left invisible: ${hidden.slice(0, 5).join(' | ')}`);
}
if (report.desktop.fps.average < 50) problems.push(`desktop: only ${report.desktop.fps.average}fps while scrolling`);

console.log(`Renderer: ${report.renderer}`);
console.log(`Scrolling: ${report.desktop.fps.average}fps average, ${report.desktop.fps.p95FrameMs}ms p95 frame, ${report.desktop.fps.worstFrameMs}ms worst frame`);
console.log(`Screenshots are in ${out}: desktop-first-screen.png, desktop-00..${String(stops).padStart(2, '0')}.png, phone-00..${String(stops).padStart(2, '0')}.png, reduced-motion-first-screen.png, no-javascript-first-screen.png`);
console.log(problems.length ? `PROBLEMS:\n- ${problems.join('\n- ')}` : 'No automated problems found. Now look at the screenshots.');
process.exit(problems.length ? 1 : 0);
