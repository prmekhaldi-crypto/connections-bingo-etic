import type { GameDefinition } from '@game-platform/types';
import { GAME_COUNT, GAME_PORT_START, GAME_VERSION } from './constants';

function padGameNumber(gameNumber: number): string {
  return String(gameNumber).padStart(2, '0');
}

const GAME_DETAILS: Record<number, { name: string; description: string }> = {
  1: {
    name: 'Fun Facts Algériennes',
    description: 'Quiz Vrai/Faux sur l’Algérie : 10 affirmations, 8 secondes par question.',
  },
  2: {
    name: 'Hidden Object',
    description: 'Jeu d’objets cachés : retrouve tous les objets dissimulés dans la scène.',
  },
  3: {
    name: 'Le Plan de Classe',
    description: 'Place 16 élèves en respectant 12 contraintes et décroche jusqu’à 100 points.',
  },
  4: {
    name: 'Wordle Algérien',
    description: 'Devine un mot de cinq lettres en six essais.',
  },
  5: {
    name: 'Kalimat Algérien',
    description: 'Devine un proverbe algérien grâce aux emojis et relie ses mots dans la grille.',
  },
  6: {
    name: 'Spelling Bee Algérien',
    description: 'Compose des mots avec sept lettres en utilisant toujours la lettre centrale.',
  },
  10: {
    name: 'Campus Connections',
    description: 'Regroupe 36 mots de la vie étudiante en 6 champs lexicaux.',
  },
};

function createGame(gameNumber: number): GameDefinition {
  const id = `game-${padGameNumber(gameNumber)}`;
  const details = GAME_DETAILS[gameNumber];
  return {
    id,
    slug: id,
    name: details?.name ?? `Game ${padGameNumber(gameNumber)}`,
    description:
      details?.description ??
      `Placeholder description for ${id}. Gameplay will be implemented inside this game's own Vite app.`,
    version: GAME_VERSION,
    enabled: true,
    url: `http://localhost:${GAME_PORT_START + gameNumber - 1}`,
  };
}

export const games: readonly GameDefinition[] = Array.from({ length: GAME_COUNT }, (_, index) =>
  createGame(index + 1),
);

export const GAME_IDS: readonly string[] = games.map((game) => game.id);

export function getGameById(id: string): GameDefinition | undefined {
  return games.find((game) => game.id === id);
}

export function getGameBySlug(slug: string): GameDefinition | undefined {
  return games.find((game) => game.slug === slug);
}
