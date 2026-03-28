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
          base: '#090b08',
          card: '#11140f',
          elevated: '#181d17',
        },
        grove: {
          300: '#d6e49f',
          400: '#b7cc6b',
          500: '#95ad3d',
          600: '#7f9230',
          700: '#636e23',
        },
        lime: {
          300: '#d8e28e',
          400: '#bdd65e',
          500: '#98c933',
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
