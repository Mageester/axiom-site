# Design System

## Source of truth
- Tokens live in `src/design/tokens.ts`
- Generated runtime CSS variables are injected by `src/layouts/BaseLayout.astro`
- Tailwind consumes the same token source via `tailwind.config.js`

## Brand primitives
- Serif headings: `Cormorant Garamond`
- Body/UI sans: `Archivo`
- Core colors:
  - `ink`: near-black background
  - `bone`: warm off-white text
  - `brass`: primary accent
  - `brass-muted`: restrained accent border/hover state
  - `graphite`: raised surface
  - `hairline`: low-contrast architectural rule
  - `danger`, `success`, `warning`: system-only states

## Contrast pairings
- `bone` on `ink`: 15.9:1
- `brass` on `ink`: 6.06:1
- `bone` on `graphite`: 14.1:1
- `ink` on `brass`: 6.06:1

## Primitive index
- [Button](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Button.tsx)
- [Link](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Link.tsx)
- [Input](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Input.tsx)
- [Textarea](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Textarea.tsx)
- [Select](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Select.tsx)
- [Checkbox](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Checkbox.tsx)
- [Radio](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Radio.tsx)
- [Label](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Label.tsx)
- [FieldError](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/FieldError.tsx)
- [Badge](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Badge.tsx)
- [Chip](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Chip.tsx)
- [Divider](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Divider.tsx)
- [GridLines](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/GridLines.tsx)
- [Container](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Container.tsx)
- [Section](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Section.tsx)
- [Stack](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Stack.tsx)
- [Cluster](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Cluster.tsx)
- [Eyebrow](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/Eyebrow.tsx)

## Usage examples
- Primitive usage examples live in [src/components/primitives/README.md](/Users/aidan/OneDrive/Desktop/Repos/axiom-site-phase-1-design-system/src/components/primitives/README.md)

## Rules
- Add new visual values to `src/design/tokens.ts` first
- Do not hardcode colors or font names in shared foundation files
- Keep body/UI typography on `Archivo`; reserve the serif family for headings and pull-quote moments
- Use `brass` focus-visible treatment for all interactive primitives
