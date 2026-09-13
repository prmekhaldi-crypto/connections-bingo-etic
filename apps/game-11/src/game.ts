import { createGameSDK, type GameSDK } from '@game-platform/game-sdk';

export const GAME_ID = 'game-11';
export const GAME_NAME = 'Game 11';
export const PLACEHOLDER_MESSAGE = 'Not implemented yet';

export function getPlaceholderText(): string {
  return `${GAME_NAME}\n\n${PLACEHOLDER_MESSAGE}`;
}

export function renderGame(container: HTMLElement): void {
  container.innerHTML = `
    <main class="game-shell">
      <h1>${GAME_NAME}</h1>
      <p>${PLACEHOLDER_MESSAGE}</p>
    </main>
  `;
}

export function createSdk(): GameSDK {
  return createGameSDK({ gameId: GAME_ID });
}
