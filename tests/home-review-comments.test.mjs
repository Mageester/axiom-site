import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const homePage = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const footer = readFileSync(new URL('../src/components/layout/Footer.tsx', import.meta.url), 'utf8');
const timeline = readFileSync(new URL('../src/components/motion/Timeline.tsx', import.meta.url), 'utf8');
const proofBar = readFileSync(new URL('../src/components/motion/ProofBar.tsx', import.meta.url), 'utf8');

test('home review comments stay addressed', () => {
  assert.match(proofBar, /home-proof-band/);
  assert.doesNotMatch(proofBar, /font-mono/);
  assert.doesNotMatch(homePage, /Fit\s*&rarr;\s*Scope\s*&rarr;\s*Launch/i);
  assert.match(footer, /Axiom Web is a division of Axiom International/i);
  assert.match(timeline, /timeline-step-number flex h-10 min-w-\[4\.75rem\]/);
  assert.doesNotMatch(timeline, /timeline-step-number[^"]*rounded-full/);
});
