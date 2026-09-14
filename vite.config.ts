import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // relative base path for GitHub Pages / Cloudflare Pages
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-crypto': ['crypto-js'],
          'vendor-sql': ['sql-formatter'],
          'vendor-markdown': ['marked', 'dompurify'],
          'vendor-diff': ['diff'],
        },
      },
    },
  },
});
