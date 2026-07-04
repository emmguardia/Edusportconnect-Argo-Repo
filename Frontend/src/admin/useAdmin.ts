import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL ?? '';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminState {
  user: AdminUser | null;
  loading: boolean;
}

let globalUser: AdminUser | null = null;
const listeners = new Set<(u: AdminUser | null) => void>();

function notify(u: AdminUser | null) {
  globalUser = u;
  listeners.forEach(fn => fn(u));
}

export function useAdmin() {
  const [state, setState] = useState<AdminState>({ user: globalUser, loading: false });

  useEffect(() => {
    const fn = (u: AdminUser | null) => setState(s => ({ ...s, user: u }));
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const checkSession = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        notify(data.admin);
      } else {
        notify(null);
      }
    } catch {
      notify(null);
    } finally {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Erreur de connexion');
    notify(data.admin);
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    notify(null);
  }, []);

  return { user: state.user, loading: state.loading, checkSession, login, logout };
}
