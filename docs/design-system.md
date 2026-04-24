# Axiom Design System

Phase 1 establishes the shared token and primitive layer used by public Astro pages and the retained admin shell.

## Token Source

- TypeScript source: `src/design/tokens.ts`
- CSS custom properties: `src/styles/tokens.css`
- Tailwind alignment: `tailwind.config.js`

CSS remains the runtime delivery layer, while `tokens.ts` gives future components and tests a typed source for the same palette, radius, spacing, motion, and typography decisions.

## Typography

- Display: Cormorant Garamond, self-hosted through Fontsource.
- Body: Archivo Variable, self-hosted through Fontsource.
- Mono/utility: Archivo Variable until a separate verified mono face is approved.

External Google Fonts and Fontshare links are not used.

## WCAG AA Pairings

| Pairing | Ratio | Usage |
| --- | ---: | --- |
| `--text-primary` on `--bg-base` | 18.4:1 | Primary headings and navigation on the site canvas. |
| `--text-secondary` on `--bg-base` | 10.4:1 | Body copy and secondary calls to action. |
| `--text-on-accent` on `--accent` | 8.5:1 | Primary button text on the gold accent. |
| `--error-text` on `--error-surface` | 9.2:1 | Form validation copy on error surfaces. |

These are the approved minimum pairings for public-page composition. Decorative text can use lower emphasis only when it is not needed to complete a task.

## Primitives

Primitives live in `src/components/primitives/`:

- `Container.astro`: constrained width and responsive gutters.
- `Section.astro`: standard/tight/none vertical rhythm.
- `Surface.astro`: quiet, raised, and accent panel surfaces.
- `Stack.astro`: vertical spacing without ad hoc gap values.
- `Kicker.astro`: restrained uppercase label treatment.
- `ButtonLink.astro`: token-backed link button for static Astro pages.

Use primitives for new public page work before adding local layout classes. Existing page-specific components can migrate gradually during page rebuild phases.
