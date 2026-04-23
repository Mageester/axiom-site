# Phase 1 Report

## What shipped
- Token source of truth: `src/design/tokens.ts`
- Self-hosted brand fonts:
  - `public/fonts/archivo/archivo-latin.woff2`
  - `public/fonts/cormorant-garamond/cormorant-garamond-latin.woff2`
- Tailwind token integration: `tailwind.config.js`
- Runtime token injection and font CDN removal: `src/layouts/BaseLayout.astro`
- Shared global token consumption: `src/styles/globals.css`
- Compatibility handoff note: `src/styles/tokens.css`
- Primitive layer:
  - `src/components/primitives/*`
  - `src/components/primitives/README.md`
- Existing UI aliases updated to point at the primitive layer:
  - `src/components/ui/button.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/label.tsx`
  - `src/components/ui/Eyebrow.tsx`
- Design-system documentation: `docs/design-system.md`
- Regex audit:
  - `scripts/audit-design-tokens.mjs`
  - `docs/audit/token-regex-audit.json`
  - `docs/audit/05-token-regex-audit.md`

## What was skipped
- No route/page rebuild work was done in this phase.
- Legacy public page implementations were not force-migrated to the new token layer yet; they are intentionally deferred to Phases 2 and 3.
- A lint run was not possible because `package.json` still does not define a `lint` script.

## Decisions needing owner sign-off
- None for the token foundation itself.

## New risks or surprises
- The shared foundation is now token-driven, but current page files still contain legacy one-off styling that will disappear only when the page rebuild phases land.
- `npm run test:intake` is green in this worktree after rebasing onto current `origin/main`, which means the earlier Phase 0 failure mode was specific to the earlier audit branch state rather than a persistent current-main defect.

## Next phase dependencies
- Phase 2 can proceed directly on top of this branch.
- Route rebuild work should consume the primitive layer instead of introducing new one-off styling.
