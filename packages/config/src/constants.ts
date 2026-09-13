export const GAME_COUNT = 16;
export const GAME_VERSION = '0.1.0';
export const GAME_PORT_START = 5001;

export function getGamePort(gameNumber: number): number {
  return GAME_PORT_START + gameNumber - 1;
}
