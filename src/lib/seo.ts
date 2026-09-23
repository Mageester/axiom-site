export const SITE_NAME = 'Axiom Web';
export const SITE_TAGLINE = 'High-trust websites for serious local businesses that need clearer offers, stronger proof, and easier inquiries.';
export const SITE_URL = 'https://getaxiom.ca';
export const DEFAULT_OG_IMAGE = '/og-image.png';
export const DEFAULT_SEO_DESCRIPTION = SITE_TAGLINE;
export const SITE_EMAIL = 'aidanmageebusiness@gmail.com';
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
  if (!canonicalPath) return `${SITE_URL}/`;
  const url = new URL(canonicalPath, SITE_URL);
  if (url.pathname !== '/') {
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
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
    item: toCanonicalUrl(item.url),
  })),
});

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: toCanonicalUrl('/'),
  logo: `${SITE_URL}/axiomtransparentlogo.webp`,
  image: `${SITE_URL}/og-image.png`,
  email: SITE_EMAIL,
  telephone: SITE_TELEPHONE,
  description: SITE_TAGLINE,
  founder: [
    { '@type': 'Person', name: 'Aidan Magee' },
    { '@type': 'Person', name: 'Riley Hinsperger' },
  ],
  parentOrganization: {
    '@type': 'Organization',
    '@id': 'https://axiominternational.ca/#organization',
    name: 'Axiom International',
    url: 'https://axiominternational.ca/',
  },
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
  url: toCanonicalUrl('/'),
  logo: `${SITE_URL}/axiomtransparentlogo.webp`,
  image: `${SITE_URL}/og-image.png`,
  email: SITE_EMAIL,
  telephone: SITE_TELEPHONE,
  description: SITE_TAGLINE,
  founder: [
    { '@type': 'Person', name: 'Aidan Magee' },
    { '@type': 'Person', name: 'Riley Hinsperger' },
  ],
  parentOrganization: {
    '@type': 'Organization',
    '@id': 'https://axiominternational.ca/#organization',
    name: 'Axiom International',
    url: 'https://axiominternational.ca/',
  },
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
  url: toCanonicalUrl('/'),
  description: SITE_TAGLINE,
  publisher: {
    '@id': `${SITE_URL}/#organization`,
  },
} as const;

export const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Axiom Web Services',
  url: toCanonicalUrl('/services'),
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
  provider: {
    '@id': `${SITE_URL}/#organization`,
  },
  areaServed: 'Canada',
  url: toCanonicalUrl(`/services/${service.slug}`),
});

export const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  additionalType: 'https://schema.org/ProfessionalService',
  name: SITE_NAME,
  url: toCanonicalUrl('/'),
  logo: 'https://getaxiom.ca/axiomtransparentlogo.webp',
  image: 'https://getaxiom.ca/og-image.png',
  description:
    'High-trust websites for established local businesses across Kitchener-Waterloo, Cambridge, Guelph, Hamilton, and Canada.',
  email: SITE_EMAIL,
  telephone: '+1-226-753-1833',
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
  founder: [
    { '@type': 'Person', name: 'Aidan Magee' },
    { '@type': 'Person', name: 'Riley Hinsperger' },
  ],
  parentOrganization: {
    '@type': 'Organization',
    '@id': 'https://axiominternational.ca/#organization',
    name: 'Axiom International',
    url: 'https://axiominternational.ca/',
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
          name: 'Local Business Website',
          description: 'Recommended local business website package with up to three pages. From CAD $1,200.',
        },
        price: '1200',
        priceCurrency: 'CAD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Expanded Website',
          description: 'Straightforward website package with up to five pages. From CAD $1,500.',
        },
        price: '1500',
        priceCurrency: 'CAD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Local Launch Special',
          description: 'Introductory one-page websites with up to six sections for very small local businesses. From CAD $900.',
        },
        price: '900',
        priceCurrency: 'CAD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom',
          description: 'Custom quoted work for e-commerce, databases, custom booking systems, customer accounts, migrations, and complex requirements.',
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
  url: toCanonicalUrl('/pricing'),
  areaServed: 'Waterloo Region, Ontario',
  offers: [
    {
      '@type': 'Offer',
      name: 'Local Business Website',
      description:
        'Recommended local business website package with up to three pages. From CAD $1,200.',
      priceCurrency: 'CAD',
      price: '1200',
    },
    {
      '@type': 'Offer',
      name: 'Expanded Website',
      description: 'Straightforward website package with up to five pages. From CAD $1,500.',
      priceCurrency: 'CAD',
      price: '1500',
    },
    {
      '@type': 'Offer',
      name: 'Local Launch Special',
      description: 'Introductory one-page websites with up to six sections for very small local businesses. From CAD $900.',
      priceCurrency: 'CAD',
      price: '900',
    },
    {
      '@type': 'Offer',
      name: 'Custom',
      description: 'Custom quoted work for e-commerce, databases, custom booking systems, customer accounts, migrations, and complex requirements.',
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
      name: 'What is the Local Launch Special?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is an introductory package from CAD $900 for very small local businesses that need a straightforward professional presence: one page with up to six sections. Existing third-party booking links can be connected.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Local Business Website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is the recommended package from CAD $1,200 for a normal independent local business. It includes up to three pages, typically Home, Services, and Contact, with a gallery and clear inquiry paths where appropriate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Expanded Website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is from CAD $1,500 for businesses that need more content but still have a straightforward website requirement. The scope is up to five pages and can include About, Gallery, Services, and Contact.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does every standard package include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every standard package includes custom responsive design and development, mobile optimization, first-year basic hosting, domain connection, SEO basics, applicable existing booking-platform integration, light editing of client-supplied text, client-supplied logo and images, launch testing, two consolidated revision rounds, and thirty days of post-launch defect support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the price include booking software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An existing booking platform can be connected when applicable. Booksy and other booking platforms remain the client account and expense. Custom booking systems or software are quoted as Custom.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is Custom needed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom is required for e-commerce, databases, custom booking systems or software, customer accounts, substantial migrations, or unusual and technically complex requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'How are payments handled?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fifty percent is due after the scope is approved and the agreement is signed. The remaining fifty percent is due after approval of the finished staging site and before public launch.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after the first year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Basic hosting starts at CAD $120 per year after year one, unless a documented handoff is provided where appropriate. Domain registration renewal is client-owned and billed by the registrar at its actual price.',
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
        text: 'You deal with the same two people from first call to launch. Pricing is posted publicly, the package scope is defined up front, and the launch path is clear before work begins.',
      },
    },
  ],
} as const;

export const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: toCanonicalUrl('/about'),
  name: 'About Axiom Web',
  description:
    'Aidan Magee and Riley Hinsperger are the co-founders of Axiom International and Axiom Web, its web-focused subsidiary. Together, they build fast, conversion-focused websites for established businesses in Kitchener-Waterloo and across Canada.',
  mainEntity: ORGANIZATION_SCHEMA,
} as const;

export const PROCESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How Axiom Builds a Website',
  description: 'A clear website process from first review to launch: Review, Scope, Build, and Launch. Standard packages include launch testing and thirty days of post-launch defect support.',
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
      text: 'We run launch checks, connect the domain, and hand over a live site. Standard packages include thirty days of post-launch defect support.',
    },
  ],
} as const;

export const APPROACH_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Axiom Web Approach',
  url: toCanonicalUrl('/approach'),
  description:
    'A plain-language website approach covering strategy, structure, design, development, launch checks, and ongoing support.',
  mainEntity: ORGANIZATION_SCHEMA,
} as const;

export const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Axiom Web',
  url: toCanonicalUrl('/contact'),
  description: 'Start a web design project, send project details, or reach Axiom Web by email or phone.',
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: toCanonicalUrl('/'),
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
  url: toCanonicalUrl('/start-a-project'),
  description: 'Send project details for a Local Launch Special, Local Business Website, Expanded Website, or Custom project. Axiom replies within one business day.',
  mainEntity: ORGANIZATION_SCHEMA,
  potentialAction: {
    '@type': 'CommunicateAction',
    name: 'Send project details',
    target: toCanonicalUrl('/start-a-project'),
  },
} as const;

export const WORK_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Axiom Web - Web Design Portfolio',
  url: toCanonicalUrl('/work'),
  description:
    'Demonstration builds across legal, medical, trades, and retail showing how serious business sites can guide visitors toward inquiries.',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: toCanonicalUrl('/'),
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
    title: 'Web Design Pricing | Local Packages | Axiom Web',
    description:
      'Clear web design pricing for local businesses. Local Launch Special from CAD $900, Local Business Website from CAD $1,200, Expanded Website from CAD $1,500, or Custom.',
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
      'A clear four-stage website process from first review to launch. Standard packages include launch testing and thirty days of post-launch defect support.',
    canonicalPath: '/process',
  },
  start: {
    title: 'Start a Project | Axiom Web',
    description:
      'Send project details for a Local Launch Special, Local Business Website, Expanded Website, or Custom project. We reply with a clear next step within one business day.',
    canonicalPath: '/start-a-project',
    noIndex: true,
  },
  startProject: {
    title: 'Start a Project | Axiom Web',
    description:
      'Send project details for a Local Launch Special, Local Business Website, Expanded Website, or Custom project. We reply with a clear next step within one business day.',
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
    description: 'Read how Axiom Web handles information submitted through getaxiom.ca, project intake forms, contact requests, analytics, and related website services.',
    canonicalPath: '/privacy',
  },
  terms: {
    title: 'Terms of Service | Axiom Web',
    description: 'Read the terms governing use of getaxiom.ca and Axiom Web services, including project timelines, payment terms, intellectual property, and Ontario law.',
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
