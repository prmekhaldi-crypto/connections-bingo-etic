import { config as loadEnv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The single source of truth for environment variables lives at the monorepo
// root; load it before Next reads `process.env`.
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
loadEnv({ path: resolve(rootDir, '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  },
};

export default nextConfig;
