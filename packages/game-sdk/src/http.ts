import { buildApiUrl, resolveApiBaseUrl } from '@game-platform/config';
import { GameSdkError } from './errors';

export type HttpClient = {
  readonly baseUrl: string;
  request<T>(path: string, init?: RequestInit): Promise<T>;
};

export function createHttpClient(baseUrl?: string, fetchImpl: typeof fetch = fetch): HttpClient {
  const apiBaseUrl = resolveApiBaseUrl(baseUrl);

  return {
    baseUrl: apiBaseUrl,
    async request<T>(path: string, init: RequestInit = {}): Promise<T> {
      const response = await fetchImpl(buildApiUrl(path, apiBaseUrl), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers ?? {}),
        },
      });

      if (!response.ok) {
        throw new GameSdkError(
          `Request to ${path} failed with status ${response.status}`,
          response.status,
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    },
  };
}
