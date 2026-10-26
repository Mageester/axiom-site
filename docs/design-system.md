# Axiom Web — Public Site Design System

The public marketing site (everything except the private admin shell) uses one small, dependency-free design system. Pages are static Astro components with no client framework. The only JavaScript runs the mobile menu, the intake form and the studio film player. All other motion is CSS.

## Principles

- **Editorial, not template.** The polish comes from type, spacing, hairline rules and composition. Sections are numbered, labels sit in small wide capitals, and real work is shown large with a credits-style caption.
- **One typeface, one accent.** Archivo (self-hosted, with width and weight axes) for everything. Its expanded cut (`font-stretch: 118%`) sets headlines and echoes the wide AXIOM wordmark; the normal width sets body text. Axiom blue appears only in section numbers, links on hover and focus rings.
- **Content is visible by default.** Scroll-driven reveals use CSS `animation-timeline: view()` inside `@supports` and only move elements (a short rise); they never fade text, so contrast holds at every scroll position. The lit statement's dimmest state stays above the 3:1 large-text minimum. Visitors with reduced motion see everything static.
- **Motion follows the reader.** Effects tied to scrolling (the work frame settling, the lit statement, the process rail) only move when the visitor scrolls. Nothing loops on its own.
- **The real logo, untouched.** The header, footer and CTA use the original chrome artwork, never a redraw or recolour.
- **Honest proof.** The live client site is labelled “Client site · Live”; every demonstration is labelled “Concept build”. The numerals band only shows published commitments. No invented testimonials, ratings or metrics (see `AGENTS.md`).
- **Phone first.** Every layout is checked at 320–390px with no horizontal scroll.

### Avoiding the generic “AI-generated” look

These are the patterns most often cited as tells of generated sites. Don't reintroduce them:

- Inter (or any single default sans) on every element, or purple/blue gradient glows and gradient text.
- A centred hero with a pill badge above the headline and a row of checkmarks below it.
- Grids of identical rounded cards, each with an icon tile, a heading and two lines of text. Use the numbered index list (`IndexList`) or a numbered text list instead.
- Frosted-glass panels, glowing buttons, cursor-following spotlights, tilted 3D screenshots, logo/keyword marquees and animated gradient borders.
- Emoji as icons, and copy that would still read true for any other business.

## Where things live

| Concern | Location |
| --- | --- |
| Tokens, base elements, buttons, cards, forms, lists | `src/styles/site.css` |
| Page shell (head, metadata, JSON-LD, header, footer) | `src/layouts/BaseLayout.astro` |
| Shared components | `src/components/site/` |
| Icons (inline SVG paths) | `src/lib/icons.ts` + `src/components/site/Icon.astro` |
| Logo (original chrome artwork) | `brand/source/` → `public/brand/axiom-logo.webp`, `src/lib/logo.json`, `src/components/site/Logo.astro` |
| Content (single source of truth) | `src/content/*.ts` |
| SEO metadata and structured data | `src/lib/seo.ts` |
| Favicons and app icons | `node scripts/generate-brand-assets.mjs` |
| Social share cards | `src/pages/social/[slug].png.ts` (built per page) |

The private admin shell keeps its own dark Tailwind theme (`src/styles/globals.css`, `src/layouts/AdminLayout.astro`) and does not load `site.css`.

## Tokens

All text colours meet WCAG AA on every surface they're used on.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0b0b0c` | Page canvas (neutral, not tinted) |
| `--bg-soft` | `#0f0f10` | Alternating sections (`.section-soft`) |
| `--surface` / `--surface-2` | `#141415` / `#19191b` | Cards, panels, table cells |
| `--line` / `--line-strong` | white at 9% / 18% | Hairlines and borders |
| `--ink` | `#f2f1ec` | Headings, strong text, primary button fill (15.5:1 or better) |
| `--text` | `#b6b5ae` | Body copy (8.5:1 or better) |
| `--text-muted` | `#8f8e88` | Labels and supporting copy (5.3:1 or better) |
| `--accent` | `#8ea8ff` | Section numbers, link hover, focus ring (7.7:1 or better) |
| `--wdth-display` / `--wdth-heading` | `118%` / `112%` | Archivo width for `h1` and display sizes / `h2`, labels |

Type scale is fluid (`--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-body`, `--fs-label`). Radii are tight and angular, like the blades of the mark: 3 / 4 / 6 / 8px. Section rhythm: `--section`. Two metric-matched fallbacks (`Archivo Fallback`, `Archivo Display Fallback`) keep layout from shifting while the font loads.

## Atmosphere and motion

| Effect | Where | How |
| --- | --- | --- |
| Film grain | Every page | Static SVG noise on `body::after` at 4.5% opacity |
| Drafting grid | Home hero, `PageHero` | `.grid-lines`: faint vertical column lines that fade down |
| Section numbers | Every `.section-head` | CSS counter on `main`: “(01) Services”, “(02) Work”… |
| Reveals | `.reveal`, `.reveal-stagger > *` | Scroll-driven `reveal-up` (a short rise, never a fade), CSS only |
| Page transitions | Same-site navigations | `@view-transition { navigation: auto; }` cross-fade |
| Hero | Home | Headline lines rise from their own masks |
| Work frame | Home | The live client site settles to full size as it scrolls in |
| Statement | Home | Words light up in reading order while scrolling |
| Process rail | Home | Line fills as the reader moves through the steps |

Every effect has a static fallback and is off under `prefers-reduced-motion`.

## Building blocks

- **Layout:** `.container`, `.container-narrow`, `.section`, `.section-sm`, `.section-soft`, `.grid` + `.grid-2/3/4`.
- **Atmosphere:** `.grid-lines`, `.reveal`, `.reveal-stagger`.
- **Labels and lists:** `.label` / `.eyebrow` (small wide capitals), `.index-list` / `.index-row` (numbered rows on hairlines, via `IndexList`).
- **Section heading:** `.section-head` (eyebrow, `h2`, lead) and `.section-head-row` (heading with a right-aligned link).
- **Buttons:** flat and square-cornered. `.btn` (ink fill), `.btn-secondary` / `.btn-outline-light` (hairline), `.btn-light`, sizes `.btn-sm` / `.btn-lg`, `.btn-block`; `.arrow-link` (underlined) for tertiary links.
- **Cards:** `.card`, `.card-link` + `.stretched` for whole-card links without nested interactive elements.
- **Lists:** `.check-list` (`.cols-2`), `.dash-list`.
- **Components:** `PageHero` (breadcrumbs, title, lead, actions, optional aside), `CtaBand`, `FaqList` (native `<details>`), `PricingCards`, `ProcessSteps` (compact or detailed timeline), `WorkCard` (`featured` for the wide lead project), `LinkCard`, `IndexList`, `IndustryGrid` (an index list), `FounderCards`, `BrowserFrame`, `Film`, `IntakeForm`, `LegalPage`, `EmailText` (the studio email with a line break allowed after “@”; use it wherever the address is shown).

## Logo

The logo is the original chrome lockup from `brand/source/axiom-logo-chrome.png`; app icons use `brand/source/axiom-mark-chrome.png`. Run `node scripts/generate-brand-assets.mjs` after changing either source. The script writes the web asset, the favicons and `src/lib/logo.json`.

The chrome artwork is made for dark surfaces. The header and footer use the full lockup; the CTA panel and footer also carry it as a faint watermark (`public/brand/axiom-mark.webp`, `public/brand/axiom-logo.webp`). `Logo.astro` stacks four copies of the image, each clipped along the artwork's own dark seams (three blades and the wordmark), so the parts can animate yet read as one image at rest:

- **First page of a visit:** the blades rise in sequence, the wordmark wipes in, then a chrome glint sweeps across (about 2.3s).
- **Later pages:** a single glint.
- **Hover or keyboard focus:** a highlight sweeps across.
- **Reduced motion:** static.

## Adding a page

1. Add copy to the relevant `src/content/*.ts` file (or a route entry in `SEO_ROUTES`).
2. Render it inside `BaseLayout` with `title`, `description`, `crumbs` and any page-specific `schema`.
3. Start with `PageHero`, alternate `.section` / `.section-soft`, prefer `IndexList` or numbered lists over icon cards, add `.reveal-stagger` to grids, and finish with `CtaBand`.
4. If the page needs response headers, add them to `public/_headers` under a single matching rule. A path matched by two rules that set the same header gets it twice, and the build audit rejects that.
5. Link it from the footer or a hub page, then run `npm run build` — the SEO audit fails on orphan pages, missing metadata, heading skips, broken links or schema that doesn't match visible content.
