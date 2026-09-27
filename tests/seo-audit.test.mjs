import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// Use an isolated copy of the build: never mutate the deploy artifact.
const fixture = resolve('output/seo-max-pass/audit-fixture');
mkdirSync(fixture, { recursive: true });
cpSync('dist', fixture, { recursive: true });
const run = () => spawnSync(process.execPath, ['scripts/audit-seo.mjs'], {
  env: { ...process.env, SEO_DIST_DIR: fixture }, encoding: 'utf8',
});
test('audit accepts the complete build and rejects meaningful SEO regressions', () => {
  assert.equal(run().status, 0);
  const cases = [
    ['index.html', s => s.replace(/<title>[^<]*<\/title>/, '<title></title>'), 'title must'],
    ['index.html', s => s.replace('href="/work/"', 'href="/missing-target/"'), 'broken internal link'],
    ['index.html', s => s.replace('width="1600"', ''), 'image missing dimensions'],
    ['admin-shell/index.html', s => s.replace('noindex,nofollow', 'index,follow'), 'must be noindex'],
    ['sitemap-0.xml', s => s.replace('<urlset ', '<urlset ').replace('</urlset>', '<url><loc>https://getaxiom.ca/admin-shell/</loc></url></urlset>'), 'nonindexable'],
    ['pricing/index.html', s => s.replace('What is the Local Launch Special?', 'Invented FAQ question'), 'FAQ schema is not present'],
    ['_routes.json', s => s.replace('"/services/*"', '"/services/*", "/services/conversion-sites/"'), 'overlapping'],
    ['index.html', s => s.replace('property="og:image:width" content="1200"', 'property="og:image:width" content="640"'), 'social image dimensions'],
    ['index.html', s => s.replace('"addressLocality":"Kitchener"', '"addressLocality":"Toronto"'), 'LocalBusiness NAP'],
    ['about/index.html', s => s.replace('"item":"https://getaxiom.ca/"', '"item":"invalid-url"'), 'invalid breadcrumb URL'],
    ['index.html', s => s.replace('"thumbnailUrl":"https://getaxiom.ca/film/axiom-film-poster.webp"', '"thumbnailUrl":"https://getaxiom.ca/axiomtransparentlogo.webp"'), 'thumbnail differs'],
    ['robots.txt', s => s + '\nDisallow: /api/\n', 'discovery of private-page noindex'],
  ];
  for (const [file, mutate, expected] of cases) {
    const path = join(fixture, file); const original = readFileSync(path, 'utf8');
    const changed = mutate(original); assert.notEqual(changed, original, `mutation applies: ${file}`);
    try {
      writeFileSync(path, changed);
      const result = run();
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert(result.stderr.includes(expected), `${file}: ${result.stderr}`);
    } finally { writeFileSync(path, original); }
  }
  assert.equal(run().status, 0);
});
