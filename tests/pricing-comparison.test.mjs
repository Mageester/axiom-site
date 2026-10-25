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

test('pricing shows every package with its price, a recommended tier and a full comparison table', async () => {
  const devServer = spawnCommand(['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort']);

  try {
    await waitForServer(`${baseUrl}/pricing/`);

    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
      await page.goto(`${baseUrl}/pricing/`, { waitUntil: 'networkidle' });

      const expected = {
        'local-launch': 'CAD $900',
        'local-business': 'CAD $1,200',
        expanded: 'CAD $1,500',
        custom: 'Quoted',
      };
      for (const [key, price] of Object.entries(expected)) {
        const card = page.locator(`.pricing-cards #${key}`);
        assert.equal(await card.count(), 1, `${key} card should render once`);
        assert.match(await card.innerText(), new RegExp(price.replace(/[$]/g, '\\$')), `${key} should show ${price}`);
        const box = await card.boundingBox();
        assert.ok(box && box.height > 300, `${key} card should keep a usable height`);
      }

      const featured = page.locator('.pricing-cards .price-card.featured');
      assert.equal(await featured.count(), 1, 'exactly one package should be recommended');
      assert.equal(await featured.getAttribute('id'), 'local-business');
      assert.match(await featured.innerText(), /Recommended/);

      const headers = await page.locator('.compare-table thead th').allInnerTexts();
      assert.equal(headers.length, 5, 'comparison table should have a label column plus four packages');
      assert.ok((await page.locator('.compare-table tbody tr').count()) >= 7, 'comparison table should list every row');

      const cta = page.locator('#expanded a.btn');
      assert.equal(await cta.getAttribute('href'), '/start-a-project/?path=expanded', 'package CTA should carry the package intent');
    } finally {
      await browser.close();
    }
  } finally {
    stopProcess(devServer);
    await Promise.race([once(devServer, 'exit'), delay(5000)]).catch(() => null);
  }
});
