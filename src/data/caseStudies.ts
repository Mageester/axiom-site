export type CaseStudyEntry = {
    slug: string;
    title: string;
    label: 'Sample Case Study' | 'Concept Build' | 'Active Deployment';
    niche: string;
    location: string;
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
        title: 'Sample: HVAC Contractor (Kitchener)',
        label: 'Sample Case Study',
        niche: 'Trade Services',
        location: 'Kitchener, ON',
        summary: 'A demonstration build showing how a performance-first HVAC site can improve trust, speed, and quote conversion readiness.',
        context: 'This sample case study represents a typical local HVAC contractor that relies on calls and quote requests but has an outdated site experience.',
        problems: [
            'Slow mobile loading and inconsistent page layout across devices',
            'Unclear quote CTA hierarchy on service pages',
            'Weak local service area structure and thin technical SEO foundation'
        ],
        built: [
            'Service-focused page architecture for HVAC, furnace, and AC repair/installation',
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
        title: 'Demo: Landscaping Professional Site',
        label: 'Concept Build',
        niche: 'Local Business',
        location: 'Demo Environment',
        summary: 'A sub-second edge-deployed dispatch architecture designed for premium landscaping and hardscaping contractors.',
        context: 'Concept demonstration for a landscaping and design firm that needs stronger trust signals and clearer service qualification.',
        problems: ['Portfolio-heavy site with weak CTA prompts', 'No lead qualification messaging', 'Unstructured service pages'],
        built: ['Premium portfolio presentation flow', 'Consultation-first CTA system', 'Service area and service category structure'],
        targets: ['Target: strong visual credibility on mobile', 'Target: better consultation intent capture'],
        deliverables: ['Concept homepage', 'Service architecture', 'Inquiry flow blueprint'],
        ctaLabel: 'Initialize Demo'
    },
    {
        slug: 'concept-roofing-conversion-site',
        title: 'Demo: Roofing Conversion Site',
        label: 'Concept Build',
        niche: 'Contractors',
        location: 'Demo Environment',
        summary: 'A sub-second edge-deployed dispatch architecture designed for emergency roofing calls and exterior protection services.',
        context: 'Concept demonstration for a roofing company balancing emergency calls with planned replacement projects.',
        problems: ['Competing CTAs with no hierarchy', 'Slow load from builder bloat', 'Weak trust structure'],
        built: ['Emergency vs estimate CTA split', 'Trust section layout', 'Performance-first page shell'],
        targets: ['Target: clearer first-click conversion path', 'Target: improved mobile readability'],
        deliverables: ['Concept homepage', 'Roofing service page framework', 'CTA and copy hierarchy blueprint'],
        ctaLabel: 'Initialize Demo'
    }
];

export function getCaseStudyBySlug(slug: string) {
    return caseStudies.find((c) => c.slug === slug) || null;
}
