'use client';

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1.1rem',
  borderRadius: '0.5rem',
  border: '1px solid transparent',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { background: '#4f46e5', color: '#ffffff' },
  secondary: { background: '#ffffff', color: '#1f2937', borderColor: '#d1d5db' },
};

export function Button({
  children,
  variant = 'primary',
  style,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} style={{ ...baseStyle, ...variantStyles[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}
