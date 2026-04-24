# Legacy SPA Cleanup Catalog

Date: 2026-04-24
Scope: catalog only. Do not delete anything before owner sign-off.

System of record remains Astro static pages with a separate admin shell. The files below appear to belong to a previous Vite/React SPA or attempted Next setup. This catalog checks whether each artifact is referenced by the current Astro build or admin runtime.

## Summary

| Artifact | Referenced by current Astro public build? | Referenced by admin runtime? | Current assessment |
| --- | --- | --- | --- |
| `vite.config.ts` | No | No | Legacy Vite SPA config; referenced only by `tsconfig.node.json`. |
| `index.html` | No | No direct source reference | Legacy Vite SPA HTML entry. Runtime references to `/index.html` target built output, not this source file. |
| `next.config.mjs` | No | No | Orphan Next config. No Next package or script is present. |
| `next-env.d.ts` | No | No | Orphan Next type file; ignored by ESLint config. |
| `eslint.config.mjs` | No build reference | No | Current config imports Next ESLint presets and is likely stale until Phase 10 lint setup. |
| `src/react-pages/About.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/AuditPage.tsx` | No public build route | Yes | Used by `src/components/admin/AdminShell.tsx` for `/admin/audit`; do not remove until admin replacement exists. |
| `src/react-pages/ContactPage.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/Deployments.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/Home.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/Infrastructure.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/NotFoundPage.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/PricingPage.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/PrivacyPage.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |
| `src/react-pages/TermsPage.tsx` | No | No | Legacy public SPA route via `src/App.tsx` only. |

`src/react-pages/admin/*` is intentionally excluded from the removal set because admin routes still import those files.

## Reference Findings

- `src/main.tsx` mounts `src/App.tsx` into `#root`; that entry is only used by the legacy root `index.html`.
- `src/App.tsx` imports all non-admin `src/react-pages/*` files and lazy-loads `src/react-pages/admin/*`, but `src/App.tsx` itself is not imported by current Astro pages.
- `src/components/admin/AdminShell.tsx` imports `src/react-pages/admin/*` and `src/react-pages/AuditPage.tsx`; this makes `AuditPage.tsx` an active admin runtime dependency.
- `src/pages/admin-shell.astro` renders `AdminShell` with `client:only="react"`, so admin dependencies must be preserved.
- `tsconfig.node.json` includes `vite.config.ts`; the root `package.json` does not expose a Vite build or dev script.
- `functions/_utils/omniscient-page.ts` requests `/index.html` at runtime, but that resolves to deployed/build output. It is not a source import of the root `index.html`.
- `scripts/prerender.mjs` reads and writes `dist/index.html`; it does not read the root `index.html` source file.

## Proposed Removal Plan

1. Owner confirms the legacy Vite SPA is no longer needed for demos, admin fallback, or production rollback.
2. Phase 1 avoids deleting these files; it may work around them while establishing tokens and primitives.
3. Phase 3 rebuilds public pages from Astro sources and verifies that no public route depends on `src/react-pages/*`.
4. Phase 6 removes unused public legacy dependencies only after the public/admin bundle split is measured.
5. Phase 10 adds lint/typecheck/CI coverage and removes or replaces the stale Next ESLint config.
6. After admin confirms `/admin/audit` can be replaced or retired, remove `src/react-pages/AuditPage.tsx`; keep `src/react-pages/admin/*` until a separate admin cleanup phase.

Do not delete the cataloged files before owner sign-off.
