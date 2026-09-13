'use client';

import { useState, type FormEvent } from 'react';
import { useUser } from './user-provider';

export function UserBadge() {
  const { user, ready, signIn, signOut } = useUser();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(name);
      setName('');
    } catch {
      setError('Could not set that name.');
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Choose a username"
          aria-label="Username"
          minLength={3}
          maxLength={32}
          required
          style={{ padding: '0.35rem 0.5rem', borderRadius: '0.4rem', border: '1px solid #d1d5db' }}
        />
        <button type="submit" disabled={busy} style={{ fontWeight: 600 }}>
          {busy ? '…' : 'Set'}
        </button>
        {error ? <span style={{ color: '#b91c1c', fontSize: '0.8rem' }}>{error}</span> : null}
      </form>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <strong>{user.username}</strong>
      <span style={{ color: '#4f46e5', fontWeight: 700 }}>{user.points} pts</span>
      <button
        type="button"
        onClick={signOut}
        style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}
      >
        change
      </button>
    </span>
  );
}
