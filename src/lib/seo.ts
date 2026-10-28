import { packages } from '../content/pricing';

export const SITE_NAME = 'Axiom Web';
export const SITE_URL = 'https://getaxiom.ca';
export const SITE_TAGLINE =
  'Kitchener-Waterloo web design studio building clear, fast websites for local businesses, with published pricing and launch in two to four weeks.';
export const DEFAULT_OG_IMAGE = '/social/home.png';
export const DEFAULT_SEO_DESCRIPTION = SITE_TAGLINE;
export const SITE_EMAIL = 'aidanmageebusiness@gmail.com';
export const SITE_TELEPHONE = '+12267531833';
export const SITE_PHONE_DISPLAY = '(226) 753-1833';
export const SITE_LOCATION = 'Kitchener-Waterloo, Ontario';

export type SeoRouteMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
};

export type Crumb = { name: string; url: string };

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

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const breadcrumbSchema = (items: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${toCanonicalUrl(items[items.length - 1]?.url)}#breadcrumb`,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: toCanonicalUrl(item.url),
  })),
});

// One entity describes the studio; service areas are not branch offices.
export const SERVICE_AREAS = ['Kitchener', 'Waterloo', 'Cambridge', 'Guelph', 'Hamilton'].map((name) => ({
  '@type': 'City',
  name,
  containedInPlace: { '@type': 'AdministrativeArea', name: 'Ontario, Canada' },
}));

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  '@id': ORG_ID,
  name: SITE_NAME,
  alternateName: ['Axiom', 'Get Axiom', 'getaxiom.ca'],
  url: toCanonicalUrl('/'),
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/social/home.png`,
  email: SITE_EMAIL,
  telephone: SITE_TELEPHONE,
  description: SITE_TAGLINE,
  slogan: 'Clear, fast websites for local businesses.',
  priceRange: 'CAD $900+',
  currenciesAccepted: 'CAD',
  knowsAbout: ['Web design', 'Website development', 'Website redesign', 'Local SEO', 'Mobile-first design'],
  founder: [
    { '@type': 'Person', '@id': `${SITE_URL}/about/#aidan-magee`, name: 'Aidan Magee' },
    { '@type': 'Person', '@id': `${SITE_URL}/about/#riley-hinsperger`, name: 'Riley Hinsperger' },
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
  areaServed: SERVICE_AREAS,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: SITE_TELEPHONE,
    email: SITE_EMAIL,
    areaServed: 'CA',
    availableLanguage: ['en'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Website packages',
    url: toCanonicalUrl('/pricing'),
    itemListElement: packages.map((pkg) => ({
      '@type': 'Offer',
      name: pkg.name,
      description: pkg.summary,
      url: `${toCanonicalUrl('/pricing')}#${pkg.key}`,
      ...(pkg.priceValue
        ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: pkg.priceValue, priceCurrency: 'CAD' } }
        : {}),
    })),
  },
} as const;

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  alternateName: ['Axiom', 'Get Axiom', 'getaxiom.ca'],
  url: toCanonicalUrl('/'),
  description: SITE_TAGLINE,
  inLanguage: 'en-CA',
  publisher: { '@id': ORG_ID },
} as const;

export const webPageSchema = (page: {
  type?: string;
  url: string;
  name: string;
  description: string;
  image: string;
  hasBreadcrumb: boolean;
}) => ({
  '@context': 'https://schema.org',
  '@type': page.type || 'WebPage',
  '@id': `${page.url}#webpage`,
  url: page.url,
  name: page.name,
  description: page.description,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-CA',
  primaryImageOfPage: { '@type': 'ImageObject', url: page.image, width: 1200, height: 630 },
  ...(page.hasBreadcrumb ? { breadcrumb: { '@id': `${page.url}#breadcrumb` } } : {}),
});

export const serviceSchema = (service: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  audience?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${toCanonicalUrl(service.path)}#service`,
  name: service.name,
  serviceType: service.serviceType || 'Web design and development',
  description: service.description,
  url: toCanonicalUrl(service.path),
  provider: { '@id': ORG_ID },
  areaServed: SERVICE_AREAS,
  ...(service.audience ? { audience: { '@type': 'BusinessAudience', name: service.audience } } : {}),
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'CAD',
    lowPrice: Math.min(...packages.flatMap((pkg) => (pkg.priceValue ? [pkg.priceValue] : []))),
    offerCount: packages.length,
    url: toCanonicalUrl('/pricing'),
  },
});

export const faqJsonLd = (items: ReadonlyArray<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

export const personSchema = (person: { id: string; name: string; role: string; bio: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/about/#${person.id}`,
  name: person.name,
  jobTitle: person.role.replace(/^Co-founder · /, 'Co-founder, '),
  description: person.bio,
  worksFor: { '@id': ORG_ID },
  url: `${toCanonicalUrl('/about')}#${person.id}`,
});

export const FILM_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  '@id': `${SITE_URL}/about/#film`,
  name: 'Built to the pixel.',
  description: 'A 32-second Axiom Web studio film introducing our approach to considered, carefully built websites.',
  thumbnailUrl: `${SITE_URL}/film/axiom-film-poster.webp`,
  contentUrl: `${SITE_URL}/film/axiom-built-to-the-pixel-1080.mp4`,
  uploadDate: '2026-09-27',
  duration: 'PT32S',
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
};

export const itemListSchema = (name: string, items: Array<{ name: string; url: string; description: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'CreativeWork', name: item.name, url: item.url, description: item.description, creator: { '@id': ORG_ID } },
  })),
});

export const SEO_ROUTES = {
  home: {
    title: 'Web Design in Kitchener-Waterloo | Axiom Web',
    description:
      'Axiom Web designs clear, fast websites for local businesses in Kitchener, Waterloo and across Ontario. Published pricing from CAD $900 and launch in 2–4 weeks.',
    canonicalPath: '/',
  },
  services: {
    title: 'Web Design Services for Local Businesses',
    description:
      'Local business websites, conversion-focused web design and website redesigns from a founder-led Kitchener-Waterloo studio. See what each service includes.',
    canonicalPath: '/services',
  },
  work: {
    title: 'Web Design Portfolio | Client Sites and Concepts',
    description:
      'A live client website and clearly labelled concept builds for home services, clinics, salons, restaurants and law firms. See how we structure business sites.',
    canonicalPath: '/work',
  },
  pricing: {
    title: 'Website Pricing | Packages from CAD $900',
    description:
      'Published website pricing: Local Launch Special from CAD $900, Local Business Website from CAD $1,200, Expanded Website from CAD $1,500, or a custom quote.',
    canonicalPath: '/pricing',
  },
  agencies: {
    title: 'White-Label Web Development for Agencies | Axiom Web',
    description:
      'Extra hands for agencies: page builds, fixes and small sites delivered under your name. Fixed quote within 24 hours, CAD 50 an hour, NDA by default.',
    canonicalPath: '/agencies',
  },
  approach: {
    title: 'Our Web Design Process | Launch in 2–4 Weeks',
    description:
      'How a website project runs with Axiom Web: review, written scope, design and build, then launch and support. Clear steps, fixed price and two revision rounds.',
    canonicalPath: '/approach',
  },
  about: {
    title: 'About Axiom Web | Founder-Led Web Design Studio',
    description:
      'Meet Aidan Magee and Riley Hinsperger, co-founders of Axiom Web, a Kitchener-Waterloo web design studio and the web-focused subsidiary of Axiom International.',
    canonicalPath: '/about',
  },
  contact: {
    title: 'Contact Axiom Web | Kitchener-Waterloo Web Design',
    description:
      'Call (226) 753-1833, email or message Axiom Web. Based in Kitchener-Waterloo and working with businesses across Ontario. We reply within one business day.',
    canonicalPath: '/contact',
  },
  startProject: {
    title: 'Start a Website Project | Get a Quote',
    description:
      'Tell us about your business and website. We reply within one business day with the right package, a clear price and the next step. No obligation.',
    canonicalPath: '/start-a-project',
  },
  webDesign: {
    title: 'Web Design Service Areas in Ontario',
    description:
      'Axiom Web serves Kitchener, Waterloo, Cambridge, Guelph and Hamilton from our Kitchener-Waterloo studio. Local website planning guidance for each area.',
    canonicalPath: '/web-design',
  },
  industries: {
    title: 'Website Design by Industry',
    description:
      'What a strong website needs for contractors, clinics, salons, restaurants and professional firms, with relevant examples and the package that usually fits.',
    canonicalPath: '/industries',
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Read how Axiom Web handles information submitted through getaxiom.ca, project intake forms, contact requests, analytics, and related website services.',
    canonicalPath: '/privacy',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Read the terms governing use of getaxiom.ca and Axiom Web services, including project timelines, payment terms, intellectual property, and Ontario law.',
    canonicalPath: '/terms',
  },
  start: {
    title: 'Start a Project',
    description: 'This address has moved. Continue to the Axiom Web project form to send your project details.',
    canonicalPath: '/start-a-project',
    noIndex: true,
  },
  process: {
    title: 'Our Process',
    description: 'This address has moved. Continue to the Axiom Web process page to see how a website project runs.',
    canonicalPath: '/approach',
    noIndex: true,
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you were looking for could not be found. Use the links to continue.',
    canonicalPath: '/404',
    noIndex: true,
  },
  audit: {
    title: 'Website Audit',
    description: 'A focused review of clarity, structure, and conversion opportunities.',
    canonicalPath: '/admin/audit',
    noIndex: true,
  },
} as const satisfies Record<string, SeoRouteMeta>;
