import { test, expect } from '@playwright/test';

test.describe('cinematic motion stays clean on mobile', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test('keeps homepage content inside the viewport while scrolling', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    for (const fraction of [0.2, 0.4, 0.6, 0.8]) {
      await page.evaluate((scrollFraction) => {
        const maxScroll = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
        window.scrollTo(0, maxScroll * scrollFraction);
      }, fraction);
      await page.waitForTimeout(250);

      const overflow = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        return Array.from(document.querySelectorAll<HTMLElement>('[data-homepage] *'))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              selector: `${element.tagName.toLowerCase()}.${String(element.className).split(' ').filter(Boolean).join('.')}`,
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            };
          })
          .filter(({ width, left, right }) => width > 0 && (left < -1 || right > viewportWidth + 1));
      });

      expect(overflow, `mobile overflow at scroll fraction ${fraction}`).toEqual([]);
    }
  });

  test('keeps homepage reveal staging bounded to a short cinematic beat', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const delays = await page.locator('[data-homepage] .reveal').evaluateAll((elements) =>
      elements.map((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--reveal-delay')) || 0),
    );

    expect(Math.max(...delays)).toBeLessThanOrEqual(500);
  });

  test('keeps each mobile hero line as one intentional text block', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const lineRects = await page.locator('.ax-line-inner').evaluateAll((elements) =>
      elements.map((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return new Set(Array.from(range.getClientRects()).map((rect) => Math.round(rect.top))).size;
      }),
    );

    expect(lineRects, 'hero copy should not wrap inside an authored line').toEqual([1, 1, 1]);
  });

  test('keeps the pricing offer emphasis restrained instead of continuously flashing', async ({ page }) => {
    await page.goto('/pricing/', { waitUntil: 'networkidle' });

    const motion = await page.locator('.local-launch-offer-frame').evaluate((frame) => ({
      frameBorder: getComputedStyle(frame, '::before').animationName,
      frameGlow: getComputedStyle(frame, '::after').animationName,
      badge: getComputedStyle(frame.querySelector('.local-launch-offer-badge')!, '::before').animationName,
      badgeElement: getComputedStyle(frame.querySelector('.local-launch-offer-badge')!).animationName,
    }));

    expect(motion).toEqual({ frameBorder: 'none', frameGlow: 'none', badge: 'none', badgeElement: 'none' });
  });

  test('keeps the pricing hero readable during its opening beat', async ({ page }) => {
    await page.goto('/pricing/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const state = await page.locator('.pricing-hero h1').evaluate((heading) => {
      const animatedParent = heading.parentElement!;
      const styles = getComputedStyle(animatedParent);
      return { opacity: Number(styles.opacity), clipPath: styles.clipPath };
    });

    expect(state.opacity).toBeGreaterThan(0.6);
    expect(state.clipPath).toBe('none');
  });

  test('moves keyboard focus into and back out of the mobile navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.locator('#nav-toggle').click();
    await expect(page.locator('#mobile-nav-panel')).toHaveClass(/nav-open/);
    await expect(page.locator('#nav-close')).toBeFocused({ timeout: 800 });

    await page.locator('#nav-close').click();
    await expect(page.locator('#nav-toggle')).toBeFocused({ timeout: 800 });
  });
});
