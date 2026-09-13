import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5005,
    strictPort: true,
  },
  preview: {
    port: 5005,
    strictPort: true,
  },
});
