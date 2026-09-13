import { games } from '@game-platform/config';
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(games.filter((game) => game.enabled));
}
