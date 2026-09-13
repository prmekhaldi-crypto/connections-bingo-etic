import { games, getGameById } from '@game-platform/config';
import { notFound, redirect } from 'next/navigation';

type GamePageProps = {
  params: Promise<{ gameId: string }>;
};

export function generateStaticParams() {
  return games.map((game) => ({ gameId: game.id }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game?.url) {
    notFound();
  }

  redirect(game.url);
}
