import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // During development, requests to /api are forwarded to the backend.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  // Settings for `npm test` (Vitest). jsdom gives tests a fake browser.
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
