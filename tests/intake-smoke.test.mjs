import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function spawnCommand(args, options = {}) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/c', 'npm', ...args], {
      cwd: repoRoot,
      stdio: 'inherit',
      windowsHide: true,
      ...options
    });
  }

  return spawn('npm', args, {
    cwd: repoRoot,
    stdio: 'inherit',
    ...options
  });
}

async function waitForServer(url, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      await fetch(url, { method: 'GET' });
      return;
    } catch (error) {
      lastError = error;
      await delay(1000);
    }
  }

  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

async function exitCode(child) {
  const [code, signal] = await once(child, 'exit');
  return typeof code === 'number' ? code : signal ? 1 : 0;
}

function stopProcess(child) {
  if (!child.pid) return;

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      cwd: repoRoot,
      stdio: 'ignore'
    });
    return;
  }

  child.kill('SIGTERM');
}

test('intake smoke passes end to end', async () => {
  const build = spawnCommand(['run', 'build']);
  assert.equal(await exitCode(build), 0, 'build should succeed before running the smoke test');

  const api = spawnCommand(['run', 'dev:intake:api']);
  try {
    await waitForServer('http://127.0.0.1:10000');

    const smoke = spawnCommand(['run', 'intake:smoke']);
    assert.equal(await exitCode(smoke), 0, 'intake smoke should pass');
  } finally {
    stopProcess(api);
    await Promise.race([
      once(api, 'exit'),
      delay(5000)
    ]).catch(() => null);
  }
});
