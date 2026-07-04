import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAdmin } from '../useAdmin';

const API = import.meta.env.VITE_API_URL ?? '';

interface Admin {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const EMPTY_CREATE = { name: '', email: '', password: '' };
const EMPTY_EDIT   = { name: '', email: '', password: '' };

export default function AdminAdmins() {
  const { user: currentUser } = useAdmin();
  const [admins, setAdmins]   = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form, setForm]       = useState(EMPTY_CREATE);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/admins`, { credentials: 'include' });
      const data = await res.json();
      setAdmins(data.admins ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_CREATE);
    setError('');
    setModal('create');
  }

  function openEdit(a: Admin) {
    setEditing(a);
    setForm({ name: a.name, email: a.email, password: '' });
    setError('');
    setModal('edit');
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validation mot de passe côté client pour UX (la validation réelle est serveur)
    if (modal === 'create' && form.password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères');
      setSaving(false);
      return;
    }

    try {
      const body: Record<string, string> = {};
      if (form.name)     body.name     = form.name;
      if (form.email)    body.email    = form.email;
      if (form.password) body.password = form.password;

      const url    = editing ? `${API}/api/admin/admins/${editing.id}` : `${API}/api/admin/admins`;
      const method = editing ? 'PUT' : 'POST';

      const res  = await fetch(url, {
        method,
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur');

      setModal(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(a: Admin) {
    if (!confirm(`Supprimer l'administrateur « ${a.name} » ?`)) return;
    const res  = await fetch(`${API}/api/admin/admins/${a.id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? 'Erreur lors de la suppression');
      return;
    }
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Administrateurs</h1>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-bright transition-colors">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy/5">
          <table className="w-full text-sm">
            <thead className="border-b border-navy/5 bg-cloud">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-navy">Nom</th>
                <th className="px-4 py-3 text-left font-semibold text-navy">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-navy">Créé le</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {admins.map(a => (
                <tr key={a.id} className="hover:bg-cloud/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">
                    {a.name}
                    {a.id === currentUser?.id && (
                      <span className="ml-2 rounded-full bg-orange/10 px-2 py-0.5 text-xs font-semibold text-orange">vous</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{a.email}</td>
                  <td className="px-4 py-4 text-slate-500">
                    {new Date(a.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(a)} title="Modifier"
                        className="rounded-lg p-2 text-slate-400 hover:bg-cloud hover:text-navy transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      {a.id !== currentUser?.id && (
                        <button onClick={() => handleDelete(a)} title="Supprimer"
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-navy/5 px-6 py-4">
              <h2 className="text-lg font-bold text-navy">
                {modal === 'create' ? 'Ajouter un administrateur' : 'Modifier'}
              </h2>
              <button onClick={() => setModal(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-cloud">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Nom *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={INPUT} placeholder="Prénom Nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Mot de passe {modal === 'create' ? '*' : '(laisser vide = inchangé)'}
                </label>
                <input
                  type="password"
                  required={modal === 'create'}
                  minLength={12}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={INPUT}
                  placeholder="Minimum 12 caractères"
                />
              </div>

              {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 rounded-xl border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-cloud transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-bright disabled:opacity-60 transition-colors">
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT = 'w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20';
