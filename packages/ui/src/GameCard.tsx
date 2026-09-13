import type { GameDefinition } from '@game-platform/types';
import { Card } from './Card';

export interface GameCardProps {
  game: GameDefinition;
  href: string;
}

const playLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 'auto',
  padding: '0.6rem 1.1rem',
  borderRadius: '0.5rem',
  background: '#4f46e5',
  color: '#ffffff',
  fontWeight: 600,
  textDecoration: 'none',
} as const;

export function GameCard({ game, href }: GameCardProps) {
  return (
    <Card title={game.name}>
      <p style={{ margin: 0, flexGrow: 1, color: '#4b5563' }}>{game.description}</p>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>v{game.version}</p>
      <a href={href} style={playLinkStyle} aria-disabled={!game.enabled}>
        Play
      </a>
    </Card>
  );
}
