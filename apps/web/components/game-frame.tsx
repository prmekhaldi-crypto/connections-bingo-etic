'use client';

import { GAME_FINISHED_MESSAGE } from '@game-platform/game-sdk';
import type { GameDefinition, GameResult } from '@game-platform/types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from './user-provider';

type GameFrameProps = {
  game: GameDefinition;
};

type FinishedMessage = {
  type?: string;
  result?: GameResult;
};

export function GameFrame({ game }: GameFrameProps) {
  const { user, addPoints } = useUser();
  const router = useRouter();
  const [lastAward, setLastAward] = useState<number | null>(null);
  const [status, setStatus] = useState<'playing' | 'saving' | 'done'>('playing');

  const handleFinished = useCallback(
    async (result: GameResult) => {
      setStatus('saving');

      if (user) {
        try {
          const response = await fetch('/api/plays', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user.username,
              gameId: game.id,
              score: result.score ?? 0,
              completed: result.completed ?? true,
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as { awardedPoints?: number };
            const awarded = Number(data.awardedPoints ?? 0);
            addPoints(awarded);
            setLastAward(awarded);
          }
        } catch {
          // Even if saving fails we still fall back to the platform.
        }
      }

      setStatus('done');

      // Let the player see the awarded points, then fall back to the platform.
      window.setTimeout(() => {
        router.push('/games');
        router.refresh();
      }, 1200);
    },
    [addPoints, game.id, router, user],
  );

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (game.url) {
        try {
          if (new URL(game.url).origin !== event.origin) {
            return;
          }
        } catch {
          return;
        }
      }

      const data = event.data as FinishedMessage | null;
      if (!data || data.type !== GAME_FINISHED_MESSAGE || !data.result) {
        return;
      }

      void handleFinished(data.result);
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [game.url, handleFinished]);

  if (!game.url) {
    return <p>This game is not available yet.</p>;
  }

  return (
    <div>
      {status === 'done' ? (
        <p role="status" style={{ color: '#4f46e5', fontWeight: 600 }}>
          {lastAward !== null
            ? `Game finished — +${lastAward} points. Returning to the platform…`
            : 'Game finished. Returning to the platform…'}
        </p>
      ) : null}

      <iframe
        title={game.name}
        src={game.url}
        allow="autoplay; fullscreen; gamepad"
        style={{
          width: '100%',
          height: '560px',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          background: '#ffffff',
        }}
      />

      <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
        Running from {game.url}
        {user
          ? ` — ${user.username} has ${user.points} points`
          : ' — set a username to earn points'}
      </p>
    </div>
  );
}
