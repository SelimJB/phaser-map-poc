import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: '/',
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
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
    port: 3000,
    watch: {}
  },
  assetsInclude: ['**/*.frag']
});
