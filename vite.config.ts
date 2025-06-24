import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: process.env.NODE_ENV === 'production' ? '/phaser-map-poc/' : '/',
  resolve: {
    alias: {
      '@': '/src',
      '@phaser': '/src/phaser',
      '@map': '/src/phaser/map'
    }
  },
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  },
  assetsInclude: ['**/*.frag']
});
