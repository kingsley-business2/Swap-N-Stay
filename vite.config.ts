// ========================== vite.config.ts (UPDATED) ==========================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // ❌ REMOVED: The 'base' path for GitHub Pages. Base path is now '/' for PWA/Capacitor.
  plugins: [react()],
});
