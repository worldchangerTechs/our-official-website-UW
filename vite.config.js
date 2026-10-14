import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = '/unitywithin-application-page/'

export default defineConfig(({ isSsrBuild }) => ({
  base,
  plugins: [
    react(),
    VitePWA({
      disable: isSsrBuild,
      registerType: 'autoUpdate',
      includeAssets: ['offline.html'],
      manifest: {
        name: 'Unity Within — Peer Support Movement',
        short_name: 'Unity Within',
        description: 'A youth-led mental health organization connecting young people to support.',
        theme_color: '#f5dfe1',
        background_color: '#f5dfe1',
        display: 'standalone',
        start_url: base,
        scope: base,
      },
      workbox: {
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [
          new RegExp(`^${base}(?:our-story|what-we-do|peer-training|get-support|self-acceptance-hub|impact|events|volunteer|partner|donate|resources|contact|stories|not-found)(?:/|$)`),
          new RegExp(`^${base}(?:stories|hub)/.+`),
        ],
        globPatterns: ['**/*.{html,js,css,svg,json}'],
        globIgnores: ['**/images/optimized/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/images/optimized/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'unity-within-images',
              expiration: { maxEntries: 90, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'unity-within-fonts', expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 90 } },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        ...(isSsrBuild ? {} : {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          },
        }),
      },
    },
  },
}))
