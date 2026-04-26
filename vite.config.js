/**
 * @fileoverview Vite configuration for building the React application.
 * Defines plugins, test environment, and build optimization settings.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Enable source maps for better error tracking in production (if needed)
    sourcemap: false,
    // Set chunk size warning limit higher since we code split implicitly
    chunkSizeWarningLimit: 1500
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.js'],
  },
});
