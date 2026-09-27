import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { load } from 'cheerio';
import sharp from 'sharp';

// Inspect every rendered page, including new routes; an allowlist hides regressions.
const dist = process.env.SEO_DIST_DIR || 'dist';
const origin = 'https://getaxiom.ca';
const failures = [];
const fail = (route, message) => failures.push(`${route}: ${message}`);
const normalize = text => text.replace(/\s+/g, ' ').trim();
const walk = dir => existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []) : [];
const routeFor = file => '/' + relative(dist, file).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '/');
const documents = new Map(walk(dist).map(file => [routeFor(file), { file, $: load(readFileSync(file, 'utf8')) }]));
const meta = ($, name) => $(`meta[name="${name}"], meta[property="${name}"]`).attr('content')?.trim() || '';
const blocked = /^\/(?:404|admin(?:-shell)?|api|account|campaigns|dashboard|functions|hunt|jobs|process|lead|leads|settings|start|triage|vault)(?:\/|$)/;
const indexable = new Set();
const seenTitles = new Map();
const seenDescriptions = new Map();
const links = new Map();
const localFile = url => join(dist, decodeURIComponent(new URL(url, origin).pathname));
const jsonObjects = value => !value || typeof value !== 'object' ? [] :
  [value, ...Object.values(value).flatMap(v => Array.isArray(v) ? v.flatMap(jsonObjects) : jsonObjects(v))];

if (!documents.size) fail('build', 'no HTML output found');
for (const [route, { $ }] of documents) {
  const robots = meta($, 'robots').toLowerCase().split(/\s*,\s*/);
  const noindex = robots.includes('noindex');
  if (!robots.includes('index') && !noindex) fail(route, 'missing explicit robots index policy');
  if (blocked.test(route) && !noindex) fail(route, 'private, redirect or error page must be noindex');
  if (noindex) continue;
  indexable.add(route);
  const canonical = origin + route;
  const title = normalize($('title').text());
  const description = meta($, 'description');
  if ($('title').length !== 1 || title.length < 15 || title.length > 65) fail(route, `title must be 15–65 characters (${title.length})`);
  if ($('meta[name="description"]').length !== 1 || description.length < 70 || description.length > 170) fail(route, `description must be 70–170 characters (${description.length})`);
  for (const [value, seen, name] of [[title, seenTitles, 'title'], [description, seenDescriptions, 'description']]) {
    if (seen.has(value)) fail(route, `duplicate ${name} with ${seen.get(value)}`);
    seen.set(value, route);
  }
  if ($('h1').length !== 1) fail(route, 'expected exactly one H1');
  if ($('main#main-content').length !== 1) fail(route, 'missing main landmark / skip-link destination');
  if ($('html').attr('lang') !== 'en-CA') fail(route, 'missing Canadian English language');
  if ($('link[rel="canonical"]').length !== 1 || $('link[rel="canonical"]').attr('href') !== canonical) fail(route, 'canonical must match its HTTPS trailing-slash route');
  if (meta($, 'og:url') !== canonical) fail(route, 'og:url must match canonical');
  for (const name of ['og:title', 'og:description', 'og:image', 'og:image:alt', 'og:site_name', 'og:locale', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) {
    if (!meta($, name)) fail(route, `missing ${name}`);
  }
  if (meta($, 'og:title') !== title || meta($, 'twitter:title') !== title) fail(route, 'social titles differ from page title');
  if (meta($, 'og:description') !== description || meta($, 'twitter:description') !== description) fail(route, 'social descriptions differ from page description');
  for (const name of ['og:image', 'twitter:image']) {
    const url = meta($, name);
    if (!url.startsWith(origin + '/') || !existsSync(localFile(url))) fail(route, `${name} must resolve to a local public image`);
  }
  const socialImage = meta($, 'og:image');
  if (socialImage.startsWith(origin + '/') && existsSync(localFile(socialImage))) {
    const image = await sharp(localFile(socialImage)).metadata();
    if (image.width !== Number(meta($, 'og:image:width')) || image.height !== Number(meta($, 'og:image:height'))) fail(route, 'declared social image dimensions differ from image');
  }
  let level = 0;
  $('main h1,main h2,main h3,main h4,main h5,main h6').each((_, el) => {
    const next = Number(el.tagName.slice(1));
    if (next > level + 1) fail(route, `heading skips H${level} to H${next}: ${normalize($(el).text()).slice(0,70)}`);
    level = next;
  });
  $('img').each((_, el) => {
    if ($(el).attr('alt') === undefined) fail(route, 'image missing alt attribute');
    if (!(Number($(el).attr('width')) > 0 && Number($(el).attr('height')) > 0)) fail(route, `image missing dimensions: ${$(el).attr('src')}`);
    if ($(el).attr('fetchpriority') === 'high' && $(el).attr('loading') === 'lazy') fail(route, 'high-priority image must not be lazy');
  });
  $('[src], source[srcset]').each((_, el) => {
    const paths = [$(el).attr('src'), ...($(el).attr('srcset') || '').split(',').map(s => s.trim().split(/\s/)[0])].filter(Boolean);
    for (const p of paths) if (p.startsWith('/') && !p.startsWith('//') && !existsSync(localFile(p))) fail(route, `missing asset: ${p}`);
  });
  const targets = new Set(); links.set(route, targets);
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!/^(\/|#|https:\/\/getaxiom\.ca(?:\/|$))/.test(href) || href.startsWith('//')) return;
    const target = new URL(href, canonical);
    if (target.origin !== origin) return;
    const pathname = decodeURIComponent(target.pathname);
    if (!/\.[a-z\d]+$/i.test(pathname) && !pathname.endsWith('/')) fail(route, `noncanonical internal link: ${href}`);
    const doc = documents.get(pathname);
    if (!doc && !existsSync(localFile(target.href))) fail(route, `broken internal link: ${href}`);
    if (doc) {
      targets.add(pathname);
      if (target.hash && !doc.$('[id]').toArray().some(e => doc.$(e).attr('id') === decodeURIComponent(target.hash.slice(1)))) fail(route, `broken fragment: ${href}`);
      if (!normalize($(el).text()) && !$(el).attr('aria-label') && !$(el).find('img[alt]').attr('alt')) fail(route, `link has no accessible name: ${href}`);
    }
  });
  const schemas = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try { schemas.push(...jsonObjects(JSON.parse($(el).text()))); }
    catch (e) { fail(route, `invalid JSON-LD: ${e.message}`); }
  });
  const ofType = type => schemas.filter(s => [s['@type']].flat().includes(type));
  if (!ofType('Organization').length || !ofType('WebSite').length) fail(route, 'missing shared business / website identity');
  const businesses = ofType('LocalBusiness');
  if (!businesses.length) fail(route, 'missing LocalBusiness identity');
  if (ofType('ProfessionalService').length) fail(route, 'deprecated ProfessionalService type');
  for (const business of businesses) {
    if (business['@id'] !== origin + '/#organization' || business.url !== origin + '/' ||
      business.name !== 'Axiom Web' || business.telephone !== '+12267531833' || business.email !== 'aidanmageebusiness@gmail.com' ||
      business.address?.addressLocality !== 'Kitchener' || business.address?.addressRegion !== 'ON' || business.address?.addressCountry !== 'CA' ||
      business.contactPoint?.telephone !== business.telephone || business.contactPoint?.email !== business.email) fail(route, 'inconsistent LocalBusiness NAP');
    if (business.founder?.map(f => f.name).sort().join('|') !== 'Aidan Magee|Riley Hinsperger' ||
      business.areaServed?.map(a => a.name).sort().join('|') !== 'Cambridge|Guelph|Hamilton|Kitchener|Waterloo') fail(route, 'inconsistent founders or service areas');
    for (const field of ['logo', 'image']) if (!business[field]?.startsWith(origin + '/') || !existsSync(localFile(business[field]))) fail(route, `missing business ${field}`);
  }
  $('a[href^="tel:"]').each((_, el) => { if ($(el).attr('href').replace(/[^\d+]/g, '') !== '+12267531833') fail(route, 'visible telephone differs from business identity'); });
  $('a[href^="mailto:"]').each((_, el) => { if ($(el).attr('href').slice(7).split('?')[0] !== 'aidanmageebusiness@gmail.com') fail(route, 'visible email differs from business identity'); });
  if (route !== '/' && !ofType('BreadcrumbList').length) fail(route, 'missing breadcrumb schema');
  for (const s of schemas) {
    if ([s['@type']].flat().some(type => ['AggregateRating','Review'].includes(type))) fail(route, 'unsupported review/rating schema');
    if (s['@id'] === origin + '/#organization' && s.name && (s.name !== 'Axiom Web' || s.telephone !== '+12267531833' || s.email !== 'aidanmageebusiness@gmail.com')) fail(route, 'inconsistent business identity');
  }
  const visible = normalize($('main').text());
  for (const faq of ofType('FAQPage')) for (const q of faq.mainEntity || []) {
    if (!visible.includes(normalize(q.name)) || !visible.includes(normalize(q.acceptedAnswer?.text || ''))) fail(route, `FAQ schema is not present in page content: ${q.name}`);
  }
  for (const b of ofType('BreadcrumbList')) {
    const items = b.itemListElement || [];
    if (items.at(-1)?.item !== canonical) fail(route, 'breadcrumb must end at canonical page');
    items.forEach((item,i) => {
      try {
        const destination = new URL(item.item);
        if (item.position !== i+1 || !item.name || destination.origin !== origin || !documents.has(destination.pathname)) fail(route, 'invalid breadcrumb sequence or destination');
      } catch { fail(route, 'invalid breadcrumb URL'); }
    });
  }
  for (const video of ofType('VideoObject')) {
    if (!$('video').length || !$('video source').toArray().some(e => origin + $(e).attr('src') === video.contentUrl)) fail(route, 'video schema does not match visible video');
    if (!existsSync(localFile(video.thumbnailUrl)) || !video.uploadDate || !/^PT\d+S$/.test(video.duration)) fail(route, 'incomplete video metadata');
    if (!$('video[poster], .ax-film-poster img').toArray().some(e => origin + ($(e).attr('poster') || $(e).attr('src')) === video.thumbnailUrl)) fail(route, 'video thumbnail differs from visible poster');
  }
  if (route === '/' && ($('video[preload="none"]').length !== 1 || !ofType('VideoObject').length)) fail(route, 'homepage film or video schema missing');
}

const sitemapIndex = join(dist, 'sitemap-index.xml');
const sitemapPaths = new Set();
if (!existsSync(sitemapIndex)) fail('sitemap', 'missing index');
else {
  for (const m of readFileSync(sitemapIndex, 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)) {
    if (!m[1].startsWith(origin + '/') || !existsSync(localFile(m[1]))) { fail('sitemap', `missing or noncanonical child sitemap: ${m[1]}`); continue; }
    for (const loc of readFileSync(localFile(m[1]), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)) {
      const url = new URL(loc[1]);
      if (url.origin !== origin || url.search || url.hash || !url.pathname.endsWith('/')) fail('sitemap', `noncanonical URL: ${loc[1]}`);
      if (sitemapPaths.has(url.pathname)) fail('sitemap', `duplicate URL: ${loc[1]}`);
      sitemapPaths.add(url.pathname);
      if (!indexable.has(url.pathname)) fail('sitemap', `nonindexable or missing page: ${loc[1]}`);
    }
  }
}
for (const route of indexable) if (!sitemapPaths.has(route)) fail(route, 'missing from sitemap');
const reachable = new Set();
const visit = route => { if (reachable.has(route)) return; reachable.add(route); for (const next of links.get(route) || []) visit(next); };
visit('/');
for (const route of indexable) if (!reachable.has(route)) fail(route, 'orphan: not reachable from homepage');
const robotsFile = join(dist, 'robots.txt');
const robots = existsSync(robotsFile) ? readFileSync(robotsFile, 'utf8') : '';
if (!robots.includes(`Sitemap: ${origin}/sitemap-index.xml`)) fail('robots', 'missing sitemap');
for (const line of robots.split('\n')) if (/^Disallow:\s*\/(?:\s*$|web-design|services|admin|account|dashboard|hunt|vault|triage|settings|lead|jobs|campaigns|api|functions)/.test(line)) fail('robots', 'blocks public content or discovery of private-page noindex');
const manifestFile = join(dist, 'site.webmanifest');
if (!existsSync(manifestFile)) fail('manifest', 'missing manifest');
else {
  try { for (const icon of JSON.parse(readFileSync(manifestFile, 'utf8')).icons) if (!existsSync(localFile(icon.src))) fail('manifest', `missing icon ${icon.src}`); }
  catch { fail('manifest', 'invalid JSON'); }
}
const headers = readFileSync(join(dist, '_headers'), 'utf8').replaceAll('\r\n', '\n');
if (!headers.includes('/_astro/*\n  Cache-Control: public, max-age=31536000, immutable')) fail('headers', 'hashed Astro assets need immutable cache');
for (const route of ['/admin-shell', '/admin-shell/*', '/404.html', '/api/*']) if (!headers.includes(`${route}\n  X-Robots-Tag: noindex`)) fail('headers', `missing noindex for ${route}`);
for (const host of ['axiom-site.pages.dev', ':version.axiom-site.pages.dev']) {
  if (!headers.includes(`https://${host}/*\n  X-Robots-Tag: noindex`)) fail('headers', `missing duplicate-host noindex for ${host}`);
}
const redirects = readFileSync(join(dist, '_redirects'), 'utf8');
if (!redirects.includes('/sitemap.xml /sitemap-index.xml 301')) fail('redirects', 'legacy submitted sitemap must redirect to the current index');
const functionRoutes = JSON.parse(readFileSync(join(dist, '_routes.json'), 'utf8'));
for (const kind of ['include', 'exclude']) for (const route of functionRoutes[kind]) {
  if (functionRoutes[kind].some(other => other !== route && other.endsWith('*') && route.startsWith(other.slice(0, -1)))) fail('routes', `overlapping ${kind} rule: ${route}`);
}
for (const [old,target] of [['/method','/approach/'],['/works','/work/'],['/infrastructure','/services/'],['/start','/start-a-project/'],['/process','/approach/'],['/services/custom-web-development','/services/conversion-sites/'],['/services/ai-integration','/services/rebuilds/'],['/services/digital-infrastructure','/services/local-business-websites/']]) {
  for (const suffix of ['', '/']) if (!redirects.includes(`${old}${suffix} ${target} 301`)) fail('redirects', `missing permanent alias ${old}${suffix}`);
}
// Opt in after deployment: hosting rules cannot be verified from Astro's output.
// Keep the production build deterministic and independent of network availability.
if (process.argv.includes('--live')) {
  const query = '?utm_source=seo-audit&value=a%20b';
  for (const route of indexable) {
    for (const protocol of ['http:', 'https:']) {
      const url = `${protocol}//www.getaxiom.ca${route}${query}`;
      try {
        const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
        const target = `${origin}${route}${query}`;
        if (response.status !== 301 || response.headers.get('location') !== target) {
          fail(url, `expected direct 301 to ${target}; got ${response.status} / ${response.headers.get('location')}`);
        }
        await response.body?.cancel();
      } catch (error) { fail(url, `live redirect check failed: ${error.message}`); }
    }
    try {
      const url = origin + route;
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
      const $ = load(await response.text());
      if (response.status !== 200) fail(url, `canonical page returned ${response.status}`);
      if ($('link[rel="canonical"]').attr('href') !== url) fail(url, 'live canonical differs from deployed route');
      if (/noindex/i.test(response.headers.get('x-robots-tag') || '') || /noindex/i.test(meta($, 'robots'))) {
        fail(url, 'production page is noindex');
      }
    } catch (error) { fail(route, `live canonical check failed: ${error.message}`); }
  }
  console.log(`Live checks completed: ${indexable.size} canonical pages and ${indexable.size * 2} www redirects, including query preservation.`);
  for (const path of ['/', '/web-design/kitchener/', '/api/auth/me']) {
    const url = 'https://axiom-site.pages.dev' + path;
    try {
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
      if (!/noindex/i.test(response.headers.get('x-robots-tag') || '')) fail(url, 'duplicate Pages host missing HTTP noindex');
      await response.body?.cancel();
    } catch (error) { fail(url, `live duplicate-host check failed: ${error.message}`); }
  }
}
if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):\n${failures.map(f => '- ' + f).join('\n')}`);
  process.exit(1);
}
console.log(`SEO audit passed: ${indexable.size} indexable pages, ${documents.size - indexable.size} noindex pages; sitemap, links, metadata, assets and structured data verified.`);
