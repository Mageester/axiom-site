import { tailwindThemeExtension } from './src/design/tokens.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: tailwindThemeExtension,
  },
  plugins: [],
};
