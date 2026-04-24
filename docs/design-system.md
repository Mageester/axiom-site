# Axiom Design System

Phase 1 establishes the shared token and primitive layer used by public Astro pages and the retained admin shell.

## Token Source

- TypeScript source: `src/design/tokens.ts`
- CSS custom properties: `src/styles/tokens.css`
- Tailwind alignment: `tailwind.config.js`

CSS remains the runtime delivery layer, while `tokens.ts` gives future components and tests a typed source for the same palette, radius, spacing, motion, and typography decisions.

## Typography

- Display: Inter Display for hero, display, and section-title treatments at 32px and above. It is self-hosted through `@fontsource-variable/inter` and uses the variable face for the display token.
- Body/UI: Inter for paragraphs, labels, buttons, navigation, and forms. It is self-hosted through `@fontsource/inter`.
- Mono/technical UI: JetBrains Mono, self-hosted through `@fontsource/jetbrains-mono`, for code, technical UI, and field hints when needed.
- Fallback stack: `'Inter Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

Display tokens use restrained negative tracking: `display-xl` is 700 / `-0.035em` / `1.0`, `display-lg` is 700 / `-0.03em` / `1.05`, `display-md` is 600 / `-0.025em` / `1.1`, and `h1`-`h2` are 600 / `-0.02em` / `1.15`. Smaller headings use Inter 600 with `-0.01em` tracking and `1.25` line height. Body copy remains Inter 400 with open line heights for readability.

External Google Fonts and Fontshare links are not used.

## WCAG AA Pairings

The typography swap keeps the same approved color pairings. Inter's body metrics improve small-text clarity, while Inter Display keeps large headings compact without reducing contrast.

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
