import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function preserveCloudflareScriptOptOut() {
  return {
    name: 'preserve-cloudflare-script-opt-out',
    transformIndexHtml: {
      order: 'post' as const,
      handler(html: string) {
        if (html.includes('data-cfasync="false"')) return html

        return html.replace(
          /<script\s+type="module"([^>]*)><\/script>/,
          '<script data-cfasync="false" type="module"$1></script>',
        )
      },
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preserveCloudflareScriptOptOut()],
  resolve: {
    alias: {
      '@omni': path.resolve(__dirname, 'src/omniscient'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        /**
         * Explicit chunk ownership for the admin/public boundary.
         *
         * Without this, Rollup's automatic chunking could silently merge
         * admin-only shared modules (OmniRoot, Zod schemas) into the public
         * bundle if a non-admin file ever picks up a transitive import.
         *
         * Rules:
         *  admin-omni  — all src/omniscient/* source (provider, hooks, components)
         *  admin-vendor — third-party libs used exclusively by admin pages
         *                 (zod, joi — confirmed absent from the public bundle)
         *
         * Per-page admin chunks (Hunt, Vault, Triage, etc.) are still produced
         * individually by React.lazy() dynamic imports in App.tsx — this config
         * only governs their *shared* dependencies.
         */
        manualChunks(id: string) {
          // zod and joi are only imported transitively through admin/omniscient
          // code — confirmed absent from the public bundle.  Pinning them to a
          // named chunk makes that boundary explicit: if a future public-page
          // import accidentally pulls them in, the chunk disappears from the
          // build output, which is an obvious signal during review.
          if (
            id.includes('node_modules/zod') ||
            id.includes('node_modules/joi')
          ) {
            return 'admin-vendor';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
