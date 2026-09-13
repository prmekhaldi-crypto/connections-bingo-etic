import { reportGameResult } from '@game-platform/game-sdk';

type BingoResult = {
  score?: number;
  passed?: boolean;
};

// `public/game.js` is a classic script and emits `bingoGameResult` on window.
// This module (bundled by Vite) forwards the real score to the platform SDK.
window.addEventListener('bingoGameResult', (event) => {
  const detail = (event as CustomEvent<BingoResult>).detail ?? {};

  reportGameResult({
    gameId: 'game-01',
    score: detail.score ?? 0,
    completed: true,
    metadata: { passed: Boolean(detail.passed) },
  });
});
