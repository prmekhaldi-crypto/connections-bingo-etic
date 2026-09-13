'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  background: 'rgba(15, 23, 42, 0.5)',
};

const dialogStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '28rem',
  padding: '1.5rem',
  borderRadius: '0.75rem',
  background: '#ffffff',
  boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2)',
};

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div style={overlayStyle} role="presentation">
      <div style={dialogStyle} role="dialog" aria-modal="true" aria-label={title}>
        {title ? <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h2> : null}
        {children}
        {onClose ? (
          <Button variant="secondary" onClick={onClose} style={{ alignSelf: 'flex-end' }}>
            Close
          </Button>
        ) : null}
      </div>
    </div>
  );
}
