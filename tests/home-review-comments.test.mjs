import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const homePage = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const footer = readFileSync(new URL('../src/components/layout/Footer.astro', import.meta.url), 'utf8');

test('home review comments stay addressed', () => {
  // Hero states the offer plainly for serious local businesses.
  assert.match(homePage, /A sharper digital[\s\S]*presence for serious[\s\S]*local businesses/);

  // Retired copy stays retired.
  assert.doesNotMatch(homePage, /Sites for companies past the template stage\./);
  assert.doesNotMatch(homePage, /WEB DESIGN — KITCHENER-WATERLOO/);
  assert.doesNotMatch(homePage, /MotionQuote/);
  assert.doesNotMatch(homePage, /Custom build\./);
  assert.doesNotMatch(homePage, /card\.metricLabel/);
  assert.doesNotMatch(homePage, /card\.metricValue/);
  assert.doesNotMatch(homePage, /Fit\s*&rarr;\s*Scope\s*&rarr;\s*Launch/i);

  // Process steps keep the Review -> Scope ordering.
  assert.match(homePage, /num: '01',\s*title: 'Review'/);
  assert.match(homePage, /num: '02',\s*title: 'Scope'/);

  // Demonstration work is labeled honestly, not presented as client proof.
  assert.match(homePage, /demonstration builds/i);

  // Site footer states the location without claiming a parent company.
  assert.match(footer, /Based in Kitchener-Waterloo/);
  assert.doesNotMatch(footer, /Axiom International/i);
  assert.doesNotMatch(footer, /division of Axiom/i);
});
