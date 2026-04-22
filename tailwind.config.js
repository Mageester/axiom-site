/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-base)',
        surface: 'var(--surface-1)',
        elevated: 'var(--surface-2)',
        hairline: 'var(--hairline)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        axiom: {
          base: 'var(--axiom-base)',
          elevated: 'var(--axiom-elevated)',
          surface: 'var(--axiom-surface)',
          border: 'var(--axiom-border)',
          accent: 'var(--axiom-accent)',
          text: 'var(--axiom-text-main)',
          mute: 'var(--axiom-text-mute)',
        },
        accent: {
          DEFAULT: 'var(--axiom-accent)',
          muted: 'var(--accent-muted)',
        },
      },
      fontFamily: {
        display: ['Inter Display', 'General Sans', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        accent: ['Fraunces', 'Georgia', 'serif'],
        axiomSans: ['Inter', 'system-ui', 'sans-serif'],
        axiomDisplay: ['Inter Display', 'General Sans', 'system-ui', 'sans-serif'],
        axiomMono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        grotesk: ['Inter Display', 'General Sans', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(48px, 7vw, 96px)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '600' }],
        h1: ['clamp(48px, 7vw, 96px)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '600' }],
        h2: ['clamp(32px, 4vw, 52px)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '500' }],
        h3: ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        h4: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        bodyLg: ['17px', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['15px', { lineHeight: '1.65', fontWeight: '400' }],
        bodySm: ['13px', { lineHeight: '1.55', fontWeight: '400' }],
        eyebrow: ['11px', { lineHeight: '1.2', letterSpacing: '0.12em', fontWeight: '500' }],
        metric: ['12px', { lineHeight: '1.2', letterSpacing: '0.08em', fontWeight: '400' }],
        button: ['14px', { lineHeight: '1.2', fontWeight: '500' }],
      },
      spacing: {
        section: '72px',
        'section-lg': '120px',
      },
      maxWidth: {
        container: '1240px',
      },
      borderRadius: {
        card: '16px',
        pill: '999px',
      },
      boxShadow: {
        card: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};
