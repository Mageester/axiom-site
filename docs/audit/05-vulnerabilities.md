# Phase 0 Vulnerability Triage

Date: 2026-04-24
Source: `docs/audit/raw/npm-audit.json`

`npm audit` reports 8 vulnerabilities: 4 moderate and 4 high. This triage does not change dependencies; it assigns each finding to the phase that should own the fix.

## Category A: Runtime Dependency, Must Fix In Phase 1

| Package | Severity | Path | Why it blocks Phase 1 | Fix owner |
| --- | --- | --- | --- | --- |
| `astro` | Moderate | Direct dependency, `astro@5.18.1`, advisory `GHSA-j687-52p2-xcff` | Astro is the public static-site compiler and page runtime integration layer. The advisory is XSS-related and affects the public build system, so Phase 1 should not establish new primitives/tokens on a known vulnerable Astro base. | Phase 1 issue 1, issue 2, and issue 5 in `docs/audit/03-issues.md`; upgrade Astro to a non-vulnerable line and rerun build/audit. |
| `@astrojs/tailwind` | Moderate | Direct dependency, `@astrojs/tailwind@6.0.2`, via `astro` | This integration is in the public Astro build path. Audit suggests a semver-major fix path because the underlying `astro` finding affects it. | Phase 1 issue 1 and issue 2 in `docs/audit/03-issues.md`; resolve alongside the Astro upgrade and Tailwind/token alignment. |

## Category B: Dev Dependency, Defer To Phase 10

| Package | Severity | Path | Why deferred | Fix owner |
| --- | --- | --- | --- | --- |
| `vite` | Moderate | Direct dependency, `vite@5.4.21`, advisory `GHSA-4w7w-66w2-5vf9`; also affected by `esbuild` | The root `vite.config.ts` and `index.html` are legacy SPA artifacts, while Astro uses its own internal Vite path. Do not destabilize Phase 1 by major-upgrading or removing legacy SPA tooling before the legacy cleanup decision. | Phase 10 issue 1 and issue 4 in `docs/audit/03-issues.md`; coordinate with Phase 6 issue 3 after owner signs off on legacy cleanup. |
| `esbuild` | Moderate | Transitive through root `vite`, advisory `GHSA-67mh-4wv8-2f99` | The finding concerns Vite dev-server exposure. It is not in the public static output, and the fix path is a Vite major upgrade. | Phase 10 issue 1 and issue 4 in `docs/audit/03-issues.md`; verify after Vite/legacy cleanup. |
| `wrangler` | High | Direct dev dependency, `wrangler@4.67.0`, via `miniflare` | Wrangler is local/CI Cloudflare tooling. It is important for Pages Functions verification, but not part of the shipped public client bundle. | Phase 10 issue 1 and issue 4 in `docs/audit/03-issues.md`; update Wrangler in the CI/tooling hardening pass. |
| `miniflare` | High | Transitive through `wrangler`, via `undici` | Miniflare is local Cloudflare emulation used by Wrangler. It should be fixed with the Wrangler upgrade rather than patched independently during Phase 1. | Phase 10 issue 1 and issue 4 in `docs/audit/03-issues.md`. |
| `undici` | High | Transitive through `miniflare`, multiple advisories in `>=7.0.0 <7.24.0` | The vulnerable copy is in local Cloudflare tooling, not application fetch usage in Pages Functions. `npm audit fix --dry-run` shows the path through `wrangler -> miniflare -> undici`. | Phase 10 issue 1 and issue 4 in `docs/audit/03-issues.md`; confirm `npm audit` clean after Wrangler update. |
| `picomatch` | High | Transitive copies under build tooling (`tinyglobby`, `tailwindcss` dependency chains) | `npm audit fix --dry-run` shows patch-level updates to `picomatch@4.0.4` and `picomatch@2.3.2`. This is tooling/build dependency hygiene and should land with CI dependency hardening. | Phase 10 issue 1 and issue 4 in `docs/audit/03-issues.md`; rerun audit after lockfile refresh. |

## Category C: Transitive With No Upgrade Path, Document And Accept

None found in the captured report. Every vulnerability has either a direct upgrade path or a transitive path through a direct tool dependency. No Phase 1 acceptance exception is recommended.

## Dry-Run Fix Evidence

`npm audit fix --dry-run --json` showed non-mutating patch paths for the dev-tooling group, including `wrangler 4.67.0 -> 4.84.1`, `miniflare 4.20260219.0 -> 4.20260421.0`, `undici 7.18.2 -> 7.24.8`, `picomatch 4.0.3 -> 4.0.4`, and `picomatch 2.3.1 -> 2.3.2`.

Do not run the actual dependency update as part of this pre-Phase-1 triage commit.
