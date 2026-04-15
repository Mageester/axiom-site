export const SITE_NAME = 'Axiom';
export const SITE_URL = 'https://getaxiom.ca';
export const DEFAULT_OG_IMAGE = '/og-default.jpg';
export const DEFAULT_SEO_DESCRIPTION = 'Premium web design and development for local service businesses.';
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
    return title?.trim() || 'Axiom';
};

export const toCanonicalUrl = (canonicalPath?: string) => {
    if (!canonicalPath) return SITE_URL;
    return new URL(canonicalPath, SITE_URL).toString();
};

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Axiom Infrastructure",
  "url": "https://getaxiom.ca",
  "telephone": "(226) 753-1833",
  "email": "contact@getaxiom.ca",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kitchener",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "areaServed": [
    "Kitchener", "Waterloo", "Guelph", 
    "Cambridge", "Ontario"
  ],
  "description": "Premium web design and development for Ontario service businesses.",
  "priceRange": "$$"
} as const;

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Axiom Infrastructure",
  "url": "https://getaxiom.ca"
} as const;

export const HOME_JSON_LD = {
    '@context': 'https://schema.org',
    '@graph': [LOCAL_BUSINESS_SCHEMA, WEBSITE_SCHEMA],
} as const;

export const SEO_ROUTES = {
    home: {
        title: 'Premium Web Design for Ontario Businesses | Axiom',
        description: 'Axiom builds fast, clear websites for Ontario businesses. You own it outright — no monthly fees. Based in Kitchener. Reply within one business day.',
        canonicalPath: '/',
    },
    work: {
        title: 'Web Design Portfolio | Axiom',
        description: 'See websites Axiom has built for service businesses across Ontario. Roofing, landscaping, restaurants, and more. Clear, fast, conversion-focused.',
        canonicalPath: '/work',
    },
    concepts: {
        title: 'Concept Projects | Axiom',
        description: 'See concept builds for HVAC, roofing, and landscaping websites designed to convert more local leads.',
        canonicalPath: '/work',
    },
    pricing: {
        title: 'Web Design Pricing Ontario | Axiom',
        description: 'Transparent web design pricing for Ontario businesses. Three tiers starting at $1,200. Full ownership, fast delivery, no hidden fees.',
        canonicalPath: '/pricing',
    },
    services: {
        title: 'Web Design Services | Axiom',
        description: 'Web design services for Ontario businesses that need a clear offer, proof, and a fast path to contact.',
        canonicalPath: '/pricing',
    },
    about: {
        title: 'About Axiom | Ontario Web Agency',
        description: 'Axiom Infrastructure is an Ontario-based web agency focused on one thing: websites that earn trust and get businesses contacted. Senior-led, selective, precise.',
        canonicalPath: '/about',
    },
    approach: {
        title: 'Our Approach to Web Design | Axiom',
        description: 'Learn how Axiom approaches web design — clarity first, proof early, one clear path to contact. Built for businesses that need results, not decoration.',
        canonicalPath: '/approach',
    },
    process: {
        title: 'Our Build Process | Axiom',
        description: 'Axiom\'s build process runs in four clear stages from review to launch. You know what\'s happening at every step.',
        canonicalPath: '/process',
    },
    startProject: {
        title: 'Start a Project | Axiom',
        description: 'Start a project with Axiom. Share your scope and we\'ll reply within one business day with exactly what your business needs.',
        canonicalPath: '/start-a-project',
    },
    audit: {
        title: 'Free Website Audit | Axiom',
        description: 'Get a free website audit from Axiom. We\'ll review your current site and tell you exactly what it\'s costing you — within 24 hours.',
        canonicalPath: '/admin/audit',
        noIndex: true,
    },
    privacy: {
        title: 'Privacy Policy | Axiom',
        description: 'Privacy policy for the Axiom website and contact forms.',
        canonicalPath: '/privacy',
    },
    terms: {
        title: 'Terms of Service | Axiom',
        description: 'Terms for using the Axiom website and services.',
        canonicalPath: '/terms',
    },
    notFound: {
        title: 'Page not found | Axiom',
        description: 'The page you requested is not available. Use the main links to continue.',
        canonicalPath: '/404',
        noIndex: true,
    },
} as const satisfies Record<string, SeoRouteMeta>;


