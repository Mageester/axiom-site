import test from 'node:test';
import assert from 'node:assert/strict';
import { whenDocumentReady } from '../src/lib/domReady.js';

function createFakeDocument(initialReadyState = 'loading') {
  const listeners = new Map();
  return {
    readyState: initialReadyState,
    addEventListener(type, listener, options) {
      listeners.set(type, { listener, options });
    },
    dispatch(type) {
      const entry = listeners.get(type);
      if (entry) entry.listener();
    },
    getListener(type) {
      return listeners.get(type);
    },
  };
}

test('whenDocumentReady runs immediately after DOM is already ready', () => {
  const doc = createFakeDocument('interactive');
  let calls = 0;

  whenDocumentReady(doc, () => {
    calls += 1;
  });

  assert.equal(calls, 1);
  assert.equal(doc.getListener('DOMContentLoaded'), undefined);
});

test('whenDocumentReady waits for DOMContentLoaded while document is loading', () => {
  const doc = createFakeDocument('loading');
  let calls = 0;

  whenDocumentReady(doc, () => {
    calls += 1;
  });

  assert.equal(calls, 0);
  assert.deepEqual(doc.getListener('DOMContentLoaded')?.options, { once: true });

  doc.dispatch('DOMContentLoaded');

  assert.equal(calls, 1);
});
