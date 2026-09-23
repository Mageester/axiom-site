import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const distDir = 'dist';
const siteUrl = 'https://getaxiom.ca';
const publicRoutePrefixes = ['/', '/about', '/approach', '/contact', '/pricing', '/privacy', '/services', '/start-a-project', '/terms', '/web-design', '/work'];
const sitemapBlockedPrefixes = [
  '/404',
  '/admin',
  '/admin-shell',
  '/api',
  '/campaigns',
  '/dashboard',
  '/functions',
  '/hunt',
  '/jobs',
  '/process',
  '/lead',
  '/leads',
  '/settings',
  '/start',
  '/triage',
  '/vault',
];

const schemaOptionalRoutes = new Set(['/privacy', '/terms']);
const failures = [];

const fail = (file, message) => {
  failures.push(`${file}: ${message}`);
};

const walkHtml = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walkHtml(path);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });
};

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return match?.[1] ?? '';
};

const contentFor = (html, selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const meta = html.match(new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${escaped}["'][^>]*>`, 'i'));
  return meta ? attr(meta[0], 'content').trim() : '';
};

const linkHref = (html, rel) => {
  const link = html.match(new RegExp(`<link\\s+[^>]*rel=["']${rel}["'][^>]*>`, 'i'));
  return link ? attr(link[0], 'href').trim() : '';
};

const textContent = (html, tag) => {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';
};

const routeForFile = (file) => {
  const rel = relative(distDir, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
};

const isPublicRoute = (route) =>
  publicRoutePrefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));

for (const file of walkHtml(distDir)) {
  const route = routeForFile(file);
  if (!isPublicRoute(route)) continue;

  const html = readFileSync(file, 'utf8');
  const title = textContent(html, 'title');
  const description = contentFor(html, 'description');
  const robots = contentFor(html, 'robots');
  const canonical = linkHref(html, 'canonical');
  const expectedCanonical = new URL(route === '/' ? '/' : `${route.replace(/\/+$/, '')}/`, siteUrl).toString();
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (!title) fail(route, 'missing title');
  if (title.length > 65) fail(route, `title is long (${title.length} chars)`);
  if (!description) fail(route, 'missing meta description');
  if (description.length < 70 || description.length > 170) {
    fail(route, `description should be 70-170 chars (${description.length})`);
  }
  if (!robots) fail(route, 'missing robots meta');
  if (!robots.includes('index') && !robots.includes('noindex')) fail(route, 'robots meta is ambiguous');
  if (!robots.includes('noindex') && canonical !== expectedCanonical) {
    fail(route, `canonical mismatch (${canonical || 'missing'} !== ${expectedCanonical})`);
  }
  if (!robots.includes('noindex') && h1Count !== 1) fail(route, `expected exactly one h1, found ${h1Count}`);

  for (const tag of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!contentFor(html, tag)) fail(route, `missing ${tag}`);
  }
  if (!robots.includes('noindex') && contentFor(html, 'og:url') !== expectedCanonical) {
    fail(route, `og:url mismatch (${contentFor(html, 'og:url') || 'missing'} !== ${expectedCanonical})`);
  }

  const jsonLdBlocks = Array.from(html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
  if (!robots.includes('noindex') && !schemaOptionalRoutes.has(route) && jsonLdBlocks.length === 0) fail(route, 'missing JSON-LD');
  for (const [, rawJson] of jsonLdBlocks) {
    try {
      JSON.parse(rawJson);
    } catch (error) {
      fail(route, `invalid JSON-LD (${error.message})`);
    }
  }
}

const sitemapPath = join(distDir, 'sitemap-index.xml');
if (!existsSync(sitemapPath)) {
  fail('sitemap', 'missing sitemap-index.xml');
} else {
  const sitemapIndex = readFileSync(sitemapPath, 'utf8');
  const sitemapUrls = Array.from(sitemapIndex.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
  const sitemapBodies = sitemapUrls.map((url) => {
    const localPath = url.replace(`${siteUrl}/`, '').replace(/^\//, '');
    const filePath = join(distDir, localPath);
    return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  });
  const sitemapText = [sitemapIndex, ...sitemapBodies].join('\n');
  const indexedPaths = Array.from(sitemapText.matchAll(/<loc>(.*?)<\/loc>/g), (match) => {
    try {
      return new URL(match[1]).pathname || '/';
    } catch {
      return '';
    }
  });

  for (const prefix of sitemapBlockedPrefixes) {
    if (indexedPaths.some((path) => path === prefix || path.startsWith(`${prefix}/`))) {
      fail('sitemap', `blocked route leaked: ${prefix}`);
    }
  }

  for (const route of ['/', '/about', '/approach', '/contact', '/pricing', '/privacy', '/services', '/start-a-project', '/terms', '/web-design/kitchener', '/work']) {
    const expected = new URL(route === '/' ? '/' : `${route.replace(/\/+$/, '')}/`, siteUrl).toString();
    if (!sitemapText.includes(expected)) fail('sitemap', `missing expected route: ${route}`);
  }

  for (const path of indexedPaths) {
    if (path !== '/' && !path.endsWith('/') && !path.endsWith('.xml')) fail('sitemap', `non-canonical URL shape: ${path}`);
  }
}

const robotsPath = join(distDir, 'robots.txt');
if (!existsSync(robotsPath)) {
  fail('robots', 'missing robots.txt');
} else {
  const robots = readFileSync(robotsPath, 'utf8');
  if (!robots.includes('Sitemap: https://getaxiom.ca/sitemap-index.xml')) {
    fail('robots', 'missing canonical sitemap declaration');
  }
}

if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('SEO audit passed.');
