import type { APIRoute } from 'astro';
import { founders } from '../content/company';
import { cities } from '../content/cities';
import { industries } from '../content/industries';
import { packages } from '../content/pricing';
import { services } from '../content/services';
import { SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_TAGLINE, SITE_URL } from '../lib/seo';

// Plain-text summary for AI assistants and answer engines (llmstxt.org format).
export const GET: APIRoute = () => {
  const link = (title: string, path: string, note: string) => `- [${title}](${SITE_URL}${path}): ${note}`;
  const body = [
    '# Axiom Web',
    '',
    `> ${SITE_TAGLINE}`,
    '',
    `Axiom Web is a founder-led web design studio based in Kitchener-Waterloo, Ontario, Canada, and the web-focused subsidiary of Axiom International. It is run by its co-founders, ${founders.map((f) => f.name).join(' and ')}. Contact: ${SITE_PHONE_DISPLAY}, ${SITE_EMAIL}.`,
    '',
    '## Packages (CAD)',
    ...packages.map((pkg) => `- ${pkg.name}: ${pkg.priceValue ? `from ${pkg.price}` : 'quoted'}. ${pkg.scope}. ${pkg.summary}`),
    '',
    '## Services',
    ...services.map((s) => link(s.name, `/services/${s.slug}/`, s.cardSummary)),
    '',
    '## Industries',
    ...industries.map((i) => link(i.name, `/industries/${i.slug}/`, i.examples)),
    '',
    '## Service areas',
    ...cities.map((c) => link(`Web design in ${c.name}`, `/web-design/${c.slug}/`, c.focus)),
    '',
    '## Key pages',
    link('Pricing', '/pricing/', 'Package comparison, inclusions, payment terms and FAQ'),
    link('Process', '/approach/', 'Review, scope, design and build, launch and support; usually 2–4 weeks'),
    link('Work', '/work/', 'A live client website and clearly labelled concept builds'),
    link('About', '/about/', 'The founders and how the studio works'),
    link('Start a project', '/start-a-project/', 'Project inquiry form; replies within one business day'),
    link('Contact', '/contact/', 'Phone, email and message form'),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
