import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/admin-shell') &&
        !page.includes('/404') &&
        new URL(page).pathname !== '/start/',
      changefreq: 'monthly',
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://getaxiom.ca/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (item.url.includes('/pricing') || item.url.includes('/start-a-project')) {
          return { ...item, priority: 0.9 };
        }
        return { ...item, priority: 0.8 };
      },
    }),
  ],
  output: 'static',
  site: 'https://getaxiom.ca',
});
