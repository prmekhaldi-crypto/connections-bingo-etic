export const API_PORT = 3000;
export const API_PREFIX = '/api';
export const DEFAULT_API_BASE_URL = `http://localhost:${API_PORT}${API_PREFIX}`;

export function resolveApiBaseUrl(explicit?: string): string {
  const value = explicit?.trim();
  return value && value.length > 0 ? value : DEFAULT_API_BASE_URL;
}

export function buildApiUrl(path: string, baseUrl: string = DEFAULT_API_BASE_URL): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
