// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // PWA Plugin: Generates service worker and injects manifest link.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'SupaApp PWA',
        short_name: 'SupaApp',
        description: 'Your PWA powered by Supabase and Capacitor.',
        theme_color: '#ffffff',
        // Add paths to your icons in the public folder
        icons: [ 
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: 'pwa-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' }
        ]
      },
    }),
  ],
  // Configure path aliases (e.g., to use '@/components/Header')
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Ensure the build output is ready for Capacitor
  build: {
    outDir: 'dist', 
  }
});

