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
  assert.match(proofBar, /Performance verified before launch/);
  assert.match(proofBar, /Custom design and development/);
  assert.match(proofBar, /2-4 week standard build window/);
  assert.match(proofBar, /Axiom Web, a division of Axiom International/);
  assert.doesNotMatch(homePage, /MotionQuote/);
  assert.doesNotMatch(homePage, /Custom build\./);
  assert.doesNotMatch(homePage, /card\.metricLabel/);
  assert.doesNotMatch(homePage, /card\.metricValue/);
  assert.match(homePage, /day: 'Week 2',\s*title: 'Scope'/);
  assert.doesNotMatch(homePage, /Fit\s*&rarr;\s*Scope\s*&rarr;\s*Launch/i);
  assert.match(footer, /Axiom Web\. Kitchener-Waterloo\./);
  assert.doesNotMatch(footer, /division of Axiom International/i);
  assert.match(timeline, /timeline-step-number flex h-10 min-w-\[4\.75rem\]/);
  assert.doesNotMatch(timeline, /timeline-step-number[^"]*rounded-full/);
});
