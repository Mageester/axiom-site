# Phase 1 Report

Date: 2026-04-24
Branch: `phase/1-design-system`

## Completed

- Upgraded Astro to `^6.1.9`.
- Removed `@astrojs/tailwind` because the latest package only supports Astro 3-5 and the older package failed during Astro 6 config setup. Tailwind remains active through `postcss.config.js`.
- Deleted owner-rejected testimonial avatars and removed their optimization jobs.
- Removed or softened unverified proof claims across public source and legacy source before deletion.
- Deleted the approved dead legacy SPA pages while keeping `src/react-pages/AuditPage.tsx` and `src/react-pages/admin/*`.
- Isolated `src/App.tsx` to the retained admin runtime.
- Added `src/design/tokens.ts`, aligned CSS/Tailwind token vocabulary, removed third-party font hosts, and self-hosted Archivo + Cormorant Garamond through Fontsource.
- Added Astro primitives in `src/components/primitives/`.
- Documented token pairings and primitive usage in `docs/design-system.md`.

## Commits

- `3ed1a42 chore(deps): upgrade Astro`
- `8f4263a fix(content): remove unverified proof claims`
- `9351525 chore(cleanup): remove dead legacy SPA pages`
- `709c108 feat(design): add Phase 1 tokens and primitives`

## Verification

- After Astro upgrade: `npm run build`, `npm run test:intake`.
- After proof-claim cleanup: `git diff --check`, `npm run build`, `npm run test:intake`.
- After legacy cleanup: `git diff --check`, `npm run build`, `npm run test:intake`.
- After tokens/primitives: `git diff --check`, `npm run build`, `npm run test:intake`.

## Notes

- The remaining npm audit findings are the Phase 10 dev-tooling group identified in `docs/audit/05-vulnerabilities.md`.
- `src/react-pages/AuditPage.tsx` still contains the owner-approved admin-surface `within 24 hours` copy.
- Root orphan configs remain in place for Phase 10 owner sign-off, per the Phase 1 decision.
