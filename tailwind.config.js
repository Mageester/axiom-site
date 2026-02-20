/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-main)',
                surface: 'var(--bg-surface)',
                accent: 'var(--accent)',
            },
            fontFamily: {
                grotesk: ['Space Grotesk', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            borderColor: {
                subtle: 'var(--border-subtle)',
            },
            textColor: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)',
            },
            backgroundColor: {
                subtle: 'var(--border-subtle)',
            }
        },
    },
    plugins: [],
}
