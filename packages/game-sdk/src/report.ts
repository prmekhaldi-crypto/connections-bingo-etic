import type { GameResult } from '@game-platform/types';

export const GAME_FINISHED_MESSAGE = 'game:finished';

export type GameFinishedMessage = {
  type: typeof GAME_FINISHED_MESSAGE;
  result: GameResult;
};

export function buildGameFinishedMessage(result: GameResult): GameFinishedMessage {
  return { type: GAME_FINISHED_MESSAGE, result };
}

/**
 * Tell the host platform that a game finished. Works both inside the platform
 * iframe (posts to the parent window) and standalone (dispatches a DOM event),
 * so games stay runnable on their own during development.
 */
export function reportGameResult(result: GameResult, targetOrigin = '*'): void {
  if (typeof window === 'undefined') {
    return;
  }

  const message = buildGameFinishedMessage(result);

  if (window.parent && window.parent !== window) {
    window.parent.postMessage(message, targetOrigin);
  } else {
    window.dispatchEvent(new CustomEvent(GAME_FINISHED_MESSAGE, { detail: result }));
  }
}
