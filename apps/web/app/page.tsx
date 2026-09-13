import { games } from '@game-platform/config';
import { Logo } from '@/lib/etic-ui';
import styles from './home.module.css';

export const metadata = {
  title: 'Bingo Étudiant | ETIC',
  description: 'Choisis une case du Bingo Étudiant ETIC et lance ton mini-jeu.',
};

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.cornerLine} aria-hidden="true" />
      <div className={styles.dots} aria-hidden="true" />
      <div className={styles.pinkDisc} aria-hidden="true" />
      <div className={styles.warmDisc} aria-hidden="true" />

      <div className={styles.content}>
        <header className={styles.intro}>
          <Logo width={52} />
          <div className={styles.kicker}>
            <span>Bingo Éticien</span>
            <span className={styles.edition}>Version étudiante</span>
          </div>
          <h1>Bingo</h1>
          <p>
            Choisis une case, relève le défi.
            <span> 6 jeux disponibles</span>
          </p>
        </header>

        <nav className={styles.grid} aria-label="Jeux du Bingo Étudiant">
          {games.map((game, index) => {
            const available = index < 6;

            return (
              <a
                key={game.id}
                className={`${styles.game} ${available ? styles.available : styles.upcoming}`}
                href={game.url ?? `/games/${game.id}`}
                aria-label={`Case ${index + 1} : ${game.name}${available ? '' : ', à venir'}`}
              >
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.name}>{game.name}</span>
                <span className={styles.status}>{available ? 'Jouer' : 'À venir'}</span>
              </a>
            );
          })}
        </nav>

        <div className={styles.footerMark} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </main>
  );
}
