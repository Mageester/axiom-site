import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const sitemapExcludedPrefixes = [
  '/account',
  '/admin',
  '/admin-shell',
  '/api',
  '/campaigns',
  '/dashboard',
  '/functions',
  '/hunt',
  '/jobs',
  '/process',
  '/lead',
  '/leads',
  '/settings',
  '/triage',
  '/vault',
];

export default defineConfig({
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/+$/, '') || '/';
        return (
          pathname !== '/404' &&
          pathname !== '/start' &&
          // Concept demos are fictional businesses and stay out of search; /work/ itself is listed.
          !pathname.startsWith('/work/') &&
          !sitemapExcludedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
        );
      },
    }),
  ],
  output: 'static',
  site: 'https://getaxiom.ca',
});
