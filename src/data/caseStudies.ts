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
        demonstrates: 'A food-first layout with reservations up front.',
        summary: 'A clear restaurant site that helps people see the menu and book a table.',
        context: 'We used this build to show how a restaurant can look more inviting without adding clutter.',
        problems: [
            'The food was not the main focus',
            'Reservations were hard to spot',
            'Menu pages were difficult to scan on mobile',
        ],
        built: [
            'A cleaner homepage',
            'A reservation button near the top',
            'Simple menu and trust sections',
        ],
        targets: [
            'More reservation clicks',
            'Faster menu scanning on mobile',
            'A stronger first impression',
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
        demonstrates: 'A stronger project showcase with a clear quote path.',
        summary: 'A landscaping site that shows the work well and makes it easy to ask for a quote.',
        context: 'This build shows how a service business can look more established with less noise.',
        problems: ['Project pages were hard to scan', 'The next step was not obvious', 'Service pages felt scattered'],
        built: ['Stronger project framing', 'Quote request up front', 'Clear service-area structure'],
        targets: ['More trust on mobile', 'More quote requests'],
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
        primaryProblem: 'Urgent and planned jobs shared the same message.',
        demonstrates: 'Clear call-to-action priority for inspections and larger projects.',
        summary: 'A roofing site that keeps the page clear and makes inspections easy to book.',
        context: 'This build shows how a roofing company can separate urgent work from bigger jobs.',
        problems: ['Calls to action competed with each other', 'The page felt heavy', 'Trust was too thin'],
        built: ['Clear call-to-action order', 'Trust section up front', 'A lighter page shell'],
        targets: ['Clearer first click', 'Better mobile reading'],
        deliverables: ['Homepage, services, and inspection flow', 'Roofing service layout', 'Trust and call-to-action system'],
        ctaLabel: 'Request a similar build',
    },
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
