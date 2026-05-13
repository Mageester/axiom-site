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
  assert.match(proofBar, /Strategy, design, and development/);
  assert.match(proofBar, /Defined launch path and support/);
  assert.match(proofBar, /Serving clients across Canada/);
  assert.match(homePage, /A sharper digital front door for serious local businesses\./);
  assert.doesNotMatch(homePage, /Sites for companies past the template stage\./);
  assert.doesNotMatch(homePage, /WEB DESIGN — KITCHENER-WATERLOO/);
  assert.match(homePage, /data-work-demo-toggle/);
  assert.match(homePage, /aria-controls="selected-work-demos"/);
  assert.match(homePage, /id="selected-work-demos"/);
  assert.match(homePage, /data-work-demo-list/);
  assert.doesNotMatch(homePage, /MotionQuote/);
  assert.doesNotMatch(homePage, /Custom build\./);
  assert.doesNotMatch(homePage, /card\.metricLabel/);
  assert.doesNotMatch(homePage, /card\.metricValue/);
  assert.match(homePage, /day: 'Week 2',\s*title: 'Scope'/);
  assert.doesNotMatch(homePage, /Fit\s*&rarr;\s*Scope\s*&rarr;\s*Launch/i);
  assert.match(footer, /Based in Kitchener-Waterloo/);
  assert.doesNotMatch(footer, /division of Axiom International/i);
  assert.match(timeline, /timeline-step-number flex h-10 min-w-\[4\.75rem\]/);
  assert.doesNotMatch(timeline, /timeline-step-number[^"]*rounded-full/);
});
