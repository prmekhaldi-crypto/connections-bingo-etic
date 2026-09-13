import type { GameResult, GameSession, Player } from '@game-platform/types';
import { createHttpClient, type HttpClient } from './http';

export interface GameSDKConfig {
  gameId: string;
  apiBaseUrl?: string;
  playerId?: string;
  fetchImpl?: typeof fetch;
}

export interface GameSDK {
  readonly gameId: string;
  startSession(): Promise<GameSession>;
  finishGame(result: GameResult): Promise<void>;
  getPlayer(): Promise<Player | null>;
  getGameConfig<T>(): Promise<T>;
}

export function createGameSDK(config: GameSDKConfig): GameSDK {
  const { gameId, playerId } = config;
  const http: HttpClient = createHttpClient(config.apiBaseUrl, config.fetchImpl);

  return {
    gameId,
    startSession(): Promise<GameSession> {
      return http.request<GameSession>('/sessions', {
        method: 'POST',
        body: JSON.stringify({ gameId, playerId }),
      });
    },
    async finishGame(result: GameResult): Promise<void> {
      await http.request<void>('/results', {
        method: 'POST',
        body: JSON.stringify({ ...result, gameId: result.gameId || gameId }),
      });
    },
    getPlayer(): Promise<Player | null> {
      return http.request<Player | null>(`/users/${playerId ?? 'me'}`);
    },
    getGameConfig<T>(): Promise<T> {
      return http.request<T>(`/games/${gameId}/config`);
    },
  };
}
