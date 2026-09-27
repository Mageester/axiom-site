import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { SEO_ROUTES } from '../../lib/seo';
import { cities } from '../../content/cities';
import { services } from '../../content/services';

export function getStaticPaths() {
  const pages = Object.entries(SEO_ROUTES)
    .filter(([key]) => !['concepts', 'process', 'start', 'audit', 'notFound'].includes(key))
    .map(([, page]) => ({ path: page.canonicalPath, title: page.title }));
  pages.push({ path: '/web-design', title: 'Web Design Service Areas in Ontario' });
  for (const city of cities) pages.push({ path: `/web-design/${city.slug}`, title: `Web Design in ${city.name}, Ontario` });
  for (const service of services) pages.push({ path: `/services/${service.slug}`, title: service.shortTitle });
  return pages.map(page => ({
    params: { slug: page.path.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home' },
    props: { title: page.title.replace(/(?:^Axiom Web\s*\|\s*|\s*\|\s*Axiom Web$)/g, '').replaceAll(' | ', ' — ') },
  }));
}

const escapeXml = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export const GET: APIRoute = async ({ props }) => {
  const words = (props.title as string).split(' ');
  const lines: string[] = [''];
  for (const word of words) {
    const last = lines.length - 1;
    if ((lines[last] + ' ' + word).trim().length > 31 && lines[last]) lines.push(word);
    else lines[last] = (lines[last] + ' ' + word).trim();
  }
  const logo = readFileSync('public/axiomtransparentlogo.webp');
  const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#0a0a0a"/>
    <path d="M72 180H1128" stroke="#33332f"/>
    ${lines.map((line, i) => `<text x="72" y="${285 + i * 80}" fill="#f2f0ea" font-family="Georgia,serif" font-size="62">${escapeXml(line)}</text>`).join('')}
    <text x="72" y="560" fill="#a8a49b" font-family="Arial,sans-serif" font-size="24">Kitchener-Waterloo, Ontario</text>
    <text x="1128" y="560" text-anchor="end" fill="#a8a49b" font-family="Arial,sans-serif" font-size="24">getaxiom.ca</text>
  </svg>`);
  const png = await sharp(text).composite([{ input: logo, left: 72, top: 70 }]).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
