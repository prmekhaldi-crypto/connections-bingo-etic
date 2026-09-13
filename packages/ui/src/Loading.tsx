export interface LoadingProps {
  label?: string;
}

export function Loading({ label = 'Loading...' }: LoadingProps) {
  return (
    <p role="status" aria-live="polite" style={{ color: '#6b7280' }}>
      {label}
    </p>
  );
}
