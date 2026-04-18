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

test('desktop pricing comparison keeps first rows visible and inline checks rendered', async () => {
  const devServer = spawnCommand(['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort']);

  try {
    await waitForServer(`${baseUrl}/pricing`);

    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
      await page.goto(`${baseUrl}/pricing`, { waitUntil: 'networkidle' });
      await page.locator('text=COMPARE THE TIERS').scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const diagnostics = await page.evaluate(() => {
        const table = document.querySelector('table');
        const thead = table?.querySelector('thead');
        const firstRow = table?.querySelector('tbody tr');
        const checkPath = table?.querySelector('tbody tr:nth-child(5) td svg path');

        if (!table || !thead || !firstRow || !checkPath) {
          return null;
        }

        const theadRect = thead.getBoundingClientRect();
        const firstRowRect = firstRow.getBoundingClientRect();
        const checkPathStyles = getComputedStyle(checkPath);

        return {
          headerBottom: theadRect.bottom,
          firstRowTop: firstRowRect.top,
          checkDashOffset: checkPathStyles.strokeDashoffset,
          checkOpacity: checkPathStyles.opacity,
        };
      });

      assert.ok(diagnostics, 'pricing comparison table should render on desktop');
      assert.ok(
        diagnostics.firstRowTop >= diagnostics.headerBottom,
        `expected first row to start below the header, got rowTop=${diagnostics.firstRowTop} headerBottom=${diagnostics.headerBottom}`
      );
      assert.equal(
        diagnostics.checkDashOffset,
        '0px',
        `expected inline comparison check icons to be visible, got strokeDashoffset=${diagnostics.checkDashOffset}`
      );
    } finally {
      await browser.close();
    }
  } finally {
    stopProcess(devServer);
    await Promise.race([once(devServer, 'exit'), delay(5000)]).catch(() => null);
  }
});
