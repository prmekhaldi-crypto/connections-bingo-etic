import { describe, expect, it } from 'vitest';
import { GAME_COUNT } from './constants';
import { GAME_IDS, games, getGameById, getGameBySlug } from './games';

describe('game registry', () => {
  it('contains a definition for every game', () => {
    expect(games).toHaveLength(GAME_COUNT);
    expect(GAME_IDS).toHaveLength(GAME_COUNT);
  });

  it('uses unique ids, slugs and urls', () => {
    expect(new Set(GAME_IDS).size).toBe(GAME_COUNT);
    expect(new Set(games.map((game) => game.slug)).size).toBe(GAME_COUNT);
    expect(new Set(games.map((game) => game.url)).size).toBe(GAME_COUNT);
  });

  it('exposes lookups by id and slug', () => {
    expect(getGameById('game-01')?.name).toBe('Fun Facts Algériennes');
    expect(getGameBySlug('game-16')?.name).toBe('Game 16');
    expect(getGameById('does-not-exist')).toBeUndefined();
  });
});
