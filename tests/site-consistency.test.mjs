import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import { chromium } from 'playwright';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const port = 4326;
const baseUrl = `http://127.0.0.1:${port}`;

const routes = ['/', '/services/', '/work/', '/pricing/', '/approach/', '/about/', '/industries/', '/contact/', '/start-a-project/'];
const expectedDesktopNav = ['Services', 'Work', 'Pricing', 'Process', 'About', 'Contact'];

function spawnCommand(args, options = {}) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/c', 'npm', ...args], {
      cwd: repoRoot,
      stdio: 'ignore',
      windowsHide: true,
      ...options,
    });
  }

  return spawn('npm', args, {
    cwd: repoRoot,
    stdio: 'ignore',
    ...options,
  });
}

async function waitForServer(url, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await delay(1000);
  }

  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

function stopProcess(child) {
  if (!child.pid) return;

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      cwd: repoRoot,
      stdio: 'ignore',
      windowsHide: true,
    });
    return;
  }

  child.kill('SIGTERM');
}

test('public pages keep site-wide consistency, accessible navigation and form behaviour', async () => {
  const devServer = spawnCommand(['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort']);

  try {
    await waitForServer(`${baseUrl}/`);

    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

      for (const route of routes) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });

        assert.match(await page.title(), /Axiom Web/, `${route} title should contain Axiom Web`);
        assert.equal(await page.evaluate(() => document.querySelectorAll('h1').length), 1, `${route} should have exactly one h1`);
        await assert.doesNotReject(
          page
            .getByText('Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.')
            .waitFor({ state: 'visible', timeout: 5000 }),
          `${route} should identify the founders and parent company in the footer`
        );

        const navLabels = await page.locator('nav[aria-label="Primary"] a').evaluateAll((links) =>
          links.map((link) => link.textContent?.trim()).filter(Boolean)
        );
        assert.deepEqual(navLabels, expectedDesktopNav, `${route} desktop nav order should stay consistent`);
      }

      await page.goto(`${baseUrl}/start-a-project/?path=expanded`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('[data-intake-alert]').getAttribute('hidden'), '', 'intake alert should start hidden');
      assert.equal(
        await page.locator('input[name="pricing_path"]:checked').getAttribute('value'),
        'expanded',
        'pricing links should preselect the matching package'
      );
      await page.getByRole('button', { name: 'Send project details' }).click();
      assert.equal(await page.locator('#project-name').getAttribute('aria-invalid'), 'true', 'empty required fields should be flagged');
      assert.match(await page.locator('[data-intake-alert]').innerText(), /check the highlighted fields/i);

      await page.goto(`${baseUrl}/about/`, { waitUntil: 'networkidle' });
      await assert.doesNotReject(
        page
          .getByText('We are Aidan Magee and Riley Hinsperger, co-founders of Axiom International and Axiom Web, its web-focused subsidiary.')
          .waitFor({ state: 'visible', timeout: 5000 }),
        'About should identify the founders and parent-company relationship'
      );

      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await assert.doesNotReject(
        page.getByRole('heading', { name: 'Two founders. No account managers.' }).waitFor({ state: 'visible', timeout: 5000 }),
        'Homepage should identify the studio as founder-led'
      );

      const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      const toggle = mobile.locator('[data-menu-toggle]');
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true', 'menu button should report the open state');
      await assert.doesNotReject(mobile.locator('#mobile-menu').waitFor({ state: 'visible', timeout: 2000 }));
      await mobile.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false', 'Escape should close the menu');
      assert.equal(await mobile.locator('#mobile-menu').isVisible(), false);

      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const reducedPage = await context.newPage();
      await reducedPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      const longestTransition = await reducedPage.evaluate(() =>
        Math.max(...getComputedStyle(document.querySelector('.btn')).transitionDuration.split(',').map((value) => parseFloat(value)))
      );
      assert.ok(longestTransition < 0.001, `reduced motion should neutralise transitions, got ${longestTransition}s`);
      await context.close();
    } finally {
      await browser.close();
    }
  } finally {
    stopProcess(devServer);
    await Promise.race([once(devServer, 'exit'), delay(5000)]).catch(() => null);
  }
});
