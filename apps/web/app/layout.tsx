import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../../../etic-ui-kit/etic-ui/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bingo Étudiant | ETIC',
  description: 'Le Bingo Étudiant ETIC et ses mini-jeux.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="etic-theme">{children}</body>
    </html>
  );
}
