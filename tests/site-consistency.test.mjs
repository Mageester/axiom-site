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

const routes = ['/', '/services', '/work', '/pricing', '/about', '/contact', '/start-a-project'];
const expectedDesktopNav = ['Services', 'Work', 'Pricing', 'About'];

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

test('public pages keep site-wide consistency and reduced-motion boot state', async () => {
  const devServer = spawnCommand(['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort']);

  try {
    await waitForServer(`${baseUrl}/`);

    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

      for (const route of routes) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });

        assert.match(await page.title(), /Axiom Web/, `${route} title should contain Axiom Web`);
        await assert.doesNotReject(
          page.getByText('Websites built to convert. Not to decorate.').waitFor({ state: 'visible', timeout: 5000 }),
          `${route} should render the standard footer tagline`
        );

        const navLabels = await page.locator('nav[aria-label="Primary"] a').evaluateAll((links) =>
          links.map((link) => link.textContent?.trim()).filter(Boolean)
        );
        assert.deepEqual(navLabels, expectedDesktopNav, `${route} desktop nav order should stay consistent`);
      }

      const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce',
      });
      const reducedPage = await context.newPage();
      await reducedPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

      const motionState = await reducedPage.evaluate(() => ({
        reduced: document.documentElement.dataset.motionReduced,
        active: document.documentElement.dataset.motionActive,
      }));

      assert.equal(motionState.reduced, 'true');
      assert.notEqual(motionState.active, 'true');
      await context.close();
    } finally {
      await browser.close();
    }
  } finally {
    stopProcess(devServer);
    await Promise.race([once(devServer, 'exit'), delay(5000)]).catch(() => null);
  }
});
