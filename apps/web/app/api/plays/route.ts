import { and, eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/db/client';
import { plays, users } from '@/db/schema';
import { nextPlayState } from '@/lib/progress';

export const dynamic = 'force-dynamic';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { username, gameId, score, completed } = (body ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(username) || !isNonEmptyString(gameId)) {
    return NextResponse.json({ message: 'username and gameId are required' }, { status: 400 });
  }

  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) {
    return NextResponse.json({ message: 'user not found' }, { status: 404 });
  }

  const [existing] = await db
    .select()
    .from(plays)
    .where(and(eq(plays.userId, user.id), eq(plays.gameId, gameId)));

  const next = nextPlayState(
    existing
      ? {
          score: existing.score,
          bestScore: existing.bestScore,
          playsCount: existing.playsCount,
          completed: existing.completed,
        }
      : null,
    {
      score: typeof score === 'number' ? score : undefined,
      completed: typeof completed === 'boolean' ? completed : undefined,
    },
  );

  const [updatedUser] = await db.transaction(async (tx) => {
    if (existing) {
      await tx
        .update(plays)
        .set({
          score: next.score,
          bestScore: next.bestScore,
          playsCount: next.playsCount,
          completed: next.completed,
          updatedAt: new Date(),
        })
        .where(eq(plays.id, existing.id));
    } else {
      await tx.insert(plays).values({
        userId: user.id,
        gameId,
        score: next.score,
        bestScore: next.bestScore,
        playsCount: next.playsCount,
        completed: next.completed,
      });
    }

    return tx
      .update(users)
      .set({ points: user.points + next.awardedPoints })
      .where(eq(users.id, user.id))
      .returning();
  });

  return NextResponse.json(
    {
      user: { username: updatedUser.username, points: updatedUser.points },
      awardedPoints: next.awardedPoints,
      play: {
        gameId,
        score: next.score,
        bestScore: next.bestScore,
        playsCount: next.playsCount,
        completed: next.completed,
      },
    },
    { status: 201 },
  );
}
