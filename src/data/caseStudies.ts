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
        title: 'Restaurant reservation site',
        label: 'Live Demo',
        demoUrl: 'https://restaurant.getaxiom.ca',
        niche: 'Restaurant and Hospitality',
        location: 'Toronto, ON (Live demo)',
        businessType: 'Restaurant',
        primaryProblem: 'Guests have to hunt for the booking link, and the menu is hard to read on phones.',
        demonstrates: 'A clear menu, a visible reservation link, and a layout that feels like the room.',
        summary: 'A restaurant site that gets people to the menu and the booking link fast.',
        context: 'Built for restaurants that need the menu, booking, and room to show up right away.',
        problems: [
            'The booking link is hard to spot',
            'The menu takes too long to read',
            'The dining room is not clear enough'
        ],
        built: [
            'Reservation link stays up front',
            'Menu pages read well on mobile',
            'Photos support the food and room'
        ],
        targets: [
            'More bookings from homepage traffic',
            'Less friction on phones',
            'A stronger first impression'
        ],
        deliverables: [
            'Homepage, menu, and reservation flow',
            'Photo-led layout',
            'Mobile-friendly page structure'
        ],
        ctaLabel: 'See this build'
    },
    {
        slug: 'concept-landscaping-authority-site',
        title: 'Landscaping site',
        label: 'Live Demo',
        demoUrl: 'https://landscaping.getaxiom.ca',
        niche: 'Landscaping and Outdoor Services',
        location: 'Toronto, ON (Live demo)',
        businessType: 'Landscaping',
        primaryProblem: 'Past work is buried, and quote requests take too many clicks.',
        demonstrates: 'Project photos, service areas, and a simple quote path.',
        summary: 'A landscaping site that puts the work first and shortens the quote path.',
        context: 'Built for landscapers who need projects, services, and contact details to be easy to find.',
        problems: ['Project photos are buried', 'Service areas are unclear', 'Quote requests take too many clicks'],
        built: ['Project photos are up front', 'Service pages are plain', 'Quote form is short on phones'],
        targets: ['More quote requests from local traffic', 'Stronger trust from project photos', 'Less friction on mobile'],
        deliverables: ['Homepage, services, and projects', 'Quote request flow', 'Project photo presentation'],
        ctaLabel: 'See this build'
    },
    {
        slug: 'concept-roofing-conversion-site',
        title: 'Roofing site',
        label: 'Live Demo',
        demoUrl: 'https://roofing.getaxiom.ca',
        niche: 'Roofing and Exterior Services',
        location: 'Toronto, ON (Live demo)',
        businessType: 'Roofing',
        primaryProblem: 'Storm traffic needs a fast path to inspection and estimate requests.',
        demonstrates: 'A clear path for urgent calls and planned roof work.',
        summary: 'A roofing site that sends urgent calls and estimate requests to different places.',
        context: 'Built for roofers who need storm damage calls and planned estimates to be obvious.',
        problems: ['Storm traffic hits pages with mixed signals', 'Contact details are hard to find', 'Proof of past work is weak'],
        built: ['Urgent and planned requests have separate paths', 'Trust blocks are easy to scan', 'The page loads quickly on phones'],
        targets: ['Faster calls after storms', 'Clearer inspection requests', 'Less bounce on mobile'],
        deliverables: ['Homepage, services, and inspection flow', 'Roofing service pages', 'Clear proof and contact sections'],
        ctaLabel: 'See this build'
    }
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
