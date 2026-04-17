export const SITE_NAME = 'Axiom Infrastructure';
export const SITE_TAGLINE = 'Websites built to convert. Not to decorate.';
export const SITE_URL = 'https://getaxiom.ca';
export const DEFAULT_OG_IMAGE = '/og-image.png';
export const DEFAULT_SEO_DESCRIPTION = SITE_TAGLINE;
export const SITE_EMAIL = 'contact@getaxiom.ca';
export const SITE_TELEPHONE = '+12267531833';

export type SeoRouteMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  noIndex?: boolean;
};

export const formatSeoTitle = (title?: string) => {
  const trimmed = title?.trim();
  if (!trimmed) return SITE_NAME;
  return trimmed.includes(SITE_NAME) ? trimmed : `${trimmed} | ${SITE_NAME}`;
};

export const toCanonicalUrl = (canonicalPath?: string) => {
  if (!canonicalPath) return SITE_URL;
  return new URL(canonicalPath, SITE_URL).toString();
};

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  email: SITE_EMAIL,
  telephone: '(226) 753-1833',
  description: SITE_TAGLINE,
} as const;

export const LOCAL_BUSINESS_SCHEMA = ORGANIZATION_SCHEMA;

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
} as const;

export const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
} as const;

export const PRICING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Web Design',
  provider: ORGANIZATION_SCHEMA,
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter',
      priceCurrency: 'CAD',
    },
    {
      '@type': 'Offer',
      name: 'Growth',
      priceCurrency: 'CAD',
    },
  ],
} as const;

export const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: ORGANIZATION_SCHEMA,
} as const;

export const SEO_ROUTES = {
  home: {
    title: 'Premium Web Design That Converts',
    description: SITE_TAGLINE,
    canonicalPath: '/',
  },
  work: {
    title: 'Selected Work',
    description: 'Axiom builds focused, conversion-led websites for businesses that need a clearer first impression.',
    canonicalPath: '/work',
  },
  concepts: {
    title: 'Concept Projects',
    description: 'Concept work exploring structure, hierarchy, and conversion for future builds.',
    canonicalPath: '/work',
  },
  pricing: {
    title: 'Pricing',
    description: 'Direct pricing for businesses that want a premium web partner and a clear scope.',
    canonicalPath: '/pricing',
  },
  services: {
    title: 'Services',
    description: 'Web design and development services designed around clarity, trust, and conversion.',
    canonicalPath: '/pricing',
  },
  about: {
    title: 'About',
    description: 'Axiom Infrastructure is a selective web design studio built around precision and trust.',
    canonicalPath: '/about',
  },
  approach: {
    title: 'Approach',
    description: 'A clear process. Tight hierarchy. Fewer decisions. Better outcomes.',
    canonicalPath: '/about',
  },
  process: {
    title: 'Process',
    description: 'A simple sequence from discovery to launch.',
    canonicalPath: '/process',
  },
  start: {
    title: 'Start a Project',
    description: 'Share the basics. We reply within one business day with the next step.',
    canonicalPath: '/start',
  },
  startProject: {
    title: 'Start a Project',
    description: 'Share your scope and move the work forward.',
    canonicalPath: '/start-a-project',
  },
  audit: {
    title: 'Website Audit',
    description: 'A focused review of clarity, structure, and conversion opportunities.',
    canonicalPath: '/admin/audit',
    noIndex: true,
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy policy for the Axiom website and contact forms.',
    canonicalPath: '/privacy',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms for using the Axiom website and services.',
    canonicalPath: '/terms',
  },
  contact: {
    title: 'Contact',
    description: 'Start a conversation with Axiom Infrastructure.',
    canonicalPath: '/contact',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you requested is not available.',
    canonicalPath: '/404',
    noIndex: true,
  },
} as const satisfies Record<string, SeoRouteMeta>;
