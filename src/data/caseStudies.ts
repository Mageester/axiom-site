export type CaseStudyEntry = {
    slug: string;
    title: string;
    label: 'Sample Build' | 'Concept Build' | 'Demonstration Site' | 'Active Deployment';
    demoUrl?: string;
    niche: string;
    location: string;
    businessType: string;
    primaryProblem: string;
    demonstrates: string;
    summary: string;
    context: string;
    problems: string[];
    built: string[];
    targets: string[];
    deliverables: string[];
    ctaLabel?: string;
};

export const caseStudies: CaseStudyEntry[] = [
    {
        slug: 'sample-hvac-kitchener',
        title: 'Sample: HVAC Service Business Site',
        label: 'Sample Build',
        niche: 'Service-Based Business',
        location: 'Kitchener, ON (Sample Market)',
        businessType: 'Service-Based Business',
        primaryProblem: 'Outdated website with weak trust cues and no clear inquiry path.',
        demonstrates: 'Service-page architecture with stronger trust and cleaner quote pathways.',
        summary: 'Sample build for a local service business with an outdated website and inconsistent inquiry flow.',
        context: 'Sample project showing how a service business can move from generic pages to a clearer trust and conversion structure.',
        problems: [
            'Outdated website with weak trust cues and no clear inquiry path',
            'Slow mobile loading and inconsistent page layout across devices',
            'Weak service-page structure and thin technical SEO foundation'
        ],
        built: [
            'Demonstrates a service-page architecture with clearer trust and quote pathways',
            'Clear contact and quote request funnel above the fold and repeated by section',
            'Performance-first front-end structure with edge delivery deployment model'
        ],
        targets: [
            'Target: 90+ Lighthouse performance score on key pages',
            'Target: sub-2s load on optimized production pages',
            'Target: clearer mobile CTA visibility for quote requests'
        ],
        deliverables: [
            'Homepage + service pages + contact funnel',
            'Mobile-first UI system and CTA hierarchy',
            'Technical SEO foundation and metadata setup',
            'Analytics-ready deployment structure'
        ],
        ctaLabel: 'Request a Similar Build'
    },
    {
        slug: 'concept-landscaping-authority-site',
        title: 'Demo: Landscaping and Outdoor Services Site',
        label: 'Demonstration Site',
        niche: 'Local Business',
        location: 'Demonstration Environment',
        businessType: 'Local Business',
        primaryProblem: 'Portfolio-heavy pages with unclear next action for new inquiries.',
        demonstrates: 'Premium portfolio framing with stronger consultation intent.',
        summary: 'Demonstration site for a local business that needs stronger visual trust and clearer consultation intent.',
        context: 'Demonstration project for a portfolio-heavy business with weak conversion framing and unclear next steps.',
        problems: ['Portfolio-heavy pages with unclear next action', 'No lead qualification messaging', 'Unstructured service pages'],
        built: ['Demonstrates premium portfolio framing with stronger consultation intent', 'Consultation-first CTA system', 'Service area and service category structure'],
        targets: ['Target: strong visual credibility on mobile', 'Target: better consultation intent capture'],
        deliverables: ['Concept homepage', 'Service architecture', 'Inquiry flow blueprint'],
        ctaLabel: 'Initialize Demo'
    },
    {
        slug: 'concept-roofing-conversion-site',
        title: 'Demo: Roofing and Exterior Services Site',
        label: 'Demonstration Site',
        niche: 'Professional Service Business',
        location: 'Demonstration Environment',
        businessType: 'Professional Service Business',
        primaryProblem: 'Competing CTAs with weak hierarchy during high-intent visits.',
        demonstrates: 'Clear CTA priority for urgent versus planned project inquiries.',
        summary: 'Demonstration site for a business balancing urgent inquiries with planned higher-ticket projects.',
        context: 'Demonstration project for a business with competing CTAs and weak trust structure during high-intent visits.',
        problems: ['Competing CTAs with no hierarchy', 'Slow load from builder bloat', 'Weak trust structure'],
        built: ['Demonstrates CTA hierarchy for urgent versus planned inquiries', 'Trust section layout', 'Performance-first page shell'],
        targets: ['Target: clearer first-click conversion path', 'Target: improved mobile readability'],
        deliverables: ['Concept homepage', 'Roofing service page framework', 'CTA and copy hierarchy blueprint'],
        ctaLabel: 'Initialize Demo'
    },
    {
        slug: 'concept-restaurant-reservation-site',
        title: 'Demo: Restaurant Reservation Experience',
        label: 'Demonstration Site',
        demoUrl: 'https://restaurant.getaxiom.ca',
        niche: 'Restaurants',
        location: 'Demonstration Environment',
        businessType: 'Chef-Driven Restaurant',
        primaryProblem: 'Attractive brand presence without a clear, mobile-first reservation pathway.',
        demonstrates: 'Reservation-first UX with premium visual hierarchy and strong mobile booking intent.',
        summary: 'Demonstration build for restaurants that need stronger atmosphere and clearer reservation conversion.',
        context: 'Demonstration project for hospitality brands that need better menu readability, trust signals, and direct reservation flow.',
        problems: [
            'Heavy visual pages with weak call-to-reserve clarity',
            'Menu content difficult to scan on mobile',
            'Inconsistent contact and reservation paths'
        ],
        built: [
            'Demonstrates reservation-first UX across every key page',
            'Hospitality-focused visual system with consistent premium styling',
            'Structured content model for menu, story, and contact details'
        ],
        targets: [
            'Target: clearer reservation intent from first screen',
            'Target: stronger menu readability on small screens',
            'Target: consistent trust and contact signals site-wide'
        ],
        deliverables: [
            'Homepage, menu, about, and reservations pages',
            'Shared design system primitives and content schema',
            'Mobile sticky reserve CTA and clean contact pathways'
        ],
        ctaLabel: 'Initialize Demo'
    }
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
