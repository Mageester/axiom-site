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
        demonstrates: 'Photo-led hospitality framing with a clearer reservation flow.',
        summary: 'Demonstration site for a reservation-led restaurant brand that needs stronger atmosphere, sharper menu clarity, and higher booking confidence.',
        context: 'Demonstration project showing how a restaurant can move from a generic web presence to a clearer booking experience.',
        problems: [
            'Generic visuals that do not communicate dining atmosphere or food quality',
            'Reservation actions are buried, creating drop-off during high-intent traffic',
            'Menu information is hard to scan on mobile and lacks clear hierarchy'
        ],
        built: [
            'Clear photo-led hero and section structure for hospitality buyers',
            'Reservation path above the fold and repeated through the page',
            'Menu and trust sections designed for fast mobile scanning'
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
        title: 'Concept: Landscaping and Outdoor Services Site',
        label: 'Concept Build',
        demoUrl: 'https://landscaping.getaxiom.ca',
        niche: 'Landscaping and Outdoor Services',
        location: 'Toronto, ON (Concept build)',
        businessType: 'Landscaping and Outdoor Services Business',
        primaryProblem: 'Portfolio-heavy pages with unclear next action for new inquiries.',
        demonstrates: 'Portfolio framing with clearer quote intent.',
        summary: 'Concept site for a landscaping business that needs stronger project presentation, clearer local trust, and a better quote path.',
        context: 'Concept project showing how a landscaping company can move from generic service pages to a clearer quote path.',
        problems: ['Portfolio-heavy pages with unclear next action', 'No lead qualification messaging', 'Unstructured service pages'],
        built: ['Clear portfolio framing with stronger quote intent', 'Clear CTA system', 'Service area and service category structure'],
        targets: ['Target: strong visual credibility on mobile', 'Target: better quote intent capture'],
        deliverables: ['Homepage + services + project pages', 'Service-area and consultation flow', 'Residential project gallery and trust sections'],
        ctaLabel: 'Request a Similar Build'
    },
    {
        slug: 'concept-roofing-conversion-site',
        title: 'Concept: Roofing and Exterior Services Site',
        label: 'Concept Build',
        demoUrl: 'https://roofing.getaxiom.ca',
        niche: 'Roofing and Exterior Services',
        location: 'Toronto, ON (Concept build)',
        businessType: 'Roofing and Exterior Services Business',
        primaryProblem: 'Competing CTAs with weak hierarchy during high-intent visits.',
        demonstrates: 'Clear CTA priority for urgent and planned inquiries.',
        summary: 'Concept site for a roofing and exterior-services business balancing urgent inspections with planned exterior work.',
        context: 'Concept project showing how a roofing and exterior-services company can structure trust, CTA clarity, and stronger operational credibility.',
        problems: ['Competing CTAs with no hierarchy', 'Slow load from builder bloat', 'Weak trust structure'],
        built: ['Clear CTA hierarchy for urgent and planned inquiries', 'Trust section layout', 'Lean page shell'],
        targets: ['Target: clearer first-click conversion path', 'Target: improved mobile readability'],
        deliverables: ['Homepage + services + inspection flow', 'Roofing service structure', 'Operational trust and CTA hierarchy'],
        ctaLabel: 'Request a Similar Build'
    }
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
