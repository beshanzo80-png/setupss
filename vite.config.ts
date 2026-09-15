import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    ssr: {
      noExternal: ['uuid', 'express'],
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Group React + Motion together in vendor-react (preventing circular vendor-motion chunk dependencies)
              if (
                id.includes('/node_modules/react/') ||
                id.includes('/node_modules/react-dom/') ||
                id.includes('/node_modules/scheduler/') ||
                id.includes('/node_modules/motion/') ||
                id.includes('/node_modules/framer-motion/')
              ) {
                return 'vendor-react';
              }
              if (id.includes('/node_modules/lucide-react/')) {
                return 'vendor-icons';
              }
              if (id.includes('/node_modules/recharts/') || id.includes('/node_modules/d3')) {
                return 'vendor-charts';
              }
            }
          },
        },
      },
    },
    server: {
      hmr: false,
      watch: null,
    },
  };
});
