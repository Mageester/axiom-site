# Phase 0 Inventory

Date: 2026-04-24
Branch: `phase/0-audit`
Baseline commit: `b31b6eb`

## Stack

- Astro static output with `@astrojs/react` islands and Tailwind CSS.
- Cloudflare Pages static assets plus Pages Functions under `functions/`.
- Resend and D1 are wired through the intake function.
- Existing admin/omniscient surface is present and must be preserved.
- `zustand` is installed; Redux Toolkit / RTK is not installed yet.

## Public Routes

| Route | Source file | Notes |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Home page. |
| `/about` | `src/pages/about.astro` | Public about page. |
| `/contact` | `src/pages/contact.astro` | Contains `QuickContactWizard`, so this is currently a form route. |
| `/pricing` | `src/pages/pricing.astro` | Public investment/pricing page. |
| `/privacy` | `src/pages/privacy.astro` | Legal page. |
| `/process` | `src/pages/process.astro` | Legacy/canonical process page today; should redirect to `/approach` in Phase 2. |
| `/start` | `src/pages/start.astro` | Legacy intake page; contains `IntakeForm.astro`. |
| `/start-a-project` | `src/pages/start-a-project.astro` | Current project intake page; contains `ProjectIntakeWizard`. |
| `/terms` | `src/pages/terms.astro` | Legal page. |
| `/work` | `src/pages/work.astro` | Work index only; no detail routes. |
| `/404.html` | `src/pages/404.astro` | Static 404 page. |
| `/admin-shell` | `src/pages/admin-shell.astro` | Admin shell entry, noindex. |

Missing canonical routes from the v2 plan: `/services`, `/services/[slug]`, `/approach`, `/work/[slug]`.

## React Islands And Interactive Components

- Public islands: `FadeIn`, `MotionHeading`, `MotionQuote`, `NumberCount`, `ProofBar`, `Timeline`, `WorkShowcase`, `ProjectIntakeWizard`, `QuickContactWizard`, `HomepageStats`, `SocialProof`, `FloatingAffordances`, `ScrollProgressBar`.
- Legacy React SPA pages remain under `src/react-pages/` and use `react-router-dom`; they are not part of Astro page routing but remain in the repo.
- Admin React surface lives under `src/omniscient/`, `src/components/admin/`, and `src/react-pages/admin/`.

## Shared Components

Core public/shared components discovered:

- Layouts: `src/layouts/BaseLayout.astro`, `src/layouts/SiteLayout.astro`, `src/layouts/AdminLayout.astro`.
- Navigation/footer: `src/components/layout/NavBar.astro`, `src/components/layout/Footer.tsx`, plus older `src/components/Layout.tsx` and `src/components/Footer.tsx`.
- UI: `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `Eyebrow.tsx`, `FadeIn.tsx`, `RevealBlock.tsx`, `DrawIcon.astro`.
- Site: `IntakeForm.astro`, `ProjectIntakeWizard.tsx`, `QuickContactWizard.tsx`, `LegalPage.astro`, `ResponsivePicture.astro`, `FounderAvatar.tsx`.
- SEO: `src/components/SEO.tsx` manipulates head tags client-side; Astro pages also use `BaseLayout.astro` for SSR/static meta.

There is no `src/components/primitives/` layer yet.

## Design Tokens

Existing token files:

- `src/styles/tokens.css`
- `src/styles/globals.css`
- Tailwind config in `tailwind.config.js`

Key gaps:

- No `src/design/tokens.ts` source of truth.
- Current fonts are aligned to the Inter + Inter Display system, with JetBrains Mono reserved for technical UI.
- Token values include pure black `#000000`, yellow-gold `#d4af37`, 16px card radii, pill/rounded-full patterns, glow shadows, and many rgba one-offs.
- Tailwind still defines `borderRadius.pill = 999px` and `borderRadius.card = 16px`, both outside the v2 standard.
- Public pages contain many inline Tailwind arbitrary values such as `text-[...]`, `rounded-[...]`, `bg-[...]`, and custom shadows.

## Dependencies

Direct runtime dependencies:

- Astro/React: `astro`, `@astrojs/react`, `@astrojs/tailwind`, `react`, `react-dom`.
- UI/motion: `framer-motion`, `lucide-react`, `@radix-ui/react-label`, `@radix-ui/react-slot`, `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- State/routing: `zustand`, `react-router-dom`.
- Cloudflare/testing: `@cloudflare/playwright`, `wrangler`, `@cloudflare/workers-types`, `playwright`, `@playwright/test`.
- Validation/mail/storage path: `zod`; Resend is called with raw `fetch`.
- Other: `@google/generative-ai`, `sharp`.

`npm audit --json` reports 8 vulnerabilities: 4 moderate and 4 high. Raw file: `docs/audit/raw/npm-audit.json`.

## Third-Party Scripts, Fonts, And Embeds

Found third-party font loads in `src/layouts/BaseLayout.astro`:

- Google Fonts: `fonts.googleapis.com`, `fonts.gstatic.com`.
- Fontshare: `api.fontshare.com`, `cdn.fontshare.com` allowed in CSP.

Found external service calls:

- Cloudflare Turnstile verify: `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
- Resend API: `https://api.resend.com/emails`.
- Cloudflare Web Analytics appears allowed in `public/_headers` CSP (`static.cloudflareinsights.com`, `cloudflareinsights.com`), but no public analytics script tag was found in the Astro layout.

No iframe embeds found in the public pages during this pass.

## Forms And Submission Endpoints

Current form surfaces:

- `/start-a-project`: `src/components/site/ProjectIntakeWizard.tsx`, posts to `/api/intake`.
- `/start`: `src/components/site/IntakeForm.astro`, posts to `/api/intake`.
- `/contact`: `src/components/site/QuickContactWizard.tsx`, posts to `/api/contact`, which proxies to `/api/intake`.
- Legacy React page `src/react-pages/ContactPage.tsx` contains both `/api/contact` and `/api/intake` form code.
- Legacy audit page `src/react-pages/AuditPage.tsx` posts to `/api/intake`.

This violates the planned single conversion path: only `/start-a-project` should contain a form.

## CTA Inventory

Central CTA config: `src/lib/cta.ts`.

- Primary: `/start-a-project`, label `Start a project`.
- Work: `/work`, label `See the Work`.
- Process: `/process`, label `See the process`.
- Contact: `/contact`, label `Contact`.
- Review: `/start-a-project`, label `Request review`.

Known drift:

- `process` CTA points to `/process`, not the planned `/approach`.
- `/start` remains live and linked internally from SEO metadata as canonical `/start`.
- Contact copy still describes a form route.

## External Links And Noopener

Public external anchors found:

- Font stylesheet/preconnect links in `BaseLayout.astro`.
- `mailto:` and `tel:` links in footer, contact page, and floating affordances.
- Legacy React deployment links with `target="_blank"` include `rel="noopener noreferrer"`.

No public `target="_blank"` link without `rel` was found in this pass.

## SEO Files

- Static hand-authored sitemap exists at `public/sitemap.xml`.
- Sitemap includes `/services/` and three `/services/[slug]/` URLs that do not resolve in the current Astro route tree.
- Sitemap omits several resolving routes: `/pricing`, `/process`, `/start`, `/start-a-project`, `/terms`, `/privacy`, `/work`.
- `robots.txt` allows everything and does not block `/api/`, admin, or draft routes.
- SEO metadata source is split between `src/lib/seo.ts`, `BaseLayout.astro`, and client-side `SEO.tsx`.

## Redirects And Headers

Current `public/_redirects` maps admin and omniscient routes to `/admin-shell` as 200 rewrites:

- `/admin/*`, `/dashboard`, `/vault`, `/leads`, `/leads/*`, `/lead/*`, `/triage`, `/settings`, `/account`, `/hunt`, `/jobs`, `/campaigns`.

No current 301 redirects for `/process -> /approach` or `/start -> /start-a-project`.

`public/_headers` contains CSP and cache rules. CSP still allows external font origins.

## Cloudflare Pages Functions

Public/form functions:

- `functions/api/intake.ts`: validation, Turnstile, Resend, D1 intake persistence path.
- `functions/api/contact.ts`: proxies contact requests to intake.
- `functions/api/public/website-request.ts`: public website request endpoint.
- `functions/api/_middleware.ts`: CORS handling for intake/contact.

Admin/auth/data functions:

- Auth: `functions/api/auth/*`, `functions/admin/login.ts`, `functions/admin/_middleware.ts`.
- Inquiries: `functions/admin/inquiries*`, `functions/api/inquiries/*`.
- Campaigns/jobs/leads/tags: `functions/api/campaigns/*`, `jobs/*`, `leads/*`, `tags/*`.
- Omniscient: `functions/api/omniscient/*`, `functions/api/_utils/omniscient*`, `functions/_utils/omniscient-page.ts`.
- Top-level admin rewrites/helpers: `account.ts`, `campaigns.ts`, `dashboard.ts`, `hunt.ts`, `jobs.ts`, `leads.ts`, `settings.ts`, `triage.ts`, `vault.ts`, `index.ts`.

## Admin Surface Inventory

Preserved admin routes currently served by `_redirects`:

- `/admin/*`: protected admin shell and admin API helpers.
- `/dashboard`: admin dashboard.
- `/vault`: admin vault.
- `/leads`, `/leads/*`, `/lead/*`: lead management.
- `/triage`: triage workspace.
- `/settings`: admin settings.
- `/account`: account page.
- `/hunt`: prospecting/hunt tooling.
- `/jobs`: jobs tooling.
- `/campaigns`: campaign management.

Admin-specific styles are concentrated in `src/omniscient/styles.css`, which uses a different color/motion system and is out of scope for public redesign except compatibility fixes.
