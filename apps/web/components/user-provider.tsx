'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CurrentUser = {
  username: string;
  points: number;
};

type UserContextValue = {
  user: CurrentUser | null;
  ready: boolean;
  signIn: (username: string) => Promise<void>;
  addPoints: (points: number) => void;
  signOut: () => void;
};

const STORAGE_KEY = 'game-platform:user';

const UserContext = createContext<UserContextValue | null>(null);

async function fetchProgress(username: string): Promise<CurrentUser> {
  const response = await fetch(`/api/users/${encodeURIComponent(username)}`);
  if (!response.ok) {
    throw new Error('Unable to load progress');
  }
  const data = (await response.json()) as { username: string; points: number };
  return { username: data.username, points: data.points };
}

function readStoredUser(): CurrentUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredUser();
    if (!stored) {
      setReady(true);
      return;
    }

    setUser(stored);
    void fetchProgress(stored.username)
      .then((fresh) => {
        setUser(fresh);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next: CurrentUser | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signIn = useCallback(
    async (username: string) => {
      const trimmed = username.trim();
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed }),
      });

      if (response.status === 201) {
        const created = (await response.json()) as { username: string; points?: number };
        persist({ username: created.username, points: created.points ?? 0 });
        return;
      }

      if (response.status === 409) {
        persist(await fetchProgress(trimmed));
        return;
      }

      throw new Error('Unable to sign in');
    },
    [persist],
  );

  const addPoints = useCallback((points: number) => {
    setUser((current) => {
      if (!current) {
        return current;
      }
      const next = { ...current, points: current.points + points };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const signOut = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ user, ready, signIn, addPoints, signOut }),
    [user, ready, signIn, addPoints, signOut],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside <UserProvider>');
  }
  return context;
}
