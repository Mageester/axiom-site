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
        primaryProblem: 'The site did not make the restaurant feel inviting or make reservations easy to find.',
        demonstrates: 'A clearer food-first layout with reservations up front.',
        summary: 'A restaurant site that makes the food feel inviting and the reservation path easy.',
        context: 'A demo that shows how a restaurant can move from a generic site to a booking-friendly one.',
        problems: [
            'Photos do not show the dining experience clearly',
            'Reservations are too hard to find',
            'Menu details are hard to scan on mobile'
        ],
        built: [
            'Photo-led homepage',
            'Reservation button up front',
            'Simple menu and trust sections'
        ],
        targets: [
            'More reservation clicks',
            'Faster menu scanning on mobile',
            'A stronger first impression'
        ],
        deliverables: [
            'Homepage, menu, and reservation flow',
            'Hospitality-first layout',
            'Mobile-first design and SEO-friendly structure'
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
        primaryProblem: 'The site did not make it easy to request a quote.',
        demonstrates: 'A stronger project showcase with a clearer quote path.',
        summary: 'A landscaping site that shows projects well and makes it easy to ask for a quote.',
        context: 'A demo that shows how a landscaping company can move from a generic service site to a stronger project-led one.',
        problems: ['Project pages were hard to scan', 'The next step was not clear', 'Service pages felt unstructured'],
        built: ['Stronger project framing', 'Quote request up front', 'Clear service-area structure'],
        targets: ['Stronger trust on mobile', 'More quote requests'],
        deliverables: ['Homepage, services, and projects', 'Service area and quote flow', 'Residential proof presentation'],
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
        primaryProblem: 'Urgent and planned jobs shared the same CTA priority.',
        demonstrates: 'Clear CTA priority for inspections and larger projects.',
        summary: 'A roofing site that makes inspections easy to book and keeps the page clear.',
        context: 'A demo showing how a roofing company can organize urgent inspections and larger exterior jobs.',
        problems: ['CTAs competed with each other', 'The page felt heavy', 'Trust was too thin'],
        built: ['Clear CTA hierarchy', 'Trust section up front', 'Lightweight page shell'],
        targets: ['Clearer first click', 'Better mobile readability'],
        deliverables: ['Homepage, services, and inspection flow', 'Roofing service layout', 'Trust and CTA system'],
        ctaLabel: 'Request a Similar Build'
    }
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
