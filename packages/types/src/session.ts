export type GameSession = {
  id: string;
  gameId: string;
  playerId?: string;
  startedAt: string;
  expiresAt?: string;
};
