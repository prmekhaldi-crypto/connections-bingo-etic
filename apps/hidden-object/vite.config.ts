import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5002,
    strictPort: true,
  },
  preview: {
    port: 5002,
    strictPort: true,
  },
});
