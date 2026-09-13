import { getGameById } from '@game-platform/config';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ gameId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { gameId } = await params;

  const game = getGameById(gameId);
  if (!game) {
    return NextResponse.json({ message: 'game not found' }, { status: 404 });
  }

  return NextResponse.json(game);
}
