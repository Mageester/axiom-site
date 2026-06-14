export const SITE_NAME = 'Axiom Web';
export const SITE_TAGLINE = 'High-trust websites for serious local businesses that need clearer offers, stronger proof, and easier inquiries.';
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
  const url = new URL(canonicalPath, SITE_URL);
  if (url.pathname !== '/') {
    url.pathname = url.pathname.replace(/\/+$/, '');
  }
  url.search = '';
  url.hash = '';
  return url.toString();
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
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/axiomtransparentlogo.webp`,
  image: `${SITE_URL}/og-image.png`,
  email: SITE_EMAIL,
  telephone: SITE_TELEPHONE,
  description: SITE_TAGLINE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kitchener',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
} as const;

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#local-business`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/axiomtransparentlogo.webp`,
  image: `${SITE_URL}/og-image.png`,
  email: SITE_EMAIL,
  telephone: SITE_TELEPHONE,
  priceRange: '$$',
  description: SITE_TAGLINE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kitchener',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  areaServed: [
    {
      '@type': 'AdministrativeArea',
      name: 'Waterloo Region, Ontario',
    },
    {
      '@type': 'Country',
      name: 'Canada',
    },
  ],
} as const;

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
  publisher: {
    '@id': `${SITE_URL}/#organization`,
  },
} as const;

export const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Axiom Web Services',
  url: `${SITE_URL}/services`,
  itemListElement: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Conversion Sites',
        description: 'Focused sites structured around clearer offers, visible proof, and easier inquiry paths.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Website Rebuilds',
        description: 'Rebuilds for existing sites that need clearer structure, sharper messaging, and careful launch planning.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Local Business Websites',
        description: 'High-trust local business sites built for clarity, proof, speed, and fast contact.',
      },
    },
  ],
} as const;

export const serviceJsonLd = (service: { shortTitle: string; summary: string; slug: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.shortTitle,
  description: service.summary,
  provider: ORGANIZATION_SCHEMA,
  areaServed: 'Canada',
  url: `${SITE_URL}/services/${service.slug}`,
});

export const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  additionalType: 'https://schema.org/ProfessionalService',
  name: SITE_NAME,
  url: 'https://getaxiom.ca/',
  logo: 'https://getaxiom.ca/axiomtransparentlogo.webp',
  image: 'https://getaxiom.ca/og-image.png',
  description:
    'High-trust websites for established local businesses across Kitchener-Waterloo, Cambridge, Guelph, Hamilton, and Canada.',
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
    'Custom web design',
    'Conversion-focused websites',
    'Business website design',
    'Website redesign',
    'Managed monthly websites',
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
          name: 'Managed Site Partnership',
          description: 'Monthly website path with hosting, ongoing updates, and support included. From $200/mo.',
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
          name: 'Ownership Build',
          description: 'Custom website purchased outright with code handoff at launch. From $3,500.',
        },
        price: '3500',
        priceCurrency: 'CAD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Scope',
          description: 'Scoped pricing for larger rebuilds, ecommerce, migrations, and integrations.',
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
      name: 'Managed Site Partnership',
      description:
        'Monthly website path with $0 down, hosting, ongoing updates, and support included. Ownership transfer available at month 12.',
      priceCurrency: 'CAD',
      price: '200',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '200',
        priceCurrency: 'CAD',
        billingDuration: 'P1M',
      },
    },
    {
      '@type': 'Offer',
      name: 'Ownership Build',
      description: 'Custom website purchased outright with complete code handoff at launch. Hosting scoped separately.',
      priceCurrency: 'CAD',
      price: '3500',
    },
    {
      '@type': 'Offer',
      name: 'Custom Scope',
      description: 'Scoped pricing for larger rebuilds, ecommerce, migrations, and integrations.',
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
      name: 'Why do most clients choose monthly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly gets the site live without a large upfront payment. Hosting, updates, and support are included, with an ownership transfer option at month 12.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in the monthly path?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A custom site up to 5 page layouts, managed hosting, ongoing content and design updates, support, and an ownership transfer option at month 12.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the ownership build?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You pay for the site upfront, starting at $3,500. Axiom builds it, launches it, and hands over the codebase at release.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does hosting work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hosting is included on the monthly path. Ownership builds can be hosted by Axiom or configured on the buyer preferred host.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is custom scope needed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom scope fits ecommerce, larger rebuilds, migrations, third-party integrations, or anything beyond a standard marketing site.',
      },
    },
    {
      '@type': 'Question',
      name: 'How are revisions handled?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Axiom reviews structure and copy before build, then refines the site during the project. Monthly clients also get ongoing updates after launch.',
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
        text: 'You deal with the same two people from first call to launch. Pricing is posted publicly. The launch path is defined up front, and monthly clients keep ongoing support after release.',
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
    'Two people. Clear roles. We build fast, conversion-focused websites for established businesses in Kitchener-Waterloo and across Canada.',
  mainEntity: ORGANIZATION_SCHEMA,
} as const;

export const PROCESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How Axiom Builds a Website',
  description: 'A clear website process from first review to launch: Review, Scope, Build, and Launch. Monthly clients keep support after the site goes live.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Week 1 - Review',
      text: 'We review the current site, the offer, and the points where buyers may lose trust. Then we decide what needs to change first.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Week 2 - Scope',
      text: 'We confirm the pages, contact paths, and priorities before design starts. Decisions happen here, not mid-build.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Weeks 2-3 - Build',
      text: 'We design, write, and test the full site. Layout and flow stay simple enough to ship clean.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Weeks 3-4 - Launch',
      text: 'We run launch checks, connect the domain, and hand over a live site. Monthly clients keep support from here on.',
    },
  ],
} as const;

export const APPROACH_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Axiom Web Approach',
  url: `${SITE_URL}/approach`,
  description:
    'A plain-language website approach covering strategy, structure, design, development, launch checks, and ongoing support.',
  mainEntity: ORGANIZATION_SCHEMA,
} as const;

export const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Axiom Web',
  url: `${SITE_URL}/contact`,
  description: 'Start a web design project, send project details, or reach Axiom Web by email or phone.',
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: SITE_EMAIL,
    telephone: '(226) 753-1833',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kitchener',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+1-226-753-1833',
      email: SITE_EMAIL,
      availableLanguage: ['en'],
    },
  },
} as const;

export const START_PROJECT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Start a Project with Axiom Web',
  url: `${SITE_URL}/start-a-project`,
  description: 'Send project details for monthly, ownership, or custom website work. Axiom replies within one business day.',
  mainEntity: ORGANIZATION_SCHEMA,
  potentialAction: {
    '@type': 'CommunicateAction',
    name: 'Send project details',
    target: `${SITE_URL}/start-a-project`,
  },
} as const;

export const WORK_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Axiom Web - Web Design Portfolio',
  url: 'https://getaxiom.ca/work',
  description:
    'Demonstration builds across legal, medical, trades, and retail showing how serious business sites can guide visitors toward inquiries.',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
} as const;

export const SEO_ROUTES = {
  home: {
    title: 'Web Design Kitchener-Waterloo | High-Trust Sites | Axiom Web',
    description:
      'High-trust web design for established local businesses in Kitchener-Waterloo and across Canada. Clearer offers, stronger proof, faster inquiries.',
    canonicalPath: '/',
  },
  work: {
    title: 'Web Design Portfolio | Demonstration Builds | Axiom Web',
    description:
      'Demonstration builds across legal, medical, trades, and retail. See how Axiom structures sites so buyers understand, trust, and inquire.',
    canonicalPath: '/work',
  },
  concepts: {
    title: 'Concept Projects | Axiom Web',
    description: 'Demonstration work exploring structure, hierarchy, proof placement, and conversion for future business websites.',
    canonicalPath: '/work',
  },
  pricing: {
    title: 'Web Design Pricing | Monthly or Ownership | Axiom Web',
    description:
      'Clear web design pricing. Monthly from $200/mo with $0 down, hosting included, or ownership builds from $3,500.',
    canonicalPath: '/pricing',
  },
  services: {
    title: 'Web Design Services | Conversion Sites & Rebuilds | Axiom Web',
    description:
      'Web design services for serious local businesses: conversion sites, local business websites, and rebuilds with clearer offers and stronger proof.',
    canonicalPath: '/services',
  },
  about: {
    title: 'About Us | Web Design Studio in Kitchener-Waterloo | Axiom Web',
    description:
      'Two people, clear roles, direct accountability. Axiom builds high-trust websites for established local businesses in Kitchener-Waterloo and Canada.',
    canonicalPath: '/about',
  },
  approach: {
    title: 'Our Approach | Axiom Web',
    description: 'A clear website approach for strategy, structure, design, development, launch checks, and ongoing support after the site goes live.',
    canonicalPath: '/approach',
  },
  process: {
    title: 'Our Web Design Process | 2-4 Weeks to Launch | Axiom Web',
    description:
      'A clear four-stage website process from first review to launch. Monthly clients keep support after the site goes live.',
    canonicalPath: '/process',
  },
  start: {
    title: 'Start a Project | Axiom Web',
    description:
      'Send project details for monthly, ownership, or custom website work. We reply with a clear next step within one business day.',
    canonicalPath: '/start-a-project',
    noIndex: true,
  },
  startProject: {
    title: 'Start a Project | Axiom Web',
    description:
      'Send project details for monthly, ownership, or custom website work. We reply with a clear next step within one business day.',
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
    title: 'Contact Axiom Web | Web Design Inquiry',
    description: 'Start a web design project, send project details, or reach Axiom by email or phone. Based in Kitchener-Waterloo and serving Canada.',
    canonicalPath: '/contact',
  },
  notFound: {
    title: 'Page Not Found | Axiom Web',
    description: 'Use the main links to continue, or head back home.',
    canonicalPath: '/404',
    noIndex: true,
  },
} as const satisfies Record<string, SeoRouteMeta>;
