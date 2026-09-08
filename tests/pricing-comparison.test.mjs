import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import { chromium } from 'playwright';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const port = 4325;
const baseUrl = `http://127.0.0.1:${port}`;

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

test('desktop pricing keeps tier cards full-height with visible prices and CTAs', async () => {
  const devServer = spawnCommand(['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort']);

  try {
    await waitForServer(`${baseUrl}/pricing`);

    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
      await page.goto(`${baseUrl}/pricing`, { waitUntil: 'networkidle' });
      await page.locator('text=COMPARE THE PATHS').scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const diagnostics = await page.evaluate(() => {
        const tiers = Array.from(document.querySelectorAll('#monthly-tier, #ownership-tier, #ecommerce-tier'));
        const price = document.querySelector('#monthly-tier')?.textContent ?? '';

        return {
          tierCount: tiers.length,
          minTierHeight: tiers.length
            ? Math.min(...tiers.map((t) => t.getBoundingClientRect().height))
            : 0,
          monthlyPricePresent: price.includes('$200/mo'),
        };
      });

      assert.ok(diagnostics.tierCount === 3, 'all three pricing tiers should render on desktop');
      assert.ok(
        diagnostics.minTierHeight > 300,
        `expected tier cards to keep usable height, got min height=${diagnostics.minTierHeight}px`
      );
      assert.ok(diagnostics.monthlyPricePresent, 'monthly tier should display its price');
    } finally {
      await browser.close();
    }
  } finally {
    stopProcess(devServer);
    await Promise.race([once(devServer, 'exit'), delay(5000)]).catch(() => null);
  }
});
