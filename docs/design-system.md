# Axiom Web — Public Site Design System

The public marketing site (everything except the private admin shell) uses one small, dependency-free design system. Pages are static Astro components with no client framework. The only JavaScript runs the mobile menu, the intake form, the studio film player and the card spotlight. All other motion is CSS.

## Principles

- **Cinematic, never confusing.** A dark stage, chrome headlines and soft light give the site its finish. Every word stays readable and every action stays obvious.
- **Content is visible by default.** Scroll-driven reveals use CSS `animation-timeline: view()` inside `@supports` and finish before an element reaches the middle of the screen. Browsers without support, and visitors with reduced motion, see everything at once. Nothing waits on JavaScript to appear.
- **Motion follows the reader.** Effects tied to scrolling (the work stage flattening, the industry ribbon, the lit statement, the process rail) only move when the visitor scrolls. Nothing loops on its own except the slow hero light and the featured price card's border, and both stop with reduced motion.
- **One typeface, one accent.** Inter (self-hosted variable font with the optical-size axis) for everything, and Axiom blue for actions and emphasis.
- **The real logo, untouched.** The header, footer and CTA use the original chrome artwork, never a redraw or recolour.
- **Honest proof.** The live client site is labelled “Client site · Live”; every demonstration is labelled “Concept build”. The numerals band only shows published commitments. No invented testimonials, ratings or metrics (see `AGENTS.md`).
- **Phone first.** Every layout is checked at 375–390px with no horizontal scroll.

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
| `--bg` | `#05070d` | Page canvas |
| `--bg-soft` | `#080b14` | Alternating sections (`.section-soft`) |
| `--surface` / `--surface-2` | `#0a0e19` / `#0f1424` | Cards, panels, table cells |
| `--line` / `--line-strong` | white at 8% / 16% | Borders and dividers |
| `--ink` | `#f4f6fb` | Headings, strong text (16.9:1 or better) |
| `--text` | `#a9b3c6` | Body copy (8.2:1 or better) |
| `--text-muted` | `#8a95aa` | Meta and supporting copy (5.7:1 or better) |
| `--accent` | `#93b1ff` | Links, eyebrows, icons (8.2:1 or better) |
| `--brand` | `#3a6cf0` | Primary button fill (white text 4.6:1 or better) |
| `--chrome` | white → `#8792a8` gradient | `h1`, `h2` and `.chrome-text` (lowest stop 5.5:1) |
| `--chrome-accent` | blue chrome gradient | `.accent-text` highlights |

Type scale is fluid (`--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-body`). Radii: 8 / 12 / 20 / 28px. Section rhythm: `--section`.

## Atmosphere and motion

| Effect | Where | How |
| --- | --- | --- |
| Film grain | Every page | Static SVG noise on `body::after` at 5% opacity |
| Chrome headlines | `h1`, `h2`, `.chrome-text` | `background-clip: text` with `--chrome` |
| Card spotlight | `.card` | `BaseLayout` sets `--mx`/`--my` on pointer move (fine pointers only) |
| Lit edges | `.card`, CTA panel | Gradient `border-box` background |
| Reveals | `.reveal`, `.reveal-stagger > *` | Scroll-driven `reveal-up`, CSS only |
| Page transitions | Same-site navigations | `@view-transition { navigation: auto; }` cross-fade |
| Hero | Home | Light beam, drifting aurora, perspective floor, lines rising in |
| Work stage | Home | Real screenshots tilted in 3D that flatten as the page scrolls |
| Statement | Home | Words light up in reading order while scrolling |
| Process rail | Home | Line fills as the reader moves through the steps |
| Featured price | `PricingCards` | Slowly orbiting gradient border |

Every effect has a static fallback and is off under `prefers-reduced-motion`.

## Building blocks

- **Layout:** `.container`, `.container-narrow`, `.section`, `.section-sm`, `.section-soft`, `.grid` + `.grid-2/3/4`.
- **Atmosphere:** `.glow`, `.grid-lines`, `.chrome-text`, `.accent-text`, `.reveal`, `.reveal-stagger`.
- **Section heading:** `.section-head` (eyebrow, `h2`, lead) and `.section-head-row` (heading with a right-aligned link).
- **Buttons:** `.btn` (primary), `.btn-secondary` (glass), `.btn-light` (white, for the strongest action on a panel), `.btn-outline-light`, sizes `.btn-sm` / `.btn-lg`, `.btn-block`; `.arrow-link` for tertiary links.
- **Cards:** `.card`, `.card-link` + `.stretched` for whole-card links without nested interactive elements.
- **Lists:** `.check-list` (`.cols-2`), `.dash-list`.
- **Components:** `PageHero` (breadcrumbs, title, lead, actions, optional aside), `CtaBand`, `FaqList` (native `<details>`), `PricingCards`, `ProcessSteps` (compact or detailed timeline), `WorkCard` (`featured` for the wide lead project), `LinkCard`, `IndustryGrid`, `FounderCards`, `BrowserFrame`, `Film`, `IntakeForm`, `LegalPage`, `EmailText` (the studio email with a line break allowed after “@”; use it wherever the address is shown).

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
3. Start with `PageHero`, alternate `.section` / `.section-soft`, add `.reveal-stagger` to card grids, and finish with `CtaBand`.
4. If the page needs response headers, add them to `public/_headers` under a single matching rule. A path matched by two rules that set the same header gets it twice, and the build audit rejects that.
5. Link it from the footer or a hub page, then run `npm run build` — the SEO audit fails on orphan pages, missing metadata, heading skips, broken links or schema that doesn't match visible content.
