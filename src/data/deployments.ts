export type Industry =
    | "Contracting"
    | "Home Services"
    | "Clinics"
    | "Restaurants"
    | "Agencies"
    | "SaaS"
    | "Local Brands";

export type OutcomeGoal =
    | "Traffic"
    | "Leads"
    | "Bookings"
    | "Speed"
    | "SEO"
    | "Conversion Rate";

export type BuildType =
    | "New Build"
    | "Rebuild"
    | "Rescue/Repair";

export type MetricBadge = {
    value: string; // e.g., "+42%"
    label: string; // e.g., "Conv. Lift"
    sentiment: "positive" | "neutral";
};

// Strict rule: Outcome strings should ideally start with a number/metric
export type Outcome = string;

export interface DeploymentRecord {
    id: string;
    slug: string;           // For sharing: /deployments#project-aether
    title: string;
    industry: Industry;
    location: string;
    year: number;
    buildType: BuildType;
    outcomeGoals: OutcomeGoal[];
    timelineWeeks: number;
    impactScore: number;    // Internal metric for "Most Impact" sorting (1-100)

    // Card View Data
    primaryBadge: MetricBadge;
    cardOutcomes: [Outcome, Outcome, Outcome?]; // 2-3 max outcomes

    // Detail Modal Data
    problemDefinition: string[];
    architectureSummary: string[];
    fullResults: string[];
    proofImages?: {
        cwv?: string;         // path to Core Web Vitals screenshot
        analytics?: string;   // path to GA/Plausible screenshot
    };
    stackTags: string[];    // e.g., ["React", "Cloudflare", "GSAP"]
}

// Mock Data representing the engineering-first approach
export const deployments: DeploymentRecord[] = [
    {
        id: "dep-001",
        slug: "project-aether",
        title: "Project Aether",
        industry: "SaaS",
        location: "San Francisco, CA",
        year: 2024,
        buildType: "Rebuild",
        outcomeGoals: ["Conversion Rate", "Speed", "SEO"],
        timelineWeeks: 4,
        impactScore: 95,
        primaryBadge: {
            value: "140ms",
            label: "LCP Achieved",
            sentiment: "positive"
        },
        cardOutcomes: [
            "+42% sustained conversion lift",
            "0% downtime during migration",
            "Perfect 100/100 Lighthouse score"
        ],
        problemDefinition: [
            "Legacy React SPA suffering from 4.2s initial load times.",
            "High bounce rate (68%) on mobile devices.",
            "Cumbersome CMS slowing down marketing iterations."
        ],
        architectureSummary: [
            "Headless Next.js architected for edge caching.",
            "Aggressive static generation (SSG) for all core marketing pages.",
            "Decoupled Sanity CMS for rapid content deployment."
        ],
        fullResults: [
            "Global Time-to-Interactive reduced to 0.8s.",
            "Mobile bounce rate dropped by 45% within week one.",
            "Marketing team deployment velocity increased 3x."
        ],
        stackTags: ["Next.js", "Sanity", "Tailwind", "Vercel Edge"],
        proofImages: {
            cwv: "/assets/proof/aether-cwv.png"
        }
    },
    {
        id: "dep-002",
        slug: "nexus-clinics",
        title: "Nexus Healthcare Clinics",
        industry: "Clinics",
        location: "Chicago, IL",
        year: 2023,
        buildType: "New Build",
        outcomeGoals: ["Bookings", "Speed"],
        timelineWeeks: 6,
        impactScore: 88,
        primaryBadge: {
            value: "3.2x",
            label: "Patient Bookings",
            sentiment: "positive"
        },
        cardOutcomes: [
            "< 1s load time across 3G networks",
            "Integrated frictionless booking terminal",
            "HIPAA-compliant data routing"
        ],
        problemDefinition: [
            "Outdated WordPress site with broken third-party booking plugins.",
            "Patients abandoning forms due to slow validation scripts.",
            "Zero mobile optimization resulting in lost local search traffic."
        ],
        architectureSummary: [
            "Custom React frontend with streamlined API integration to booking backend.",
            "Stripped down DOM and removed all heavy tracking scripts.",
            "Implemented strict Content Security Policies (CSP) for compliance."
        ],
        fullResults: [
            "New patient patient acquisition cost (CAC) lowered by 22%.",
            "Form completion rate increased from 12% to 48%.",
            "Zero failed booking transactions recorded post-launch."
        ],
        stackTags: ["React", "TypeScript", "Framer Motion", "Cloudflare"]
    },
    {
        id: "dep-003",
        slug: "apex-contracting",
        title: "Apex Industrial Contracting",
        industry: "Contracting",
        location: "Houston, TX",
        year: 2024,
        buildType: "Rescue/Repair",
        outcomeGoals: ["Leads", "SEO"],
        timelineWeeks: 2,
        impactScore: 82,
        primaryBadge: {
            value: "+185%",
            label: "Qualified Leads",
            sentiment: "positive"
        },
        cardOutcomes: [
            "Removed 4MB of dead JavaScript",
            "Restructured core semantic HTML for local SEO",
            "Implemented intelligent quote capture forms"
        ],
        problemDefinition: [
            "Site penalized by Google Core Web Vitals update.",
            "Massive layout shifts (CLS) on mobile.",
            "Contact forms frequently failing to deliver to sales team."
        ],
        architectureSummary: [
            "Emergency code audit and surgical removal of blocking resources.",
            "Re-engineered critical rendering path.",
            "Replaced fragile PHP mailers with robust Edge API routes."
        ],
        fullResults: [
            "Site restored to Page 1 for top 5 local keywords.",
            "Lead quality improved due to conditional logic routing.",
            "CLS score reduced from 0.85 to 0.01."
        ],
        stackTags: ["HTML5", "Vanilla JS", "Edge Workers", "Postmark"],
        proofImages: {
            analytics: "/assets/proof/apex-leads.png"
        }
    }
];
