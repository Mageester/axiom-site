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
    experienceShift: string;
    before: string;
    after: string;
    strategy: string;
    mobileFocus: string;
    proofPoints: string[];
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
        experienceShift: 'Moves the first impression from a generic restaurant page to a calm reservation-led hospitality experience.',
        before: 'The original experience leaves the booking path too easy to miss and the atmosphere too flat to sell the room.',
        after: 'The new structure puts the dining mood, reservation action, and menu confidence where diners expect them.',
        strategy: 'Lead with a cinematic hero, make the booking action obvious, and keep the menu legible on mobile.',
        mobileFocus: 'Shorter blocks and a tighter CTA stack keep the booking path fast on phones.',
        proofPoints: [
            'Reservation path stays visible above the fold',
            'Menu information is easier to scan on mobile',
            'Visual mood supports premium dining expectations',
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
        experienceShift: 'Turns a portfolio-heavy site into a consultation-first presentation with clearer local trust.',
        before: 'The old framing leaves new visitors scanning work samples without a crisp next step.',
        after: 'The revised flow uses the project gallery as proof, then guides the right homeowner toward a consultation.',
        strategy: 'Use project imagery to build credibility quickly, then surface consultation intent before the visitor drifts.',
        mobileFocus: 'Large visual blocks stay readable while the next-step CTA remains easy to reach on smaller screens.',
        proofPoints: [
            'Portfolio evidence does more of the selling',
            'Consultation intent is clear from the first screen',
            'Service-area language helps the right local buyer self-select',
        ],
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
        experienceShift: 'Replaces competing CTAs with a clearer split between urgent repairs and planned projects.',
        before: 'The earlier structure asks visitors to choose between too many actions at the same time.',
        after: 'The new flow distinguishes emergency intent from planned work and makes the inspection path obvious.',
        strategy: 'Prioritize inspection-led trust, then route urgent and planned work into separate decision paths.',
        mobileFocus: 'CTA order and trust blocks are tuned so a mobile visitor can decide without hunting.',
        proofPoints: [
            'Urgent versus planned intent is visually separated',
            'The first action is easier to understand',
            'Trust is established before the quote ask',
        ],
        ctaLabel: 'Request a Similar Build'
    }
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
