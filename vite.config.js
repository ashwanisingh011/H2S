/**
 * @fileoverview Vite configuration for building the React application.
 * Defines plugins, test environment, and build optimization settings.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable source maps for better error tracking in production (if needed)
    sourcemap: false,
    // Optimize chunk sizes for efficiency
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React core into its own chunk
          react: ['react', 'react-dom', 'react-router-dom'],
          // Split Framer Motion for better caching
          motion: ['framer-motion'],
          // Split Firebase to ensure it doesn't block initial render
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/analytics', 'firebase/auth', 'firebase/performance'],
          // Split Lucide icons
          icons: ['lucide-react']
        }
      }
    },
    // Set chunk size warning limit higher since we code split
    chunkSizeWarningLimit: 600,
    // Minify with terser/esbuild (esbuild is default and fast)
    minify: 'esbuild'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.js'],
  },
});
