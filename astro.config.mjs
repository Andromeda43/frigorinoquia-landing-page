import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(), 
  ],
  vite: {
    ssr: {
      noExternal: ['react-simple-maps']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'framer-motion': ['framer-motion'],
            'react-simple-maps': ['react-simple-maps'],
          }
        }
      }
    }
  }
});