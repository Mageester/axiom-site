// ─────────────────────────────────────────────────────────────
// deployments.data.ts — Single source of truth for all portfolio entries.
//
// HOW TO ADD A NEW DEPLOYMENT:
//   1. Copy any existing object in the `deployments` array.
//   2. Give it a unique `id` (format: "dep-XXX").
//   3. Fill every required field. `proof` is optional.
//   4. Ensure `outcomes` has EXACTLY 3–5 bullet strings.
//   5. The UI will automatically pick up the new entry.
// ─────────────────────────────────────────────────────────────

export type Industry =
    | "Contracting"
    | "Home Services"
    | "Clinics"
    | "Restaurants"
    | "Legal"
    | "Real Estate"
    | "Local Brands";

export type BuildType = "New build" | "Rebuild" | "Rescue";

export type OutcomeGoal = "Leads" | "Bookings" | "Speed" | "SEO" | "Conversion Rate";

export interface MetricBadge {
    label: string;
    value: string;
}

export interface ProofAssets {
    lighthouse?: string;
    cwv?: string;
    analytics?: string;
}

export interface Deployment {
    id: string;
    title: string;
    industry: Industry;
    location: string;
    year: number;
    buildType: BuildType;
    outcomeGoals: OutcomeGoal[];
    timelineWeeks: number;
    impactScore: number; // 1–100, used for "Most impact" sort
    metricBadge: MetricBadge;
    outcomes: string[];   // EXACTLY 3–5 bullets
    problem: string[];    // 2–4 bullets
    build: string[];      // 5–9 bullets
    result: string[];     // 3–6 bullets
    proof?: ProofAssets;
    stackTags: string[];
}

// ── ALL NAMES ARE FICTIONAL / DEMO ONLY ───────────────────────
export const deployments: Deployment[] = [
    {
        id: "dep-001",
        title: "Project Ember",
        industry: "Home Services",
        location: "Southern Ontario",
        year: 2025,
        buildType: "New build",
        outcomeGoals: ["Leads", "Speed", "SEO"],
        timelineWeeks: 3,
        impactScore: 92,
        metricBadge: { label: "Quote Requests / Month", value: "+164%" },
        outcomes: [
            "+164% qualified quote requests within 60 days",
            "0.7s average page load on mobile LTE",
            "Page 1 ranking for primary service keyword within 8 weeks",
            "98 Lighthouse Performance score on all service pages",
        ],
        problem: [
            "Legacy page-builder site loading in 6.1s on mobile.",
            "No structured service pages — entire offering crammed onto one page.",
            "Contact form buried below the fold; 80%+ of mobile visitors never saw it.",
        ],
        build: [
            "Custom React + Vite frontend deployed to Cloudflare Pages.",
            "Dedicated service pages for each core vertical.",
            "Sticky mobile CTA bar with one-tap call and quote request.",
            "Schema markup for local business, services, and FAQ.",
            "Aggressive image optimization pipeline (WebP, lazy load, blur placeholder).",
            "Edge-cached static pages with < 50ms TTFB globally.",
        ],
        result: [
            "Quote form submissions increased +164% within 60 days.",
            "Mobile bounce rate dropped from 72% to 34%.",
            "Average session duration increased 2.4x.",
            "3 target keywords reached Page 1 within 8 weeks of launch.",
        ],
        proof: { lighthouse: "/assets/proof/ember-lighthouse.webp" },
        stackTags: ["React", "Vite", "Cloudflare Pages", "Tailwind", "Schema.org"],
    },

    {
        id: "dep-002",
        title: "Project Ironclad",
        industry: "Contracting",
        location: "Southern Ontario",
        year: 2025,
        buildType: "Rebuild",
        outcomeGoals: ["Leads", "Conversion Rate", "Speed"],
        timelineWeeks: 2,
        impactScore: 95,
        metricBadge: { label: "Conversion Rate", value: "2.1% → 6.8%" },
        outcomes: [
            "Conversion rate tripled from 2.1% to 6.8%",
            "Emergency call volume up 40% in first month",
            "Sub-1s load time on all pages",
            "CLS reduced from 0.92 to 0.01",
        ],
        problem: [
            "WordPress theme with 4.8MB of unused JavaScript and plugin bloat.",
            "Competing CTAs with no visual hierarchy — visitors couldn't distinguish emergency from general inquiries.",
            "Massive layout shifts (CLS 0.92) causing accidental clicks and high bounce.",
        ],
        build: [
            "Stripped-down static site with separated emergency and estimate CTA paths.",
            "Trust section with license numbers, insurance badges, and review aggregation.",
            "Before/after project gallery with lazy-loaded image comparison slider.",
            "Service-area pages for surrounding municipalities.",
            "Performance-first CSS — zero render-blocking resources.",
            "Structured data for contractor, reviews, and service areas.",
            "One-tap emergency call button fixed to mobile viewport.",
        ],
        result: [
            "Conversion rate increased from 2.1% to 6.8% within 30 days.",
            "Emergency call volume up 40% — attributed to dedicated CTA path.",
            "Page load reduced from 4.8s to 0.8s.",
            "CLS reduced from 0.92 to 0.01 — zero accidental clicks reported.",
        ],
        proof: { cwv: "/assets/proof/ironclad-cwv.webp" },
        stackTags: ["HTML5", "Vanilla JS", "Cloudflare", "Edge Workers"],
    },

    {
        id: "dep-003",
        title: "Project Clarity",
        industry: "Clinics",
        location: "Ontario",
        year: 2024,
        buildType: "New build",
        outcomeGoals: ["Bookings", "Speed", "SEO"],
        timelineWeeks: 4,
        impactScore: 89,
        metricBadge: { label: "Online Bookings", value: "12 → 89/mo" },
        outcomes: [
            "Online bookings increased from 12 to 89 per month (+642%)",
            "Perfect 100/100 Lighthouse score on homepage",
            "Ranked #1 for primary local keyword within 12 weeks",
        ],
        problem: [
            "Template site with broken booking widget that only worked on desktop.",
            "No mobile optimization — 65% of traffic was mobile, 70% bounced.",
            "Thin content with zero local SEO structure.",
            "Patients defaulting to phone calls because online booking was unreliable.",
        ],
        build: [
            "Custom React frontend integrated directly with clinic booking API.",
            "Mobile-first booking flow — 3 steps max from landing to confirmed appointment.",
            "Service pages for each specialization and treatment type.",
            "Patient testimonial section with structured review schema.",
            "Location page optimized for Google Business Profile integration.",
            "Automated sitemap generation and technical SEO foundation.",
            "WCAG 2.1 AA accessibility compliance across all pages.",
        ],
        result: [
            "Online bookings increased from 12/mo to 89/mo.",
            "Mobile bounce rate decreased from 70% to 28%.",
            "Phone call volume decreased 35% as clients shifted to online booking.",
            "Ranked #1 for primary keyword within 12 weeks.",
            "Booking widget uptime: 100% since launch.",
        ],
        stackTags: ["React", "TypeScript", "Vite", "Cloudflare", "Tailwind"],
    },

    {
        id: "dep-004",
        title: "Project Hearth",
        industry: "Restaurants",
        location: "Ontario",
        year: 2025,
        buildType: "New build",
        outcomeGoals: ["Bookings", "Speed", "Conversion Rate"],
        timelineWeeks: 2,
        impactScore: 78,
        metricBadge: { label: "Avg Page Load", value: "0.6s" },
        outcomes: [
            "0.6s average page load — sub-second on every device",
            "Online reservation volume up 85% in first 30 days",
            "Menu page engagement increased 3.1x vs previous site",
        ],
        problem: [
            "Template site with generic stock photography and slow load times.",
            "Menu only available as a downloadable PDF — not indexed, not mobile-friendly.",
            "No reservation integration; visitors had to call during business hours.",
        ],
        build: [
            "Cinematic single-page experience with parallax food photography.",
            "Inline HTML menu with dietary filter toggles (GF, Vegan, Spicy).",
            "Integrated reservation widget — zero friction.",
            "Social proof feed integration.",
            "Event section with structured data for Google rich results.",
            "Performance-optimized image pipeline with responsive srcset.",
        ],
        result: [
            "Page load reduced from 5.2s to 0.6s.",
            "Online reservation volume increased 85%.",
            "Menu page average time-on-page: 2m 14s (up from 18s on PDF).",
            "Google rich results appearing for weekend events.",
        ],
        stackTags: ["React", "Vite", "GSAP", "Cloudflare Pages", "Framer Motion"],
    },

    {
        id: "dep-005",
        title: "Project Terrain",
        industry: "Contracting",
        location: "Southern Ontario",
        year: 2024,
        buildType: "Rebuild",
        outcomeGoals: ["Leads", "SEO", "Conversion Rate"],
        timelineWeeks: 3,
        impactScore: 88,
        metricBadge: { label: "Qualified Leads / Mo", value: "+223%" },
        outcomes: [
            "+223% qualified lead volume within 45 days",
            "Sub-1s load on 4G mobile across all pages",
            "Page 1 for two primary local keywords",
            "Bounce rate reduced from 68% to 31%",
        ],
        problem: [
            "Portfolio-heavy site with no CTA hierarchy — visitors admired photos but never contacted.",
            "No service-area pages; missing local SEO for surrounding cities.",
            "Uncompressed 5MB hero images causing 4s+ load times.",
        ],
        build: [
            "Consultation-first CTA architecture — every section drives to quote request.",
            "Before/after image gallery with swipe comparison on mobile.",
            "Service category pages for each core offering.",
            "Service-area pages for surrounding municipalities.",
            "Optimized image pipeline — WebP conversion, responsive srcset, lazy loading.",
            "Google Business Profile optimization guidance included in handoff.",
            "Trust section with license, insurance, and certification verification.",
        ],
        result: [
            "Qualified leads increased +223% within 45 days.",
            "Average page load dropped from 4.2s to 0.9s.",
            "Two primary keywords reached Page 1 within 6 weeks.",
            "Bounce rate reduced from 68% to 31%.",
        ],
        proof: { analytics: "/assets/proof/terrain-leads.webp" },
        stackTags: ["React", "Vite", "Tailwind", "Cloudflare Pages", "Schema.org"],
    },

    {
        id: "dep-006",
        title: "Project Sovereign",
        industry: "Legal",
        location: "Ontario",
        year: 2025,
        buildType: "New build",
        outcomeGoals: ["Leads", "SEO", "Speed"],
        timelineWeeks: 4,
        impactScore: 86,
        metricBadge: { label: "Consultation Requests", value: "+310%" },
        outcomes: [
            "+310% consultation requests in first 90 days",
            "99 Lighthouse Performance score across all practice area pages",
            "Ranked Page 1 for primary practice area keyword",
            "Average time-on-site increased from 42s to 2m 38s",
            "Measured post-launch: referral traffic from directories up 45%",
        ],
        problem: [
            "Dated template site with walls of text and no visual hierarchy.",
            "Zero practice area pages — all services listed on a single 'About' page.",
            "No intake form; only a generic email link buried in the footer.",
            "Site not mobile-responsive — auto-zoomed on every phone.",
        ],
        build: [
            "Practice area architecture with dedicated pages per specialization.",
            "Intake form with conditional logic routing inquiries to the correct team member.",
            "Professional profile pages with credentials and direct booking.",
            "Trust-building section: case results, settlements, professional associations.",
            "FAQ schema markup on every practice area page for rich snippets.",
            "AODA-compliant accessibility across all pages.",
            "Edge-delivered static pages with sub-second global TTFB.",
            "Blog infrastructure for ongoing content marketing.",
        ],
        result: [
            "Consultation requests increased 310% in first 90 days.",
            "Form completion rate: 34% (up from 8% on previous email-only contact).",
            "Primary keyword reached Page 1 within 10 weeks.",
            "Average session duration increased from 42s to 2m 38s.",
        ],
        stackTags: ["React", "TypeScript", "Vite", "Cloudflare", "Tailwind", "Schema.org"],
    },

    {
        id: "dep-007",
        title: "Project Lifeline",
        industry: "Home Services",
        location: "Ontario",
        year: 2024,
        buildType: "Rescue",
        outcomeGoals: ["Speed", "Leads", "SEO"],
        timelineWeeks: 1,
        impactScore: 80,
        metricBadge: { label: "Page Load", value: "7.3s → 0.9s" },
        outcomes: [
            "Page load reduced from 7.3s to 0.9s (88% faster)",
            "Emergency call volume recovered to pre-penalty levels within 3 weeks",
            "Google Core Web Vitals: all green within 48 hours of deploy",
        ],
        problem: [
            "Site penalized after Google Core Web Vitals update — dropped from Page 1 to Page 4.",
            "7.3s load time due to unoptimized theme with 19 active plugins.",
            "Emergency service calls dropped 60% as organic rankings collapsed.",
        ],
        build: [
            "Emergency code audit: identified and removed 14 unused plugins.",
            "Rebuilt critical rendering path — eliminated all render-blocking resources.",
            "Replaced bloated contact form plugin with lightweight custom form.",
            "Compressed and converted all images to WebP with proper dimensions.",
            "Implemented server-side caching and CDN edge delivery.",
        ],
        result: [
            "Load time reduced from 7.3s to 0.9s.",
            "All Core Web Vitals passed within 48 hours of deployment.",
            "Organic rankings restored to Page 1 within 3 weeks.",
            "Emergency call volume returned to pre-penalty baseline.",
            "Monthly hosting cost reduced by $45/mo (removed unnecessary subscriptions).",
        ],
        stackTags: ["WordPress", "Cloudflare CDN", "WP Rocket", "WebP"],
    },

    {
        id: "dep-008",
        title: "Project Meridian",
        industry: "Real Estate",
        location: "Ontario",
        year: 2025,
        buildType: "Rebuild",
        outcomeGoals: ["Leads", "Speed", "Conversion Rate"],
        timelineWeeks: 5,
        impactScore: 84,
        metricBadge: { label: "Lead Conv. Rate", value: "1.4% → 5.2%" },
        outcomes: [
            "Lead conversion rate increased from 1.4% to 5.2%",
            "Property page load time: 0.8s average",
            "Measured post-launch: seller inquiry volume trending +120%",
            "100/100 Lighthouse Accessibility score",
        ],
        problem: [
            "IDX-dependent site with 6s+ load times on property pages.",
            "Generic template indistinguishable from hundreds of competitors.",
            "Lead capture limited to a single 'Contact Us' page with 11 required fields.",
        ],
        build: [
            "Custom property showcase pages with virtual tour embeds and neighborhood data.",
            "Streamlined lead capture: name, phone, interest — 3 fields max.",
            "Agent profile pages with active listings, sold history, and direct scheduling.",
            "Neighborhood guide pages for local SEO.",
            "Market report section for seller-focused content marketing.",
            "Performance-first image handling for high-resolution photography.",
            "CRM webhook integration for instant lead routing.",
            "Social proof section: recent closings, client testimonials, awards.",
        ],
        result: [
            "Lead conversion rate increased from 1.4% to 5.2% (+271%).",
            "Property page average load: 0.8s (down from 6.1s).",
            "Agent direct-booking usage: 73% of all new inquiries.",
            "Seller inquiry volume trending +120% (measured at 60 days post-launch).",
        ],
        stackTags: ["React", "TypeScript", "Vite", "Cloudflare", "Framer Motion", "Tailwind"],
    },

    {
        id: "dep-009",
        title: "Project Luxe",
        industry: "Local Brands",
        location: "Greater Toronto Area",
        year: 2024,
        buildType: "New build",
        outcomeGoals: ["Bookings", "Speed", "Conversion Rate"],
        timelineWeeks: 2,
        impactScore: 82,
        metricBadge: { label: "Online Bookings / Mo", value: "8 → 62" },
        outcomes: [
            "Online bookings surged from 8 to 62 per month (+675%)",
            "0.5s page load — fastest in the local vertical",
            "Booking form completion rate: 61%",
        ],
        problem: [
            "Social-media-only presence — no website, no way for customers to book online.",
            "All bookings handled via DMs — owner losing 3+ hours/day on manual scheduling.",
        ],
        build: [
            "Cinematic single-page site showcasing service packages with pricing tiers.",
            "Integrated online booking with package selection, date picker, and deposit payment.",
            "Before/after gallery with swipe slider pulled from owner's existing content.",
            "Google Business Profile setup and optimization.",
            "Review aggregation section pulling from Google Reviews.",
            "SMS confirmation integration via webhook.",
        ],
        result: [
            "Online bookings increased from 8/mo (via DMs) to 62/mo.",
            "Owner recovered ~15 hours/week previously spent on manual scheduling.",
            "Booking form completion rate: 61% (industry avg: ~20%).",
            "Measured post-launch: Google Business Profile impressions up 340%.",
        ],
        stackTags: ["React", "Vite", "Stripe", "Cloudflare Pages", "Tailwind"],
    },

    {
        id: "dep-010",
        title: "Project Apex",
        industry: "Clinics",
        location: "Ontario",
        year: 2025,
        buildType: "Rebuild",
        outcomeGoals: ["Bookings", "SEO", "Speed"],
        timelineWeeks: 3,
        impactScore: 87,
        metricBadge: { label: "New Patient Bookings", value: "+195%" },
        outcomes: [
            "+195% new patient bookings in first 60 days",
            "Page 1 for primary service keyword within 6 weeks",
            "Mobile booking completion rate: 52% (up from 11%)",
            "Measured post-launch: referral traffic from Google Maps up 80%",
        ],
        problem: [
            "Outdated CMS site with broken mobile layout and non-functional booking form.",
            "No individual service pages — all treatments listed in a single paragraph.",
            "Competitors outranking on every local keyword due to stronger technical SEO.",
        ],
        build: [
            "Service pages for each treatment category and specialization.",
            "Practitioner profile pages with credentials and direct booking links.",
            "Mobile-first booking flow integrated with clinic scheduling system.",
            "Patient resource section with educational content and recovery guides.",
            "Schema markup for medical business, practitioners, and FAQs.",
            "Google Business Profile alignment and citation cleanup.",
            "AODA and WCAG 2.1 AA compliance.",
        ],
        result: [
            "New patient bookings increased 195% in first 60 days.",
            "Mobile booking completion rate increased from 11% to 52%.",
            "Ranked Page 1 for primary keyword within 6 weeks.",
            "Google Maps referral traffic increased 80% (measured at 45 days).",
        ],
        proof: { lighthouse: "/assets/proof/apex-lighthouse.webp" },
        stackTags: ["React", "TypeScript", "Vite", "Cloudflare", "Tailwind"],
    },
];
