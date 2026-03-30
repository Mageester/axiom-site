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
        title: 'Restaurant booking site',
        label: 'Live Demo',
        demoUrl: 'https://restaurant.getaxiom.ca',
        niche: 'Restaurant and hospitality',
        location: 'Toronto, ON',
        businessType: 'Restaurant',
        primaryProblem: 'The old site made it hard to find reservations.',
        demonstrates: 'A food-first layout that gets people to the booking step faster.',
        summary: 'A restaurant site that helps people find the menu and book a table faster.',
        context: 'Built to show how a restaurant can stop losing bookings to a vague homepage.',
        problems: [
            'The food was not the main focus',
            'Reservations were hard to spot',
            'Menu pages were difficult to scan on mobile',
        ],
        built: [
            'A cleaner homepage',
            'A reservation button near the top',
            'Simple menu and booking sections',
        ],
        targets: [
            'More reservation clicks',
            'Faster menu scanning on mobile',
            'Fewer clicks to reserve',
        ],
        deliverables: [
            'Homepage, menu, and reservation flow',
            'A simpler page structure',
            'Mobile-friendly layout and SEO setup',
        ],
        ctaLabel: 'Request a similar build',
    },
    {
        slug: 'concept-landscaping-authority-site',
        title: 'Landscaping quote site',
        label: 'Live Demo',
        demoUrl: 'https://landscaping.getaxiom.ca',
        niche: 'Landscaping and outdoor services',
        location: 'Toronto, ON',
        businessType: 'Landscaping',
        primaryProblem: 'The site did not make quote requests easy enough.',
        demonstrates: 'A clearer project page and a direct quote path.',
        summary: 'A landscaping site that shows the work clearly and gets quote requests to the right place.',
        context: 'Built to show how a service business can look more credible without more pages.',
        problems: ['Project pages were hard to scan', 'The next step was not obvious', 'Service pages felt scattered'],
        built: ['Stronger project framing', 'Quote request up front', 'Clear service-area structure'],
        targets: ['More quote requests on mobile', 'More people reaching the quote form'],
        deliverables: ['Homepage, services, and projects', 'Service area and quote flow', 'Residential proof presentation'],
        ctaLabel: 'Request a similar build',
    },
    {
        slug: 'concept-roofing-conversion-site',
        title: 'Roofing lead site',
        label: 'Live Demo',
        demoUrl: 'https://roofing.getaxiom.ca',
        niche: 'Roofing and exterior services',
        location: 'Toronto, ON',
        businessType: 'Roofing',
        primaryProblem: 'The site made every job feel the same.',
        demonstrates: 'A simple path to inspections and larger projects.',
        summary: 'A roofing site that puts inspections first and keeps the next step clear.',
        context: 'Built to show how a roofing company can separate urgent work from planned jobs.',
        problems: ['Calls to action competed with each other', 'The page felt heavy', 'The page did not show enough proof'],
        built: ['Clear call-to-action order', 'Inspection details up front', 'A lighter page shell'],
        targets: ['Clearer first click', 'More inspection requests'],
        deliverables: ['Homepage, services, and inspection flow', 'Roofing service layout', 'Proof and call-to-action system'],
        ctaLabel: 'Request a similar build',
    },
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
