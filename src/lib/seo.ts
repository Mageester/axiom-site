export const SITE_NAME = 'Axiom Web';
export const SITE_TAGLINE = 'Custom web design and development for companies past the template stage.';
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

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/axiomtransparentlogo.webp`,
  email: SITE_EMAIL,
  telephone: '(226) 753-1833',
  description: SITE_TAGLINE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kitchener',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
} as const;

export const LOCAL_BUSINESS_SCHEMA = ORGANIZATION_SCHEMA;

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
} as const;

export const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  additionalType: 'https://schema.org/ProfessionalService',
  name: SITE_NAME,
  url: 'https://getaxiom.ca/',
  logo: 'https://getaxiom.ca/axiomtransparentlogo.webp',
  image: 'https://getaxiom.ca/og-image.png',
  description:
    'Custom web design and development for established businesses across Kitchener-Waterloo, Cambridge, and Guelph. Standard builds launch in 2-4 weeks and are checked against Core Web Vitals before release.',
  email: SITE_EMAIL,
  telephone: '+1-226-753-1833',
  priceRange: '$$',
  foundingDate: '2025',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kitchener',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
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
    'Conversion-focused web design',
    'Business website design',
    'Website redesign',
    'Monthly website subscription',
    'Website performance optimization',
  ],
  knowsAbout: [
    'Custom websites',
    'Core Web Vitals optimization',
    'Conversion-focused web design',
    'Business website design',
    'Web design Kitchener-Waterloo',
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
    name: 'Axiom Web Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Monthly Website Subscription',
          description: 'Custom website engagement with hosting, ongoing edits, and support. From $200/mo.',
        },
        price: '200',
        priceCurrency: 'CAD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '200',
          priceCurrency: 'CAD',
          billingDuration: 'P1M',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'One-Time Website Ownership',
          description: 'Full custom website with complete code handoff at launch. From $3,500.',
        },
        price: '3500',
        priceCurrency: 'CAD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'E-commerce & Website Rebuilds',
          description: 'Custom scoped pricing for online stores and larger rebuilds.',
        },
        priceCurrency: 'CAD',
      },
    ],
  },
} as const;

export const PRICING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom Web Design & Development',
  provider: ORGANIZATION_SCHEMA,
  url: 'https://getaxiom.ca/pricing',
  areaServed: 'Waterloo Region, Ontario',
  offers: [
    {
      '@type': 'Offer',
      name: 'Monthly Website Subscription',
      description:
        'Custom website with $0 down, hosting, ongoing edits, and support included. Full ownership available at month 12.',
      priceCurrency: 'CAD',
      price: '150',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '150',
        priceCurrency: 'CAD',
        billingDuration: 'P1M',
      },
    },
    {
      '@type': 'Offer',
      name: 'One-Time Website Ownership',
      description: 'Full custom website with complete code handoff at launch. Hosting scoped separately.',
      priceCurrency: 'CAD',
      price: '3500',
    },
    {
      '@type': 'Offer',
      name: 'E-commerce & Website Rebuilds',
      description: 'Custom scoped pricing for online stores and larger rebuilds.',
      priceCurrency: 'CAD',
    },
  ],
} as const;

export const PRICING_FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why lead with monthly pricing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most businesses do not want a $5K+ hit before they see results. Monthly lets you start for $0 down, get the site live, and pay as it earns.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in the monthly plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Up to 5 pages, hosting, ongoing edits, and priority support. Full ownership transfers at month 12 if you want it. Most clients stay monthly because the support keeps the site improving.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I want ownership instead?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pick the one-time ownership path. One payment from $3,500, full code handoff at launch, hosting scoped separately if you need it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does hosting work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly plans include hosting. Ownership clients can let us host it or move it to their own provider - either works.',
      },
    },
    {
      '@type': 'Question',
      name: 'What about e-commerce?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Stores and large rebuilds get a custom quote. Scope covers setup, migration, and integrations. One lump sum, no monthly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How are revisions handled?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Three rounds per build. Most projects do not use all three. Monthly clients get ongoing edits after launch.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I edit the site myself?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We build so basic text, photo, and page edits are easy to do without breaking anything.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Axiom different?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fast sites, real pricing, and support that does not stop at launch. Most standard builds go live in 2-4 weeks.',
      },
    },
  ],
} as const;

export const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: 'https://getaxiom.ca/about',
  name: 'About Axiom Web',
  description:
    'Two operators. Clear roles. We build fast, conversion-focused websites for established businesses in Kitchener-Waterloo and across Canada.',
  mainEntity: ORGANIZATION_SCHEMA,
} as const;

export const PROCESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How Axiom Builds a Website',
  description: 'Two to four weeks from first call to launch. Four stages: Review, Scope, Build, and Launch. Monthly clients keep support after the site goes live.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Week 1 – Review',
      text: 'We audit the current site, the offer, and the points where you are losing trust. Then we decide what has to change first.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Week 1 – Scope',
      text: 'We lock the pages, the call paths, and the priorities before design starts. Decisions happen here, not mid-build.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Weeks 2-3 – Build',
      text: 'We design, write, and test the full site. Layout and flow stay simple enough to ship clean.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Weeks 3-4 – Launch',
      text: 'We run launch checks, connect the domain, and hand over a live site. Monthly clients keep support from here on.',
    },
  ],
} as const;

export const WORK_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Axiom Web – Web Design Portfolio',
  url: 'https://getaxiom.ca/work',
  description:
    'Concept builds across legal, medical, trades, food service, and retail. Each one shows how a typical business site should be structured to convert visitors to booked calls.',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
} as const;

export const SEO_ROUTES = {
  home: {
    title: 'Custom Web Development | KW Region | Axiom Web',
    description:
      'Custom web design and development for businesses in Kitchener-Waterloo and across Canada. Standard builds launch in 2-4 weeks and are verified against Core Web Vitals.',
    canonicalPath: '/',
  },
  work: {
    title: 'Web Design Portfolio – Concept Builds | Axiom Web',
    description:
      'Concept builds across legal, medical, trades, and retail. See how Axiom structures sites that load fast and convert visitors to booked calls.',
    canonicalPath: '/work',
  },
  concepts: {
    title: 'Concept Projects | Axiom Web',
    description: 'Concept work exploring structure, hierarchy, and conversion for future builds.',
    canonicalPath: '/work',
  },
  pricing: {
    title: 'Website Pricing | Monthly & One-Time | Axiom Web',
    description:
      'Custom website pricing with no surprises. Monthly from $150 with hosting and support included. One-time ownership from $3,500. No sales call required.',
    canonicalPath: '/pricing',
  },
  services: {
    title: 'Web Design Services | Axiom Web',
    description:
      'Custom web design and development services built around clarity, trust, and conversion. Monthly or one-time ownership.',
    canonicalPath: '/pricing',
  },
  about: {
    title: 'About Axiom Web | Custom Web Design Studio',
    description:
      'Two operators. Clear roles. We build fast, conversion-focused websites for established businesses in Kitchener-Waterloo and across Canada.',
    canonicalPath: '/about',
  },
  approach: {
    title: 'Our Approach | Axiom Web',
    description: 'A clear process. Tight hierarchy. Fewer decisions. Better outcomes.',
    canonicalPath: '/about',
  },
  process: {
    title: 'Our Web Design Process | 2-4 Weeks to Launch | Axiom Web',
    description:
      'Four stages. Two to four weeks from first call to launch. Monthly clients keep support after the site goes live. No drift, no surprises.',
    canonicalPath: '/process',
  },
  start: {
    title: 'Start a Project | Axiom Web',
    description:
      'Share a project brief for monthly or one-time website work. We reply with a clear next step within one business day.',
    canonicalPath: '/start-a-project',
    noIndex: true,
  },
  startProject: {
    title: 'Start a Project | Axiom Web',
    description:
      'Submit a project brief for a monthly or one-time website build. We reply with a clear next step within one business day.',
    canonicalPath: '/start-a-project',
  },
  audit: {
    title: 'Website Audit | Axiom Web',
    description: 'A focused review of clarity, structure, and conversion opportunities.',
    canonicalPath: '/admin/audit',
    noIndex: true,
  },
  privacy: {
    title: 'Privacy Policy | Axiom Web',
    description: 'Privacy policy for the Axiom website and contact forms.',
    canonicalPath: '/privacy',
  },
  terms: {
    title: 'Terms of Service | Axiom Web',
    description: 'Terms for using the Axiom website and services.',
    canonicalPath: '/terms',
  },
  contact: {
    title: 'Contact | Axiom Web',
    description: 'Send a quick question or short note. For project work, use the project intake page.',
    canonicalPath: '/contact',
  },
  notFound: {
    title: 'Page Not Found | Axiom Web',
    description: 'Use the main links to continue, or head back home.',
    canonicalPath: '/404',
    noIndex: true,
  },
} as const satisfies Record<string, SeoRouteMeta>;
