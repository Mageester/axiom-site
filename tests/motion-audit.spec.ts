import { test, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

type SelectorSnapshot = {
  selector: string;
  exists: boolean;
  text?: string;
  styles?: Record<string, string>;
};

type PageAudit = {
  page: string;
  url: string;
  consoleErrors: string[];
  networkErrors: string[];
  selectorSnapshots: SelectorSnapshot[];
  screenshots: string[];
  notes: string[];
};

const BASE_URL = process.env.MOTION_AUDIT_URL ?? 'https://getaxiom.ca';
const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, 'output', 'motion-audit');
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, 'screenshots');

const desktopViewport = { width: 1440, height: 1600 };
const mobileViewport = { width: 375, height: 667, isMobile: true, hasTouch: true };

const pages = [
  { page: 'home', url: '/' },
  { page: 'work', url: '/work' },
  { page: 'process', url: '/process' },
  { page: 'pricing', url: '/pricing' },
  { page: 'about', url: '/about' },
  { page: 'start-a-project', url: '/start-a-project' },
] as const;

const results: PageAudit[] = [];

async function ensureOutputDirs() {
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
}

async function collectSelectorSnapshots(page: Page, selectors: string[]): Promise<SelectorSnapshot[]> {
  return page.evaluate((selectorsToCheck) => {
    return selectorsToCheck.map((selector) => {
      const el = document.querySelector(selector);
      if (!(el instanceof HTMLElement)) {
        return { selector, exists: false };
      }

      const styles = getComputedStyle(el);
      return {
        selector,
        exists: true,
        text: el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 180),
        styles: {
          opacity: styles.opacity,
          transform: styles.transform,
          clipPath: styles.clipPath,
          fontFamily: styles.fontFamily,
          fontStyle: styles.fontStyle,
          backgroundImage: styles.backgroundImage,
          backdropFilter: styles.backdropFilter,
          borderColor: styles.borderColor,
          color: styles.color,
        },
      };
    });
  }, selectors);
}

async function scrollToDepth(page: Page, fraction: number) {
  await page.evaluate((scrollFraction) => {
    const maxScroll = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
    window.scrollTo(0, maxScroll * scrollFraction);
  }, fraction);
  await page.waitForTimeout(350);
}

async function captureScrollSet(page: Page, slug: string, shots: string[]) {
  for (const fraction of [0, 0.25, 0.5, 0.75, 1] as const) {
    await scrollToDepth(page, fraction);
    const filename = `${slug}-scroll-${Math.round(fraction * 100)}.png`;
    const filePath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filePath, fullPage: false });
    shots.push(path.relative(ROOT, filePath).replaceAll('\\', '/'));
  }
}

async function captureTimedShots(page: Page, slug: string, shots: string[]) {
  for (const delay of [0, 300, 900] as const) {
    if (delay > 0) {
      await page.waitForTimeout(delay === 300 ? 300 : 600);
    }
    const filename = `${slug}-hero-${delay}.png`;
    const filePath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filePath, fullPage: false });
    shots.push(path.relative(ROOT, filePath).replaceAll('\\', '/'));
  }
}

async function auditPage(page: Page, slug: string, url: string): Promise<PageAudit> {
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];
  const screenshots: string[] = [];
  const notes: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('requestfailed', (request) => {
    networkErrors.push(`${request.failure()?.errorText ?? 'request failed'} :: ${request.url()}`);
  });

  page.on('response', (response) => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()} :: ${response.url()}`);
    }
  });

  if (slug === 'home' || slug === 'home-mobile' || slug === 'home-reduced-motion') {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'domcontentloaded' });
    await captureTimedShots(page, slug, screenshots);
  } else {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle' });
  }

  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(500);

  if (slug === 'home' || slug === 'home-mobile') {
    const timelineHeading = page.getByRole('heading', { name: 'Four stages. Fourteen days. No drift.' });
    if (await timelineHeading.count()) {
      await timelineHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      for (const delay of [0, 300, 900] as const) {
        if (delay > 0) {
          await page.waitForTimeout(delay === 300 ? 300 : 600);
        }
        const filename = `${slug}-timeline-${delay}.png`;
        const filePath = path.join(SCREENSHOT_DIR, filename);
        await page.screenshot({ path: filePath, fullPage: false });
        screenshots.push(path.relative(ROOT, filePath).replaceAll('\\', '/'));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(250);
    }
  }

  const fullPagePath = path.join(SCREENSHOT_DIR, `${slug}-full.png`);
  await page.screenshot({ path: fullPagePath, fullPage: true });
  screenshots.push(path.relative(ROOT, fullPagePath).replaceAll('\\', '/'));

  await captureScrollSet(page, slug, screenshots);

  const selectorSnapshots = await collectSelectorSnapshots(page, [
    'body',
    '[data-cursor-accent]',
    '.section-divider',
    '.motion-surface',
    '.motion-heading',
    '.motion-quote',
    '.motion-quote .quote-phrase',
    '.motion-quote .quote-underline',
    '.about-principle-line',
    '.section-block',
    '.glass-card',
    '.glass-card-hover',
  ]);

  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    const before = getComputedStyle(body, '::before');
    return {
      backgroundImage: getComputedStyle(body).backgroundImage,
      pseudoBeforeBackground: before.backgroundImage,
      pseudoBeforeOpacity: before.opacity,
      scrollProgressVisible: !!document.querySelector('body > div[aria-hidden="true"]'),
    };
  });

  notes.push(JSON.stringify(bodyStyles));

  return {
    page: slug,
    url,
    consoleErrors,
    networkErrors,
    selectorSnapshots,
    screenshots,
    notes,
  };
}

test.describe.configure({ mode: 'serial' });
test.setTimeout(600000);

test('motion audit harness', async ({ browser }) => {
  await ensureOutputDirs();

  const desktopContext = await browser.newContext({
    viewport: desktopViewport,
    ignoreHTTPSErrors: true,
  });

  for (const entry of pages) {
    const page = await desktopContext.newPage();
    results.push(await auditPage(page, entry.page, entry.url));
    await page.close();
  }

  const mobileContext = await browser.newContext({
    viewport: mobileViewport,
    ignoreHTTPSErrors: true,
  });
  const mobilePage = await mobileContext.newPage();
  const mobileHome = await auditPage(mobilePage, 'home-mobile', '/');
  results.push(mobileHome);
  await mobilePage.close();

  const reducedContext = await browser.newContext({
    viewport: desktopViewport,
    ignoreHTTPSErrors: true,
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  const reducedHome = await auditPage(reducedPage, 'home-reduced-motion', '/');
  results.push(reducedHome);
  await reducedPage.close();

  await desktopContext.close();
  await mobileContext.close();
  await reducedContext.close();

  const resultsPath = path.join(OUTPUT_DIR, 'motion-audit-results.json');
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2), 'utf8');
});
