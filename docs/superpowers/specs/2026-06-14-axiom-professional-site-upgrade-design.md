# Axiom Professional Site Upgrade Design

Date: 2026-06-14

## Decision

Upgrade Axiom around a restrained conversion-authority direction while preserving the current live palette.

The site should keep the dark base, warm off-white type, muted neutral support text, thin hairlines, restrained surfaces, and minimal glow. The improvement should come from sharper hierarchy, cleaner page rhythm, stronger buyer-language, more credible proof framing, and a smoother path from interest to project intake.

## What Stays Locked

- Current color world: dark base, warm ink, muted taupe/grey support text, monochrome emphasis.
- Premium restrained tone: calm, selective, technical, high-trust.
- No fabricated testimonials, fake metrics, fake logos, or fake client case studies.
- No defensive comparisons against Wix, Squarespace, WordPress, or similar tools.
- No low-frame phrasing such as "website building" or freelancer-style explanations.
- Existing pricing shapes: managed monthly, ownership/upfront, custom scope.
- The two-founder trust angle, but used selectively rather than everywhere.

## Core Experience Goal

A serious local business owner should understand three things within the first screen:

- Axiom makes the business look more credible.
- Axiom makes the path to inquiry or booking easier.
- Axiom has a defined, direct, professional way to get the work done.

The site should feel more like a selective digital partner than a general web agency.

## Copy System

The copy should be buyer-led. It should describe business outcomes rather than implementation mechanics.

Use phrases like:

- "digital presence"
- "site system"
- "inquiry path"
- "booking flow"
- "proof placement"
- "launch standard"
- "managed support"
- "ownership path"

Avoid overinflated or mismatched phrases when they make simple offers feel artificial:

- "capital structure"
- "platform deployment"
- "commercial authority"
- "enterprise" unless the scope truly supports it
- "agency" as a default self-description

Every page should answer:

- What problem does this solve?
- Why should a serious business trust Axiom?
- What does the buyer get?
- What happens next?

## UI System

The UI should be simplified into a few high-confidence patterns:

- Editorial hero sections with one strong headline, one concise supporting paragraph, and two clear actions.
- Full-width bands and section breaks rather than stacked nested cards.
- Cards only for repeated items, pricing options, work samples, FAQs, and framed tools.
- Stronger typographic contrast between hero, section heading, body, metadata, and CTA.
- More consistent CTA language across the site.
- More deliberate spacing between sections so the page feels composed rather than assembled.
- Fewer decorative elements; depth should come from layout, image scale, hairlines, and type.

## Homepage Design

The homepage should become one continuous sales argument:

1. Hero: clear premium promise, direct CTA, secondary proof or work link.
2. Credibility band: concise operating facts without fake proof.
3. Problem: the business is being judged before the first call.
4. Solution: clarity, proof placement, speed, and inquiry flow.
5. Work: concept builds framed as demonstrations of the standard.
6. Services: three offer paths with concise buyer fit.
7. Pricing preview: enough clarity to reduce uncertainty before pricing page.
8. Process: defined path from review to launch.
9. Team/trust: two partners, direct ownership of the work.
10. Final CTA: selective and direct.

Recommended hero direction:

"A sharper digital presence for serious local businesses."

Support:

"Axiom builds fast, high-trust sites that make the offer clear, place proof where buyers decide, and turn attention into qualified inquiries."

## Work Page Design

The work page should stop feeling like a generic portfolio grid and become a proof-of-standard page.

Each concept should show:

- Business category.
- Original weakness.
- What Axiom changed.
- Why the new structure converts.
- Link to open the demo.

The page must clearly label these as concept builds or demonstration builds. That keeps the proof honest while still showing capability.

## Pricing Page Design

Pricing should feel calm and decisive, not over-technical.

Rename or reframe tiers toward buyer clarity:

- Managed Site Partnership: low upfront, hosting/support included, ownership option.
- Ownership Build: upfront purchase, handoff at launch.
- Custom Scope: larger rebuilds, ecommerce, integrations, or migrations.

The comparison table should be simplified around buyer questions:

- Starting cost.
- Best fit.
- Hosting.
- Updates.
- Ownership.
- Timeline.
- Support.

FAQ copy should be shorter, more plainspoken, and less corporate.

## Services Design

Services should read as entry points, not generic capabilities.

Each service should answer:

- Who this is for.
- What is broken before Axiom.
- What changes after Axiom.
- What the buyer gets.
- Which pricing path usually fits.

The service detail pages should reuse the same structure so the site feels systematic.

## About And Trust

The two-person studio story is valuable, but it should be used as proof of accountability, not as the primary product.

Emphasize:

- Direct access to the people doing the work.
- Clear roles.
- No account layers.
- Defined response expectations.
- Ongoing support after launch.

Use the founder-led angle most strongly on About, Contact, final CTAs, and pricing FAQs.

## Intake And Contact UX

The start/contact flow should feel selective and controlled.

Improve the copy around intake:

- "Start a project conversation" rather than generic form language.
- Explain response time and what the buyer receives next.
- Make fit signals clear: business type, current site, target action, preferred investment path.
- Keep direct email/phone available without making them compete with intake.

Form success and error states should be calm, specific, and useful.

## Component Boundaries

Keep implementation scoped to the public marketing site:

- Shared page section patterns.
- Shared CTA language.
- Shared proof/work item pattern.
- Pricing tier and comparison components.
- FAQ copy and structure.
- Intake/contact copy.

Avoid unrelated admin, omniscient, backend, or demo-app changes.

## Accessibility And UX Requirements

- Maintain one clear `h1` per page.
- Preserve keyboard focus states and mobile menu accessibility.
- Keep tap targets at least 44px high.
- Avoid layout shifts from dynamic labels, buttons, and images.
- Respect reduced-motion preferences.
- Make text fit on mobile without viewport-scaled font hacks.
- Maintain strong contrast using the current palette.

## Verification

Before completion, run:

- `npm run build`
- `npm run audit:seo`
- Relevant public-page visual checks in the browser

If implementation changes layout materially, inspect at mobile and desktop widths. The final site should feel more professional because the argument is clearer, the rhythm is calmer, the proof is more honest, and the buyer path is easier to follow.
