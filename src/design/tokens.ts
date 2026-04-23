const rgbTriplet = (hex) => {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized;

  const parsed = Number.parseInt(value, 16);
  const red = (parsed >> 16) & 255;
  const green = (parsed >> 8) & 255;
  const blue = parsed & 255;

  return `${red} ${green} ${blue}`;
};

const px = (value) => `${value}px`;

export const tokens = {
  colors: {
    ink: '#0f0f10',
    bone: '#efe9dc',
    brass: '#ad8650',
    brassMuted: '#86683d',
    graphite: '#1a1a1d',
    hairline: 'rgba(239, 233, 220, 0.14)',
    danger: '#c56f5c',
    success: '#4f8d68',
    warning: '#b78a42',
  },
  fonts: {
    serif: ['Cormorant Garamond', 'Georgia', 'serif'],
    sans: ['Archivo', 'system-ui', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  },
  fontFaces: [
    {
      family: 'Archivo',
      style: 'normal',
      weight: '400 700',
      url: '/fonts/archivo/archivo-latin.woff2',
    },
    {
      family: 'Cormorant Garamond',
      style: 'normal',
      weight: '500 700',
      url: '/fonts/cormorant-garamond/cormorant-garamond-latin.woff2',
    },
  ],
  typeScale: {
    'display-xl': ['clamp(4rem, 8vw, 7.5rem)', { lineHeight: '0.94', letterSpacing: '-0.055em', fontWeight: '600' }],
    'display-lg': ['clamp(3.2rem, 6vw, 5.5rem)', { lineHeight: '0.96', letterSpacing: '-0.045em', fontWeight: '600' }],
    'display-md': ['clamp(2.7rem, 4.8vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '600' }],
    h1: ['clamp(2.7rem, 4.8vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '600' }],
    h2: ['clamp(2.15rem, 4vw, 3.25rem)', { lineHeight: '1.04', letterSpacing: '-0.03em', fontWeight: '600' }],
    h3: ['clamp(1.6rem, 2.7vw, 2.2rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
    h4: ['1.375rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
    h5: ['1.125rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '600' }],
    h6: ['1rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
    'body-lg': ['1.125rem', { lineHeight: '1.72', letterSpacing: '-0.01em', fontWeight: '400' }],
    body: ['1rem', { lineHeight: '1.7', letterSpacing: '-0.005em', fontWeight: '400' }],
    'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
    caption: ['0.75rem', { lineHeight: '1.45', letterSpacing: '0.06em', fontWeight: '500' }],
    mono: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '500' }],
  },
  spacing: {
    0: px(0),
    1: px(4),
    2: px(8),
    3: px(12),
    4: px(16),
    6: px(24),
    8: px(32),
    12: px(48),
    16: px(64),
    20: px(80),
    24: px(96),
    32: px(128),
    40: px(160),
    56: px(224),
    80: px(320),
    120: px(480),
  },
  radii: {
    none: px(0),
    sm: px(2),
    md: px(4),
  },
  borders: {
    hairline: '1px solid var(--color-hairline)',
    rule: '1px solid var(--color-brass-muted)',
  },
  shadows: {
    none: 'none',
    sm: '0 18px 40px rgb(0 0 0 / 0.18)',
    md: '0 26px 60px rgb(0 0 0 / 0.26)',
  },
  motion: {
    easing: {
      out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      subtle: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '600ms',
      reveal: '800ms',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  layout: {
    contentMax: '1200px',
    readingMeasure: '42rem',
    narrowMeasure: '34rem',
  },
  contrastPairs: [
    ['bone on ink', '15.9:1', 'Primary body and heading text'],
    ['brass on ink', '6.06:1', 'Focus rings, active borders, accents'],
    ['bone on graphite', '14.1:1', 'Secondary surfaces and cards'],
    ['ink on brass', '6.06:1', 'Filled buttons and emphasis chips'],
  ],
};

const fontFamilies = Object.fromEntries(
  Object.entries(tokens.fonts).map(([key, value]) => [key, value.join(', ')])
);

const colorVars = Object.entries(tokens.colors)
  .map(([key, value]) => `  --color-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}: ${value};`)
  .join('\n');

const rgbVars = Object.entries(tokens.colors)
  .filter(([, value]) => value.startsWith('#'))
  .map(([key, value]) => `  --color-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}-rgb: ${rgbTriplet(value)};`)
  .join('\n');

const spacingVars = Object.entries(tokens.spacing)
  .map(([key, value]) => `  --space-${key}: ${value};`)
  .join('\n');

const radiusVars = Object.entries(tokens.radii)
  .map(([key, value]) => `  --radius-${key}: ${value};`)
  .join('\n');

const durationVars = Object.entries(tokens.motion.duration)
  .map(([key, value]) => `  --motion-duration-${key}: ${value};`)
  .join('\n');

const shadowVars = Object.entries(tokens.shadows)
  .map(([key, value]) => `  --shadow-${key}: ${value};`)
  .join('\n');

const typeVars = Object.entries(tokens.typeScale)
  .map(([key, [fontSize, meta]]) => {
    const slug = key;
    return [
      `  --type-${slug}: ${fontSize};`,
      `  --type-${slug}-line-height: ${meta.lineHeight};`,
      `  --type-${slug}-letter-spacing: ${meta.letterSpacing};`,
      `  --type-${slug}-weight: ${meta.fontWeight};`,
    ].join('\n');
  })
  .join('\n');

const fontFaceCss = tokens.fontFaces
  .map(
    ({ family, style, weight, url }) => `@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('${url}') format('woff2');
}`
  )
  .join('\n\n');

export const designTokenCss = `${fontFaceCss}

:root {
${colorVars}
${rgbVars}
${spacingVars}
${radiusVars}
${durationVars}
${shadowVars}
${typeVars}
  --font-serif: ${fontFamilies.serif};
  --font-sans: ${fontFamilies.sans};
  --font-mono: ${fontFamilies.mono};
  --motion-ease-out: ${tokens.motion.easing.out};
  --motion-ease-subtle: ${tokens.motion.easing.subtle};
  --border-hairline: ${tokens.borders.hairline};
  --border-rule: ${tokens.borders.rule};
  --surface-base: var(--color-ink);
  --surface-graphite: var(--color-graphite);
  --surface-soft: rgb(var(--color-bone-rgb) / 0.035);
  --surface-raised: rgb(var(--color-bone-rgb) / 0.05);
  --surface-strong: rgb(var(--color-bone-rgb) / 0.08);
  --surface-inset: rgb(0 0 0 / 0.18);
  --text-primary: var(--color-bone);
  --text-secondary: rgb(var(--color-bone-rgb) / 0.78);
  --text-muted: rgb(var(--color-bone-rgb) / 0.58);
  --text-inverse: var(--color-ink);
  --focus-ring: rgb(var(--color-brass-rgb) / 0.38);
  --focus-ring-soft: rgb(var(--color-brass-rgb) / 0.18);
  --selection-bg: rgb(var(--color-brass-rgb) / 0.24);
  --selection-fg: var(--color-bone);
  --page-gutter: var(--space-6);
  --page-section: var(--space-24);
  --page-section-lg: var(--space-32);
  --container-max: ${tokens.layout.contentMax};
  --measure-reading: ${tokens.layout.readingMeasure};
  --measure-narrow: ${tokens.layout.narrowMeasure};
  --grid-size: 72px;
  --grid-line: linear-gradient(to right, var(--color-hairline) 1px, transparent 1px), linear-gradient(to bottom, var(--color-hairline) 1px, transparent 1px);
  --grid-mask: linear-gradient(180deg, rgb(15 15 16 / 0) 0%, rgb(15 15 16 / 0.92) 16%, rgb(15 15 16 / 1) 100%);
  --nav-height: 88px;
  --bg-base: var(--surface-base);
  --surface-1: var(--surface-soft);
  --surface-2: var(--surface-raised);
  --surface-input: var(--surface-soft);
  --surface-input-hover: var(--surface-raised);
  --surface-input-focus: var(--surface-strong);
  --surface-panel: var(--surface-soft);
  --surface-panel-strong: var(--surface-raised);
  --surface-overlay: var(--surface-raised);
  --surface-overlay-strong: var(--surface-strong);
  --surface-overlay-press: rgb(var(--color-bone-rgb) / 0.12);
  --hairline: var(--color-hairline);
  --hairline-strong: rgb(var(--color-bone-rgb) / 0.22);
  --hairline-hover: rgb(var(--color-bone-rgb) / 0.3);
  --accent: var(--color-brass);
  --accent-hover: color-mix(in srgb, var(--color-brass) 86%, white 14%);
  --accent-solid: var(--color-brass);
  --accent-muted: rgb(var(--color-brass-rgb) / 0.18);
  --accent-ring: var(--focus-ring);
  --accent-ring-soft: var(--focus-ring-soft);
  --accent-border: rgb(var(--color-brass-rgb) / 0.28);
  --accent-border-strong: rgb(var(--color-brass-rgb) / 0.42);
  --accent-surface: rgb(var(--color-brass-rgb) / 0.12);
  --accent-surface-strong: rgb(var(--color-brass-rgb) / 0.16);
  --accent-surface-alt: rgb(var(--color-brass-rgb) / 0.2);
  --accent-surface-lift: rgb(var(--color-brass-rgb) / 0.24);
  --text-on-accent: var(--text-inverse);
  --selection-bg: rgb(var(--color-brass-rgb) / 0.24);
  --selection-fg: var(--color-bone);
  --skip-link-bg: rgb(var(--color-ink-rgb) / 0.92);
  --skip-link-border: var(--color-hairline);
  --shadow-card: var(--shadow-sm);
  --shadow-card-elevated: var(--shadow-md);
  --shadow-card-hover: var(--shadow-md);
  --shadow-button-primary: var(--shadow-sm);
  --shadow-button-primary-hover: var(--shadow-md);
  --shadow-button-secondary: var(--shadow-sm);
  --shadow-button-secondary-hover: var(--shadow-md);
  --shadow-button-focus: 0 0 0 2px var(--focus-ring);
  --shadow-button-focus-strong: 0 0 0 3px var(--focus-ring);
  --shadow-field-base: 0 0 0 1px var(--color-hairline);
  --shadow-field-focus: 0 0 0 3px var(--focus-ring-soft);
  --shadow-brand-ring: 0 0 0 5px rgb(var(--color-brass-rgb) / 0.2);
  --shadow-brand-ring-soft: 0 0 0 4px rgb(var(--color-brass-rgb) / 0.12);
  --font-display: var(--font-serif);
  --font-body: var(--font-sans);
  --axiom-base: var(--surface-base);
  --axiom-elevated: var(--surface-soft);
  --axiom-surface: var(--surface-raised);
  --axiom-border: var(--color-hairline);
  --axiom-text-main: var(--text-primary);
  --axiom-text-primary: var(--text-secondary);
  --axiom-text-mute: var(--text-muted);
  --axiom-accent: var(--color-brass);
}

@media (min-width: ${tokens.breakpoints.lg}) {
  :root {
    --page-gutter: var(--space-10);
    --page-section: var(--space-32);
    --page-section-lg: var(--space-40);
  }
}
`;

export const tailwindThemeExtension = {
  colors: {
    ink: 'var(--color-ink)',
    bone: 'var(--color-bone)',
    brass: 'var(--color-brass)',
    'brass-muted': 'var(--color-brass-muted)',
    graphite: 'var(--color-graphite)',
    hairline: 'var(--color-hairline)',
    danger: 'var(--color-danger)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    surface: {
      base: 'var(--surface-base)',
      graphite: 'var(--surface-graphite)',
      soft: 'var(--surface-soft)',
      raised: 'var(--surface-raised)',
      strong: 'var(--surface-strong)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      muted: 'var(--text-muted)',
      inverse: 'var(--text-inverse)',
    },
  },
  fontFamily: {
    serif: tokens.fonts.serif,
    sans: tokens.fonts.sans,
    mono: tokens.fonts.mono,
    display: tokens.fonts.serif,
    body: tokens.fonts.sans,
  },
  fontSize: Object.fromEntries(Object.entries(tokens.typeScale)),
  spacing: tokens.spacing,
  borderRadius: tokens.radii,
  boxShadow: tokens.shadows,
  transitionDuration: tokens.motion.duration,
  transitionTimingFunction: {
    out: tokens.motion.easing.out,
    subtle: tokens.motion.easing.subtle,
  },
  screens: tokens.breakpoints,
  maxWidth: {
    container: tokens.layout.contentMax,
    measure: tokens.layout.readingMeasure,
    narrow: tokens.layout.narrowMeasure,
  },
};

export const publicStyleAuditExclusions = [
  'src/omniscient/',
  'src/components/admin/',
  'src/react-pages/',
  'src/App.tsx',
  'src/index.css',
];

export const phaseOneStyleAuditExclusions = [
  ...publicStyleAuditExclusions,
  'src/components/FloatingAffordances.tsx',
  'src/components/Footer.tsx',
  'src/components/Layout.tsx',
  'src/components/PartnerMarquee.tsx',
  'src/components/ProtectedRoute.tsx',
  'src/components/WorkPreviewGrid.tsx',
  'src/components/layout/',
  'src/components/motion/',
  'src/components/site/',
  'src/pages/',
];
