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
        // Avoid entry assets named index-*.js because custom-domain edge rewrites
        // are currently poisoning that URL shape with HTML responses.
        entryFileNames: 'assets/app-[hash].js',
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
