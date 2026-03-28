/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#0e0d0c',
          card: '#161514',
          elevated: '#1c1b19',
        },
        grove: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        lime: {
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
