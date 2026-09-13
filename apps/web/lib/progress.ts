export type ProgressInput = {
  score?: number;
  completed?: boolean;
};

export type PlayState = {
  score: number;
  bestScore: number;
  playsCount: number;
  completed: boolean;
};

export type NextPlayState = PlayState & {
  /** Points added to the player's running total for this finish. */
  awardedPoints: number;
};

function normalizeScore(score: number | undefined): number {
  if (score === undefined || !Number.isFinite(score)) {
    return 0;
  }
  return Math.max(0, Math.floor(score));
}

/**
 * Pure reducer for a single finished play. `current` is the existing record for
 * this player + game, or `null` on the first finish. Points are additive, while
 * `bestScore` keeps the personal best and `completed` latches on.
 */
export function nextPlayState(current: PlayState | null, input: ProgressInput): NextPlayState {
  const score = normalizeScore(input.score);
  return {
    score,
    bestScore: Math.max(current?.bestScore ?? 0, score),
    playsCount: (current?.playsCount ?? 0) + 1,
    completed: (current?.completed ?? false) || Boolean(input.completed),
    awardedPoints: score,
  };
}
