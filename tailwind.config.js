/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            /* ── Spacing Scale ─────────────────────────────
               [4, 8, 12, 16, 24, 32, 48, 64, 96]
               Available as p-1, p-2, p-3, p-4, p-6, p-8, p-12, p-16, p-24
               Plus custom semantic tokens below.
               ────────────────────────────────────────────── */
            spacing: {
                '18': '4.5rem',   /* 72px  — between 64 and 96 */
                '22': '5.5rem',   /* 88px  — between 64 and 96 */
                'section': '4rem',       /* 64px  — default section gap */
                'section-lg': '6rem',    /* 96px  — hero/landing section gap */
            },
            colors: {
                background: 'var(--bg-main)',
                surface: 'var(--bg-surface)',
                inset: 'var(--bg-inset)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    muted: 'var(--accent-muted)',
                },
                panel: 'var(--border-panel)',
            },
            fontFamily: {
                grotesk: ['Space Grotesk', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            fontSize: {
                /* ── Typography Scale ─────────────────────── */
                'display': ['48px', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '600' }],
                'h1': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
                'h2': ['32px', { lineHeight: '40px', letterSpacing: '-0.015em', fontWeight: '600' }],
                'h3': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
                'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
                'body': ['16px', { lineHeight: '26px', fontWeight: '400' }],
                'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
                'caption': ['12px', { lineHeight: '16px', fontWeight: '500' }],
                'overline': ['10.5px', { lineHeight: '16px', letterSpacing: '0.18em', fontWeight: '500' }],
            },
            maxWidth: {
                'prose': '42rem',      /* ~67 chars at body size */
                'prose-sm': '36rem',   /* ~58 chars — tighter */
                'container': '1100px', /* standard content width */
                'container-lg': '1200px',
            },
            borderColor: {
                subtle: 'var(--border-subtle)',
                panel: 'var(--border-panel)',
            },
            textColor: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)',
                heading: 'var(--text-heading)',
                body: 'var(--text-body)',
            },
            backgroundColor: {
                subtle: 'var(--border-subtle)',
            },
            borderRadius: {
                'panel': '6px',    /* standard card/panel radius */
                'button': '4px',   /* CTA button radius */
                'input': '4px',    /* form input radius */
            },
            boxShadow: {
                'panel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.02)',
                'panel-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04), 0 4px 16px -8px rgba(0, 0, 0, 0.4)',
                'glow-subtle': '0 0 24px rgba(255, 255, 255, 0.04)',
                'glow-accent': '0 0 24px rgba(184, 115, 51, 0.15)',
            },
        },
    },
    plugins: [],
}
