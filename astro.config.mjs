import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'static',
  site: 'https://getaxiom.ca',
});
