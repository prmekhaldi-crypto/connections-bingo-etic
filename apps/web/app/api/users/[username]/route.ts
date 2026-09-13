import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { plays, users } from '@/db/schema';
import type { UserProgress } from '@game-platform/types';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { username } = await params;
  const db = getDb();

  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) {
    return NextResponse.json({ message: 'user not found' }, { status: 404 });
  }

  const records = await db.select().from(plays).where(eq(plays.userId, user.id));

  const body: UserProgress = {
    username: user.username,
    points: user.points,
    plays: records.map((play) => ({
      gameId: play.gameId,
      score: play.score,
      bestScore: play.bestScore,
      playsCount: play.playsCount,
      completed: play.completed,
      updatedAt: play.updatedAt.toISOString(),
    })),
  };

  return NextResponse.json(body);
}
