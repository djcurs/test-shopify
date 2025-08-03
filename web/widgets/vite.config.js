
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'CountdownWidget',
      fileName: 'countdown-widget',
      formats: ['iife'] 
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});