import { test, expect } from '@playwright/test';

test('homepage work explorer exposes accessible project selection and direct demo links', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const explorer = page.locator('[data-work-explorer]');
  const triggers = explorer.locator('[data-work-trigger]');

  await expect(explorer).toBeVisible();
  await expect(triggers).toHaveCount(3);
  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#homepage-work-panel-dental-aurelia')).toBeVisible();
  await expect(page.locator('#homepage-work-panel-dental-aurelia a')).toHaveAttribute(
    'href',
    'https://dental.getaxiom.ca'
  );

  await triggers.nth(1).focus();
  await page.keyboard.press('Enter');

  await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#homepage-work-panel-salon-nails')).toBeVisible();
  await expect(page.locator('#homepage-work-panel-salon-nails a')).toHaveAttribute(
    'href',
    'https://nails.getaxiom.ca'
  );
  await expect(page.locator('body')).not.toContainText('Under 1s');
});

test('homepage process line responds to scroll without creating horizontal overflow', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.locator('[data-process-track]')).toBeVisible();
  await expect(page.locator('[data-process-line-fill]')).toBeAttached();

  await page.locator('[data-process-track]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);

  const progress = await page.locator('[data-process-track]').evaluate((element) =>
    element.style.getPropertyValue('--process-progress')
  );
  expect(Number(progress)).toBeGreaterThanOrEqual(0);
  expect(Number(progress)).toBeLessThanOrEqual(1);

  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});

test('homepage uses distinct, deliberately paced motion choreography across every scene', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const sceneRoles = await page.locator('[data-cinematic-scene]').evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('data-motion-role'))
  );
  expect(sceneRoles).toEqual([
    'title-card',
    'statement',
    'cascade',
    'feature',
    'index',
    'proof',
    'metrics',
    'process',
    'partners',
    'resolution',
  ]);

  await page.locator('[data-home-section="figures"]').scrollIntoViewIfNeeded();
  await expect(page.locator('.ax-figure--lead')).toHaveClass(/is-in/, { timeout: 2_000 });
  await page.waitForTimeout(80);

  const timings = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      const style = getComputedStyle(element);
      return {
        animationDuration: style.animationDuration,
        transitionDuration: style.transitionDuration,
      };
    };

    return {
      hero: read('.ax-hero .ax-line-inner'),
      statement: read('.ax-statement-line'),
      solution: read('.ax-solution-title'),
      work: read('.ax-work-feature'),
      services: read('.ax-row-title'),
      proof: read('.ax-principle-title'),
      metrics: read('.ax-figure-num'),
      process: read('.ax-step-node'),
      partners: read('.ax-person-name'),
      final: read('.ax-final-mega'),
    };
  });

  const firstDuration = (value: string) => Number.parseFloat(value.split(',')[0]);
  expect(firstDuration(timings.hero.animationDuration)).toBeGreaterThanOrEqual(1.4);
  expect(firstDuration(timings.statement.transitionDuration)).toBeGreaterThanOrEqual(1.1);
  expect(firstDuration(timings.solution.transitionDuration)).toBeGreaterThanOrEqual(1.1);
  expect(firstDuration(timings.work.transitionDuration)).toBeGreaterThanOrEqual(1.1);
  expect(firstDuration(timings.services.transitionDuration)).toBeGreaterThanOrEqual(1.1);
  expect(firstDuration(timings.proof.transitionDuration)).toBeGreaterThanOrEqual(1.1);
  expect(firstDuration(timings.metrics.animationDuration)).toBeGreaterThanOrEqual(1.3);
  expect(firstDuration(timings.process.transitionDuration)).toBeGreaterThanOrEqual(0.6);
  expect(firstDuration(timings.partners.transitionDuration)).toBeGreaterThanOrEqual(1.1);
  expect(firstDuration(timings.final.transitionDuration)).toBeGreaterThanOrEqual(1.1);
});

test('homepage marks the active cinematic scene while native scrolling continues', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const services = page.locator('[data-home-section="services"]');
  await services.scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);

  const sceneState = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('[data-homepage]');
    const section = document.querySelector<HTMLElement>('[data-home-section="services"]');
    if (!root || !section) throw new Error('Missing homepage scene state');
    return {
      activeScene: root.dataset.activeScene,
      isActive: section.classList.contains('is-scene-active'),
      progress: Number(section.style.getPropertyValue('--scene-progress')),
    };
  });

  expect(sceneState.activeScene).toBe('services');
  expect(sceneState.isActive).toBe(true);
  expect(sceneState.progress).toBeGreaterThan(0);
  expect(sceneState.progress).toBeLessThan(1);
  await expect(page.locator('[data-home-footer]')).toBeAttached();
});

test('homepage anchors the cinematic direction to a loaded hero and live scene depth', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const visualAnchors = await page.evaluate(() => {
    const heroImage = document.querySelector<HTMLImageElement>('.ax-hero-art img');
    const heroSignal = document.querySelector<HTMLElement>('.ax-hero-signal-point');
    const leadFigure = document.querySelector<HTMLElement>('.ax-figure--lead');
    const railProgress = document.querySelector<HTMLElement>('.ax-continuity-rail-progress');
    if (!heroImage || !heroSignal || !leadFigure || !railProgress) throw new Error('Missing cinematic anchor');

    return {
      heroLoaded: heroImage.complete && heroImage.naturalWidth > 0,
      signalColor: getComputedStyle(heroSignal).borderColor,
      leadFigureCount: document.querySelectorAll('.ax-figure--lead').length,
      railColor: getComputedStyle(railProgress).backgroundColor,
    };
  });

  expect(visualAnchors.heroLoaded).toBe(true);
  expect(visualAnchors.signalColor).toBe('rgb(194, 106, 58)');
  expect(visualAnchors.leadFigureCount).toBe(1);
  expect(visualAnchors.railColor).toBe('rgb(194, 106, 58)');

  const servicesY = await page.locator('.ax-scene--index').evaluate((element) =>
    element.getBoundingClientRect().top + window.scrollY + element.clientHeight * 0.5,
  );
  await page.evaluate((y) => window.scrollTo(0, y), servicesY);
  await page.waitForTimeout(120);

  const drift = await page.locator('.ax-scene--index').evaluate((element) => ({
    left: element.style.getPropertyValue('--scene-drift-left'),
    right: element.style.getPropertyValue('--scene-drift-right'),
  }));
  expect(drift.left === '0px' && drift.right === '0px').toBe(false);
});

test.describe('homepage reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('keeps the hero, work explorer, and process content immediately visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('.ax-hero-title')).toBeVisible();
    await expect(page.locator('[data-work-explorer]')).toBeVisible();
    await expect(page.locator('[data-process-track]')).toBeVisible();

    const motionState = await page.evaluate(() => ({
      heroOpacity: getComputedStyle(document.querySelector('.ax-hero-title')!).opacity,
      heroTransform: getComputedStyle(document.querySelector('.ax-hero-title')!).transform,
      motionReduced: document.documentElement.dataset.motionReduced,
    }));
    expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    expect(motionState.motionReduced).toBe('true');
    expect(motionState.heroOpacity).toBe('1');
    expect(motionState.heroTransform).toBe('none');
  });
});
