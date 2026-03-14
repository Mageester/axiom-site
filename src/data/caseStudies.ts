export type CaseStudyEntry = {
    slug: string;
    title: string;
    label: 'Sample Build' | 'Concept Build' | 'Demonstration Site' | 'Live Demo' | 'In Progress';
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
        slug: 'demonstration-restaurant-reservation-site',
        title: 'Demo: Restaurant Reservation Site',
        label: 'Live Demo',
        demoUrl: 'https://restaurant.getaxiom.ca',
        niche: 'Restaurant and Hospitality',
        location: 'Toronto, ON (Live demonstration deployment)',
        businessType: 'Restaurant Business',
        primaryProblem: 'Weak atmosphere presentation and unclear reservation path for high-intent visitors.',
        demonstrates: 'Photo-led hospitality framing with cleaner reservation-first conversion flow.',
        summary: 'Demonstration site for a reservation-led restaurant brand that needs stronger atmosphere, sharper menu clarity, and higher booking confidence.',
        context: 'Demonstration project showing how a restaurant brand can move from generic web presence to a premium, hospitality-driven booking experience.',
        problems: [
            'Generic visuals that do not communicate dining atmosphere or food quality',
            'Reservation actions are buried, creating drop-off during high-intent traffic',
            'Menu information is hard to scan on mobile and lacks clear hierarchy'
        ],
        built: [
            'Demonstrates photo-led hero and section composition aligned to hospitality buying behavior',
            'Clear reservation path above the fold and reinforced through menu and proof sections',
            'Structured menu and trust blocks designed for fast mobile scanning'
        ],
        targets: [
            'Target: stronger reservation intent from homepage traffic',
            'Target: clearer menu discovery and scan speed on mobile',
            'Target: improved trust perception through atmosphere and presentation quality'
        ],
        deliverables: [
            'Homepage + menu preview + reservation-first CTA system',
            'Hospitality-focused visual hierarchy and card composition',
            'Mobile-first layout and interaction polish',
            'Technical SEO and metadata-ready page structure'
        ],
        ctaLabel: 'Request a Similar Build'
    },
    {
        slug: 'concept-landscaping-authority-site',
        title: 'Demo: Landscaping and Outdoor Services Site',
        label: 'Live Demo',
        demoUrl: 'https://landscaping.getaxiom.ca',
        niche: 'Landscaping and Outdoor Services',
        location: 'Toronto, ON (Live demonstration deployment)',
        businessType: 'Landscaping and Outdoor Services Business',
        primaryProblem: 'Portfolio-heavy pages with unclear next action for new inquiries.',
        demonstrates: 'Premium portfolio framing with stronger consultation intent.',
        summary: 'Live demonstration site for a landscaping business that needs stronger project presentation, clearer local trust, and a better quote path.',
        context: 'Live demonstration project showing how a landscaping company can move from generic service pages to a stronger portfolio-led website with clearer quote intent.',
        problems: ['Portfolio-heavy pages with unclear next action', 'No lead qualification messaging', 'Unstructured service pages'],
        built: ['Demonstrates premium portfolio framing with stronger consultation intent', 'Consultation-first CTA system', 'Service area and service category structure'],
        targets: ['Target: strong visual credibility on mobile', 'Target: better consultation intent capture'],
        deliverables: ['Homepage + services + projects architecture', 'Service-area and consultation flow', 'Premium residential proof presentation'],
        ctaLabel: 'Request a Similar Build'
    },
    {
        slug: 'concept-roofing-conversion-site',
        title: 'Demo: Roofing and Exterior Services Site',
        label: 'Live Demo',
        demoUrl: 'https://roofing.getaxiom.ca',
        niche: 'Roofing and Exterior Services',
        location: 'Toronto, ON (Live demonstration deployment)',
        businessType: 'Roofing and Exterior Services Business',
        primaryProblem: 'Competing CTAs with weak hierarchy during high-intent visits.',
        demonstrates: 'Clear CTA priority for urgent versus planned project inquiries.',
        summary: 'Live demonstration site for a roofing and exterior-services business balancing urgent inspections with planned higher-ticket exterior work.',
        context: 'Live demonstration project showing how a roofing and exterior-services company can structure inspection-led trust, urgent-versus-planned CTA clarity, and stronger operational credibility.',
        problems: ['Competing CTAs with no hierarchy', 'Slow load from builder bloat', 'Weak trust structure'],
        built: ['Demonstrates CTA hierarchy for urgent versus planned inquiries', 'Trust section layout', 'Performance-first page shell'],
        targets: ['Target: clearer first-click conversion path', 'Target: improved mobile readability'],
        deliverables: ['Homepage + services + inspection flow', 'Roofing service architecture', 'Operational trust and CTA hierarchy system'],
        ctaLabel: 'Request a Similar Build'
    }
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
