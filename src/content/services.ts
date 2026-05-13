export type ServiceSlug = 'conversion-sites' | 'rebuilds' | 'local-business-websites';

export type Service = {
  slug: ServiceSlug;
  eyebrow: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  bestFor: string;
  outcomes: string[];
  includes: string[];
  pathIntent: string;
};

export const services: Service[] = [
  {
    slug: 'conversion-sites',
    eyebrow: 'CONVERSION SITES',
    title: 'A clearer path from visit to call.',
    shortTitle: 'Conversion Sites',
    summary:
      'For established service businesses that need the site to make the offer obvious and make contact easy.',
    description:
      'We structure the page hierarchy, calls to action, service copy, and mobile flow around how buyers actually decide. The result is a site that feels easier to trust and easier to act on.',
    bestFor: 'High-intent local services, professional firms, clinics, contractors, and owner-led teams.',
    outcomes: [
      'Offer and service hierarchy clarified before design starts',
      'Primary call, quote, booking, or intake path visible on every key page',
      'Mobile layout reviewed around real buyer behavior',
      'Performance, accessibility, and launch checks completed before release',
    ],
    includes: [
      'Core page structure',
      'Conversion-focused copy direction',
      'Responsive design and development',
      'Launch QA and analytics-ready events',
    ],
    pathIntent: 'conversion-site',
  },
  {
    slug: 'rebuilds',
    eyebrow: 'REBUILDS',
    title: 'Replace the weak parts without losing the ground you have.',
    shortTitle: 'Rebuilds',
    summary:
      'For businesses with an existing site that no longer matches the quality of the company behind it.',
    description:
      'A rebuild is not a cosmetic reset. We preserve what matters, remove what creates friction, and relaunch with cleaner structure, stronger messaging, and safer technical foundations.',
    bestFor: 'Teams with dated sites, unclear navigation, slow mobile pages, or a brand that has outgrown the current site.',
    outcomes: [
      'Current site, domain, content, and redirect risks reviewed first',
      'Priority pages rebuilt around credibility and lead flow',
      'Existing search value protected with launch planning',
      'Old contact paths consolidated into one serious intake route',
    ],
    includes: [
      'Site audit and migration map',
      'Information architecture reset',
      'Redirect and domain launch support',
      'Post-launch support path',
    ],
    pathIntent: 'rebuild',
  },
  {
    slug: 'local-business-websites',
    eyebrow: 'LOCAL BUSINESS SITES',
    title: 'A stronger digital front door for serious local companies.',
    shortTitle: 'Local Business Websites',
    summary:
      'For businesses that rely on trust, reputation, and fast decision-making before a buyer reaches out.',
    description:
      'We build local business sites that make the company easier to understand, easier to believe, and easier to contact. The emphasis is clarity, proof, speed, and calm commercial polish.',
    bestFor: 'Trades, clinics, hospitality, beauty, professional services, and service-area businesses.',
    outcomes: [
      'Services, geography, and buyer fit made clear quickly',
      'Reviews, credentials, photos, and examples placed where buyers look',
      'Contact and quote paths reduced to the fewest useful steps',
      'Ownership, support, and handoff terms explained plainly',
    ],
    includes: [
      'Local-service page strategy',
      'Trust and proof placement',
      'Mobile-first contact flow',
      'Technical SEO foundation',
    ],
    pathIntent: 'local-business',
  },
];

export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug);
