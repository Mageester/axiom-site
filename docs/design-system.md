# Axiom Web — Public Site Design System

The public marketing site (everything except the private admin shell) uses one small, dependency-free design system. Pages are static Astro components with no client framework; the only JavaScript is the mobile menu, the intake form and the studio film player.

## Principles

- **Clarity over effect.** Content is always visible on load. No scroll-reveal hiding, no parallax, no motion that delays reading.
- **One typeface, one accent.** Inter (self-hosted variable font) for everything; Axiom blue for actions and emphasis.
- **Honest proof.** The live client site is labelled “Client site · Live”; every demonstration is labelled “Concept build”. No invented testimonials, ratings or metrics (see `AGENTS.md`).
- **Phone first.** Every layout is checked at 375–390px with no horizontal scroll.

## Where things live

| Concern | Location |
| --- | --- |
| Tokens, base elements, buttons, cards, forms, lists | `src/styles/site.css` |
| Page shell (head, metadata, JSON-LD, header, footer) | `src/layouts/BaseLayout.astro` |
| Shared components | `src/components/site/` |
| Icons (inline SVG paths) | `src/lib/icons.ts` + `src/components/site/Icon.astro` |
| Logo mark (vector) | `src/lib/brand.ts` + `src/components/site/Logo.astro` |
| Content (single source of truth) | `src/content/*.ts` |
| SEO metadata and structured data | `src/lib/seo.ts` |
| Favicons and app icons | `node scripts/generate-brand-assets.mjs` |
| Social share cards | `src/pages/social/[slug].png.ts` (built per page) |

The private admin shell keeps its own dark Tailwind theme (`src/styles/globals.css`, `src/layouts/AdminLayout.astro`) and does not load `site.css`.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0b1324` | Headings, strong text |
| `--text` | `#3b4658` | Body copy (9.5:1 on white) |
| `--text-muted` | `#5f6b7d` | Meta and supporting copy (5.4:1 on white) |
| `--brand` | `#2453d6` | Primary buttons, links, eyebrows (6.4:1 on white) |
| `--brand-soft` | `#edf2fe` | Icon tiles, highlighted rows |
| `--bg-soft` | `#f7f9fc` | Alternating sections |
| `--night` | `#0a1122` | Footer and CTA band |
| `--night-accent` | `#9db5ff` | Accent on dark surfaces |

Type scale is fluid (`--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-body`). Radii: 8 / 12 / 18 / 24px. Section rhythm: `--section`.

## Building blocks

- **Layout:** `.container`, `.container-narrow`, `.section`, `.section-sm`, `.section-soft`, `.grid` + `.grid-2/3/4`.
- **Section heading:** `.section-head` (eyebrow, `h2`, lead) and `.section-head-row` (heading with a right-aligned link).
- **Buttons:** `.btn` (primary), `.btn-secondary`, `.btn-light` / `.btn-outline-light` (dark surfaces), sizes `.btn-sm` / `.btn-lg`, `.btn-block`; `.arrow-link` for tertiary links.
- **Cards:** `.card`, `.card-link` + `.stretched` for whole-card links without nested interactive elements.
- **Lists:** `.check-list` (`.cols-2`), `.dash-list`.
- **Components:** `PageHero` (breadcrumbs, title, lead, actions, optional aside), `CtaBand`, `FaqList` (native `<details>`), `PricingCards`, `ProcessSteps` (compact or detailed timeline), `WorkCard`, `LinkCard`, `IndustryGrid`, `FounderCards`, `FactsBar`, `BrowserFrame`, `Film`, `IntakeForm`, `LegalPage`.

## Adding a page

1. Add copy to the relevant `src/content/*.ts` file (or a route entry in `SEO_ROUTES`).
2. Render it inside `BaseLayout` with `title`, `description`, `crumbs` and any page-specific `schema`.
3. Start with `PageHero`, alternate `.section` / `.section-soft`, and finish with `CtaBand`.
4. Link it from the footer or a hub page, then run `npm run build` — the SEO audit fails on orphan pages, missing metadata, heading skips, broken links or schema that doesn't match visible content.
