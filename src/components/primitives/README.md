# Axiom Primitives

All primitives in this folder are driven by `src/design/tokens.ts`.

## Tokens
- Color: `ink`, `bone`, `brass`, `brass-muted`, `graphite`, `hairline`, `danger`, `success`, `warning`
- Type: serif headings (`Cormorant Garamond`), sans body/UI (`Archivo`), mono utility labels
- Spacing: `0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 56, 80, 120`
- Radii: `none`, `sm`, `md`
- Motion: `fast`, `base`, `slow`, `reveal`

## Primitives
- `Button`: primary/secondary/ghost actions
- `Link`: inline, subtle, and nav text links
- `Input`, `Textarea`, `Select`: native form fields with token-based chrome
- `Checkbox`, `Radio`: labeled native choice controls
- `Label`, `FieldError`: form metadata and inline validation
- `Badge`, `Chip`: compact metadata surfaces
- `Divider`: hairline or brass rule separators
- `GridLines`: architectural grid background layer
- `Container`, `Section`, `Stack`, `Cluster`: spacing and layout helpers
- `Eyebrow`: uppercase section label

## Usage
```tsx
import { Button, Container, Eyebrow, FieldError, Input, Section, Stack } from '../primitives';

export function ExamplePanel() {
  return (
    <Section spacing="lg">
      <Container width="measure">
        <Stack space="6">
          <Eyebrow>Start a project</Eyebrow>
          <label className="flex flex-col gap-2">
            <span>Email</span>
            <Input name="email" type="email" placeholder="name@company.com" />
          </label>
          <FieldError>We need an email address to reply.</FieldError>
          <Button data-analytics-event="cta_primary">Book a call</Button>
        </Stack>
      </Container>
    </Section>
  );
}
```

## Analytics hooks
- Every primitive sets `data-primitive`
- Interactive primitives also set `data-analytics-component`
- Route-level event names should be attached by consumers via `data-analytics-event`
