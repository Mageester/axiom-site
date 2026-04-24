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
  '@type': 'LocalBusiness',
  additionalType: 'https://schema.org/ProfessionalService',
  name: SITE_NAME,
  url: 'https://getaxiom.ca/',
  image: 'https://getaxiom.ca/og-image.png',
  description: 'Custom web development, AI-enabled digital systems, and digital infrastructure for established businesses across Kitchener-Waterloo, Cambridge, and Guelph.',
  email: SITE_EMAIL,
  telephone: '+1-226-753-1833',
  foundingDate: '2025',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    value: 2,
  },
  areaServed: [
    {
      '@type': 'AdministrativeArea',
      name: 'Waterloo Region, Ontario',
    },
    {
      '@type': 'City',
      name: 'Guelph',
    },
  ],
  serviceType: [
    'Custom web development',
    'AI-enabled web systems',
    'Digital infrastructure',
  ],
  knowsAbout: [
    'Custom websites',
    'AI-enabled web systems',
    'Business process automation',
    'Digital infrastructure',
    'Web design',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+1-226-753-1833',
    email: SITE_EMAIL,
    availableLanguage: ['en'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Axiom Infrastructure Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Web Development',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI-Enabled Web Systems',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Digital Infrastructure',
        },
      },
    ],
  },
} as const;

export const PRICING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Web Design',
  provider: ORGANIZATION_SCHEMA,
  offers: [
    {
      '@type': 'Offer',
      name: 'Subscription',
      description: 'Starts at a monthly investment with hosting and support included',
      priceCurrency: 'CAD',
    },
    {
      '@type': 'Offer',
      name: 'One-time ownership',
      description: 'Starts at a scoped ownership investment with full handoff at launch',
      priceCurrency: 'CAD',
    },
    {
      '@type': 'Offer',
      name: 'E-commerce / rebuilds',
      price: '6500',
      description: 'Lump sum only',
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
    title: 'Custom Web Development | Kitchener-Waterloo | Axiom Infrastructure',
    description: 'Axiom Infrastructure designs custom websites and AI-enabled digital systems for established businesses across Kitchener-Waterloo, Cambridge, and Guelph.',
    canonicalPath: '/',
  },
  work: {
    title: 'Selected Work',
    description: 'Concept builds showing how Axiom structures clearer first impressions, faster decisions, and ongoing support.',
    canonicalPath: '/work',
  },
  concepts: {
    title: 'Concept Projects',
    description: 'Concept work exploring structure, hierarchy, and conversion for future builds.',
    canonicalPath: '/work',
  },
  pricing: {
    title: 'Pricing',
    description: 'Subscription-first pricing for businesses that want a premium web partner, a low-friction start, and a clear ownership path.',
    canonicalPath: '/pricing',
  },
  services: {
    title: 'Services',
    description: 'Web design and development services designed around clarity, trust, and conversion.',
    canonicalPath: '/pricing',
  },
  about: {
    title: 'About',
    description: 'Axiom Infrastructure serves established businesses that want a clearer first impression and ongoing support after launch.',
    canonicalPath: '/about',
  },
  approach: {
    title: 'Approach',
    description: 'A clear process. Tight hierarchy. Fewer decisions. Better outcomes.',
    canonicalPath: '/about',
  },
  process: {
    title: 'Process',
    description: 'A subscription-first process from discovery to launch, with support that continues after the site goes live.',
    canonicalPath: '/process',
  },
  start: {
    title: 'Start a Project',
    description: 'Share a project brief for monthly or one-time website work. We reply with a clear next step.',
    canonicalPath: '/start',
  },
  startProject: {
    title: 'Start a Project',
    description: 'Submit a project brief for a monthly or one-time website build. We reply with a clear next step.',
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
    description: 'Use this form for a quick question or short note. For project work, use the project intake page.',
    canonicalPath: '/contact',
  },
  notFound: {
    title: 'Page not found',
    description: "Use the main links to continue, or head back home.",
    canonicalPath: '/404',
    noIndex: true,
  },
} as const satisfies Record<string, SeoRouteMeta>;
