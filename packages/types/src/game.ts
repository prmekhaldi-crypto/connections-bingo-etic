export type GameDefinition = {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  url?: string;
};

export type GameResult = {
  gameId: string;
  score?: number;
  durationMs?: number;
  completed?: boolean;
  metadata?: Record<string, unknown>;
};

/** One game's progress for a player. */
export type PlayRecord = {
  gameId: string;
  score: number;
  bestScore: number;
  playsCount: number;
  completed: boolean;
  updatedAt: string;
};

/** A player plus everything they have played and their total points. */
export type UserProgress = {
  username: string;
  points: number;
  plays: PlayRecord[];
};
