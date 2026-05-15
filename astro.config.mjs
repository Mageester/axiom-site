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
        const path = new URL(item.url).pathname;
        if (path === '/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (path === '/pricing' || path === '/start-a-project') {
          return { ...item, priority: 0.9 };
        }
        if (path === '/services' || path === '/work' || path === '/contact') {
          return { ...item, priority: 0.85 };
        }
        if (path.startsWith('/services/')) {
          return { ...item, priority: 0.8 };
        }
        if (path === '/about' || path === '/process' || path === '/approach') {
          return { ...item, priority: 0.7 };
        }
        return { ...item, priority: 0.5 };
      },
    }),
  ],
  output: 'static',
  site: 'https://getaxiom.ca',
});
