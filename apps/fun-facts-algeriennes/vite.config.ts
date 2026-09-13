import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5001,
    strictPort: true,
  },
  preview: {
    port: 5001,
    strictPort: true,
  },
});
