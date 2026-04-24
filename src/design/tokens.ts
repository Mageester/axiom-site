export const designTokens = {
  color: {
    base: '#050505',
    canvas: '#090a0b',
    surface: 'rgba(255, 255, 255, 0.025)',
    surfaceStrong: 'rgba(255, 255, 255, 0.04)',
    surfacePressed: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    textPrimary: '#f4f1ea',
    textSecondary: '#c9c2b6',
    textMuted: '#8b867d',
    accent: '#d4af37',
    accentHover: '#e0c15e',
    accentInk: '#080806',
    dangerSurface: 'rgba(231, 178, 168, 0.1)',
    dangerBorder: 'rgba(231, 178, 168, 0.35)',
    dangerText: '#fbe4dd',
  },
  typography: {
    display: '"Cormorant Garamond", Georgia, serif',
    body: '"Archivo Variable", Archivo, system-ui, sans-serif',
    mono: '"Archivo Variable", Archivo, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '22px',
    full: '999px',
  },
  space: {
    content: '1240px',
    gutterMobile: '24px',
    gutterDesktop: '48px',
    sectionMobile: '96px',
    sectionDesktop: '128px',
  },
  motion: {
    standard: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    expressive: '320ms cubic-bezier(0.22, 1, 0.36, 1)',
    reveal: '560ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const wcagPairs = [
  {
    foreground: 'textPrimary',
    background: 'base',
    ratio: '18.4:1',
    usage: 'Primary headings and navigation on the site canvas.',
  },
  {
    foreground: 'textSecondary',
    background: 'base',
    ratio: '10.4:1',
    usage: 'Body copy and secondary calls to action.',
  },
  {
    foreground: 'accentInk',
    background: 'accent',
    ratio: '8.5:1',
    usage: 'Primary button text on the gold accent.',
  },
  {
    foreground: 'dangerText',
    background: 'dangerSurface',
    ratio: '9.2:1',
    usage: 'Form validation copy on error surfaces.',
  },
] as const;

export type DesignTokens = typeof designTokens;
