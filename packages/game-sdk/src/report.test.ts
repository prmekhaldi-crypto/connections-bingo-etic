import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME_FINISHED_MESSAGE, reportGameResult } from './report';

describe('reportGameResult', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts to the parent window when embedded in the platform', () => {
    const postMessage = vi.fn();
    vi.stubGlobal('window', {
      parent: { postMessage },
      dispatchEvent: vi.fn(),
    } as unknown as Window & typeof globalThis);

    reportGameResult({ gameId: 'game-01', score: 10 });

    expect(postMessage).toHaveBeenCalledWith(
      { type: GAME_FINISHED_MESSAGE, result: { gameId: 'game-01', score: 10 } },
      '*',
    );
  });

  it('dispatches a DOM event when running standalone', () => {
    const dispatchEvent = vi.fn();
    const fakeWindow = { dispatchEvent } as unknown as Window & typeof globalThis;
    (fakeWindow as unknown as { parent: unknown }).parent = fakeWindow;
    vi.stubGlobal('window', fakeWindow);

    reportGameResult({ gameId: 'game-02', score: 5, completed: true });

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    const event = dispatchEvent.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe(GAME_FINISHED_MESSAGE);
    expect(event.detail).toEqual({ gameId: 'game-02', score: 5, completed: true });
  });
});
