import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  { name: 'home', path: '/' },
  { name: 'work', path: '/work' },
  { name: 'services', path: '/services' },
  { name: 'pricing', path: '/pricing' },
  { name: 'about', path: '/about' },
  { name: 'process', path: '/process' },
  { name: 'approach', path: '/approach' },
  { name: 'contact', path: '/contact' },
] as const;

for (const { name, path } of PUBLIC_PAGES) {
  test.describe(`${name} page`, () => {
    test(`renders above the fold`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot(`${name}-above-fold.png`, {
        fullPage: false,
      });
    });

    test(`renders full page`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      await expect(page).toHaveScreenshot(`${name}-full-page.png`, {
        fullPage: true,
      });
    });
  });
}

test.describe('SEO validation', () => {
  for (const { name, path } of PUBLIC_PAGES) {
    test(`${name} has required meta tags`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(70);

      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThanOrEqual(160);

      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical).toBeTruthy();
      expect(canonical).toContain('getaxiom.ca');

      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle).toBeTruthy();

      const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
      expect(ogDescription).toBeTruthy();

      const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
      expect(ogImage).toBeTruthy();

      const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
      expect(twitterCard).toBe('summary_large_image');
    });
  }

  test('homepage has JSON-LD structured data', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const scripts = await page.$$eval('script[type="application/ld+json"]', (els) =>
      els.map((el) => JSON.parse(el.textContent || '{}'))
    );
    expect(scripts.length).toBeGreaterThanOrEqual(2);
    const types = scripts.map((s) => s['@type']);
    expect(types).toContain('LocalBusiness');
    expect(types).toContain('WebSite');
  });

  test('pricing page has FAQ schema', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
    const scripts = await page.$$eval('script[type="application/ld+json"]', (els) =>
      els.map((el) => JSON.parse(el.textContent || '{}'))
    );
    const types = scripts.map((s) => s['@type']);
    expect(types).toContain('FAQPage');
  });
});

test.describe('performance basics', () => {
  test('no layout shift from font loading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cumulative = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cumulative += (entry as any).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(cumulative);
        }, 3000);
      });
    });
    expect(cls).toBeLessThan(0.1);
  });

  test('no console errors on public pages', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    for (const { path } of PUBLIC_PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
    }
    expect(errors).toEqual([]);
  });

  test('reduced motion disables animations', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'reduced-motion project only');
    await page.goto('/', { waitUntil: 'networkidle' });
    const motionReduced = await page.getAttribute('html', 'data-motion-reduced');
    if (motionReduced === 'true') {
      const bodyTransition = await page.evaluate(() =>
        getComputedStyle(document.body).transition
      );
      expect(bodyTransition).toContain('none');
    }
  });
});

test.describe('navigation consistency', () => {
  test('nav links are consistent across pages', async ({ page }) => {
    const navLinks: string[][] = [];
    for (const { path } of PUBLIC_PAGES.slice(0, 4)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const links = await page.$$eval('nav a[href]', (els) =>
        els.map((a) => a.getAttribute('href')).filter(Boolean).sort()
      );
      navLinks.push(links as string[]);
    }
    for (let i = 1; i < navLinks.length; i++) {
      expect(navLinks[i]).toEqual(navLinks[0]);
    }
  });
});
