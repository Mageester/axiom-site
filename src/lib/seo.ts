export const SITE_NAME = 'Axiom';
export const SITE_URL = 'https://getaxiom.ca';
export const DEFAULT_OG_IMAGE = '/og-image.png';
export const DEFAULT_SEO_DESCRIPTION = 'Axiom builds clear websites for established businesses. Service, proof, and contact stay easy to find.';
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
    const baseTitle = title?.trim() || 'Axiom';
    return /axiom/i.test(baseTitle) ? baseTitle : `${baseTitle} | ${SITE_NAME}`;
};

export const toCanonicalUrl = (canonicalPath?: string) => {
    if (!canonicalPath) return SITE_URL;
    return new URL(canonicalPath, SITE_URL).toString();
};

export const ORGANIZATION_SCHEMA = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: SITE_EMAIL,
    telephone: SITE_TELEPHONE,
    contactPoint: [
        {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: SITE_EMAIL,
            telephone: SITE_TELEPHONE,
        },
    ],
} as const;

export const WEBSITE_SCHEMA = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
} as const;

export const HOME_JSON_LD = {
    '@context': 'https://schema.org',
    '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
} as const;

export const SEO_ROUTES = {
    home: {
        title: 'Clear websites for established businesses',
        description: DEFAULT_SEO_DESCRIPTION,
        canonicalPath: '/',
    },
    work: {
        title: 'Selected work',
        description: 'Live and working examples that show the issue, the change, and the result.',
        canonicalPath: '/works',
    },
    process: {
        title: 'How the work runs',
        description: 'A four-step process from review to launch with clear checkpoints and no vague handoffs.',
        canonicalPath: '/method',
    },
    about: {
        title: 'About',
        description: 'Clear websites that explain the offer, surface proof, and make the next step obvious.',
        canonicalPath: '/about',
    },
    startProject: {
        title: 'Start a Project',
        description: 'A short intake for established businesses. Tell us what the business needs and we will reply within one business day.',
        canonicalPath: '/start-a-project',
    },
    contact: {
        title: 'Contact',
        description: 'Send a question or note about an existing site. We will reply within one business day.',
        canonicalPath: '/contact',
    },
    pricing: {
        title: 'Pricing',
        description: 'Website pricing for established businesses. Clear scope, no surprises, and a site you own.',
        canonicalPath: '/pricing',
    },
    services: {
        title: 'Services',
        description: 'Website packages for local businesses with clear scope, practical deliverables, and no noise.',
        canonicalPath: '/services',
    },
    concepts: {
        title: 'Concepts',
        description: 'Demo sites for HVAC, roofing, and landscaping businesses. Each one shows a clearer path to the next step.',
        canonicalPath: '/concepts',
    },
    manifesto: {
        title: 'Why weak sites cost money',
        description: 'Why weak websites can cost money when busy days matter and calls need to land quickly.',
        canonicalPath: '/manifesto',
    },
    audit: {
        title: 'Site Review',
        description: 'Get a plain review of your site\'s speed, layout, and contact path.',
        canonicalPath: '/audit',
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
    notFound: {
        title: 'Page not found',
        description: 'The page you requested is not available. Use the main links to continue.',
        canonicalPath: '/404',
        noIndex: true,
    },
} as const satisfies Record<string, SeoRouteMeta>;
