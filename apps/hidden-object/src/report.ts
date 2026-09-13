import { reportGameResult } from '@game-platform/game-sdk';

type HopaResult = {
  score?: number;
  completed?: boolean;
};

// The inline game script dispatches `game:result` when the round ends (victory
// or timeout). This module forwards the real score to the platform SDK.
window.addEventListener('game:result', (event) => {
  const detail = (event as CustomEvent<HopaResult>).detail ?? {};

  reportGameResult({
    gameId: 'game-02',
    score: detail.score ?? 0,
    completed: detail.completed ?? true,
  });
});
