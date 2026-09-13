import type { CSSProperties, ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  style?: CSSProperties;
}

export function Card({ children, title, style }: CardProps) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        height: '100%',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
        ...style,
      }}
    >
      {title ? <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h2> : null}
      {children}
    </section>
  );
}
