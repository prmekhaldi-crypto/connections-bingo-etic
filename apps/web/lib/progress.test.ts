import { describe, expect, it } from 'vitest';
import { nextPlayState } from './progress';

describe('nextPlayState', () => {
  it('awards points and seeds a new play', () => {
    expect(nextPlayState(null, { score: 120, completed: true })).toEqual({
      score: 120,
      bestScore: 120,
      playsCount: 1,
      completed: true,
      awardedPoints: 120,
    });
  });

  it('adds points again on replay and keeps the best score', () => {
    const first = nextPlayState(null, { score: 80, completed: true });
    const second = nextPlayState(first, { score: 30, completed: false });

    expect(second.awardedPoints).toBe(30);
    expect(second.playsCount).toBe(2);
    expect(second.bestScore).toBe(80);
    expect(second.completed).toBe(true);
  });

  it('clamps invalid or negative scores to zero', () => {
    expect(nextPlayState(null, { score: -50 }).awardedPoints).toBe(0);
    expect(nextPlayState(null, {}).awardedPoints).toBe(0);
  });
});
