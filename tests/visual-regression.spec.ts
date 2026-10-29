import { test, expect } from '@playwright/test';

// Snapshots are platform-specific: regenerate with `npm run test:visual:update` after design changes.
const PUBLIC_PAGES = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services/' },
  { name: 'work', path: '/work/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'approach', path: '/approach/' },
  { name: 'about', path: '/about/' },
  { name: 'industries', path: '/industries/' },
  { name: 'contact', path: '/contact/' },
  { name: 'start-a-project', path: '/start-a-project/' },
] as const;

for (const { name, path } of PUBLIC_PAGES) {
  test.describe(`${name} page`, () => {
    // Snapshots capture the static design: with reduced motion the liquid lens
    // stays on its rendered poster and the custom cursor is off, so the
    // WebGL animation cannot make a pixel comparison flake.
    test.use({ reducedMotion: 'reduce' });
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    });

    test(`renders above the fold`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      await expect(page).toHaveScreenshot(`${name}-above-fold.png`, { fullPage: false });
    });

    test(`renders full page`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      await expect(page).toHaveScreenshot(`${name}-full-page.png`, { fullPage: true });
    });
  });
}

test.describe('SEO validation', () => {
  for (const { name, path } of PUBLIC_PAGES) {
    test(`${name} has required meta tags`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(65);

      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description!.length).toBeGreaterThan(70);
      expect(description!.length).toBeLessThanOrEqual(160);

      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical).toMatch(/^https:\/\/getaxiom\.ca\/.*\/?$/);

      for (const property of ['og:title', 'og:description', 'og:image']) {
        expect(await page.getAttribute(`meta[property="${property}"]`, 'content')).toBeTruthy();
      }
      expect(await page.getAttribute('meta[name="twitter:card"]', 'content')).toBe('summary_large_image');
      // Count the page's own headings: Playwright locators pierce the dev toolbar's shadow DOM.
      expect(await page.evaluate(() => document.querySelectorAll('h1').length)).toBe(1);
    });
  }

  test('homepage has business, website and FAQ structured data', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const types = (
      await page.$$eval('script[type="application/ld+json"]', (els) => els.map((el) => JSON.parse(el.textContent || '{}')['@type']))
    ).flat();
    expect(types).toContain('LocalBusiness');
    expect(types).toContain('WebSite');
    expect(types).toContain('FAQPage');
  });

  test('pricing page has FAQ schema', async ({ page }) => {
    await page.goto('/pricing/', { waitUntil: 'domcontentloaded' });
    const types = (
      await page.$$eval('script[type="application/ld+json"]', (els) => els.map((el) => JSON.parse(el.textContent || '{}')['@type']))
    ).flat();
    expect(types).toContain('FAQPage');
  });
});

test.describe('performance basics', () => {
  test('no layout shift from font loading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let cumulative = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) cumulative += (entry as any).value;
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => {
            observer.disconnect();
            resolve(cumulative);
          }, 3000);
        })
    );
    expect(cls).toBeLessThan(0.1);
  });

  test('no console errors on public pages', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      // The Astro dev toolbar logs its own audit failures with an "Astro" badge; only the site's errors count.
      if (msg.type() === 'error' && !msg.text().startsWith('%cAstro')) errors.push(msg.text());
    });
    for (const { path } of PUBLIC_PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' });
    }
    expect(errors).toEqual([]);
  });

  test('pages never scroll sideways on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const { path } of PUBLIC_PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});

test.describe('navigation consistency', () => {
  test('primary nav links are consistent across pages', async ({ page }) => {
    const navLinks: string[][] = [];
    for (const { path } of PUBLIC_PAGES) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      navLinks.push(await page.$$eval('nav[aria-label="Primary"] a[href]', (els) => els.map((a) => a.getAttribute('href') || '')));
    }
    for (const links of navLinks) expect(links).toEqual(navLinks[0]);
  });
});
