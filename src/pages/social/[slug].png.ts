import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { cities } from '../../content/cities';
import { industries } from '../../content/industries';
import { services } from '../../content/services';
import { SEO_ROUTES } from '../../lib/seo';

type Card = { path: string; title: string; label: string };

// One 1200×630 share card per indexable page, generated at build time.
export function getStaticPaths() {
  const labels: Partial<Record<keyof typeof SEO_ROUTES, string>> = {
    home: 'Web design · Kitchener-Waterloo',
    services: 'Services',
    work: 'Work',
    pricing: 'Pricing',
    approach: 'Process',
    about: 'About',
    contact: 'Contact',
    startProject: 'Start a project',
    webDesign: 'Service areas',
    industries: 'Industries',
    privacy: 'Legal',
    terms: 'Legal',
  };
  const cards: Card[] = Object.entries(SEO_ROUTES)
    .filter(([key, page]) => !('noIndex' in page && page.noIndex) && key in labels)
    .map(([key, page]) => ({ path: page.canonicalPath, title: page.title, label: labels[key as keyof typeof labels]! }));

  for (const service of services) cards.push({ path: `/services/${service.slug}`, title: service.name, label: 'Services' });
  for (const industry of industries) cards.push({ path: `/industries/${industry.slug}`, title: `Websites for ${industry.name.toLowerCase()}`, label: 'Industries' });
  for (const city of cities) cards.push({ path: `/web-design/${city.slug}`, title: `Web design in ${city.name}, Ontario`, label: 'Service areas' });

  return cards.map((card) => ({
    params: { slug: card.path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home' },
    props: {
      label: card.label,
      title: card.title.replace(/\s*\|\s*Axiom Web$/, '').replace(/^Axiom Web\s*\|\s*/, '').replace(/ \| /g, ' · '),
    },
  }));
}

const escapeXml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

const wrap = (text: string, max: number) => {
  const lines: string[] = [''];
  for (const word of text.split(' ')) {
    const last = lines.length - 1;
    if ((lines[last] + ' ' + word).trim().length > max && lines[last]) lines.push(word);
    else lines[last] = (lines[last] + ' ' + word).trim();
  }
  return lines;
};

const FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', 'DejaVu Sans', sans-serif";

export const GET: APIRoute = async ({ props }) => {
  const title = props.title as string;
  const label = (props.label as string).toUpperCase();
  const lines = wrap(title, title.length > 44 ? 26 : 22).slice(0, 3);
  const size = lines.length > 2 ? 64 : 76;
  const lineHeight = size * 1.12;
  const top = 330 - ((lines.length - 1) * lineHeight) / 2;

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="cols" width="173.33" height="630" patternUnits="userSpaceOnUse" x="80">
        <path d="M0 0V630" fill="none" stroke="#ffffff" stroke-opacity="0.05"/>
      </pattern>
    </defs>
    <rect width="1200" height="630" fill="#0b0b0c"/>
    <rect width="1200" height="630" fill="url(#cols)"/>
    <text x="80" y="${top - size - 6}" fill="#8ea8ff" font-family="${FONT}" font-size="24" font-weight="600" letter-spacing="2.5">${escapeXml(label)}</text>
    ${lines
      .map(
        (line, i) =>
          `<text x="80" y="${top + i * lineHeight}" fill="#ffffff" font-family="${FONT}" font-size="${size}" font-weight="700" letter-spacing="-1.5">${escapeXml(line)}</text>`
      )
      .join('')}
    <rect x="80" y="520" width="1040" height="1" fill="#ffffff" fill-opacity="0.14"/>
    <text x="80" y="566" fill="#b6b5ae" font-family="${FONT}" font-size="24">Kitchener-Waterloo, Ontario · (226) 753-1833</text>
    <text x="1120" y="566" text-anchor="end" fill="#ffffff" font-family="${FONT}" font-size="24" font-weight="600">getaxiom.ca</text>
  </svg>`;

  // The original chrome lockup, not a redraw.
  const logo = await sharp('brand/source/axiom-logo-chrome.png').resize({ height: 68, kernel: 'lanczos3' }).toBuffer();
  const png = await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: 74, top: 62 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
