import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './useAdmin';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { login } = useAdmin();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/connect/evenements');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md ring-1 ring-navy/5">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
            ÉduSport Connect
          </span>
          <h1 className="mt-2 text-2xl font-bold text-navy">Administration</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-navy/20 px-4 py-2.5 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-navy/20 px-4 py-2.5 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-bright disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
