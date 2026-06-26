import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? '';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date_start: string;
  date_end: string | null;
  location: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  title: '',
  description: '',
  date_start: '',
  date_end: '',
  location: '',
  published: false,
};

export default function AdminEvents() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/events`, { credentials: 'include' });
      const data = await res.json();
      setEvents(data.events ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEvents(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setError('');
    setModal('create');
  }

  function openEdit(ev: Event) {
    setEditing(ev);
    setForm({
      title:       ev.title,
      description: ev.description ?? '',
      date_start:  ev.date_start?.slice(0, 16) ?? '',
      date_end:    ev.date_end?.slice(0, 16) ?? '',
      location:    ev.location ?? '',
      published:   ev.published,
    });
    setImageFile(null);
    setError('');
    setModal('edit');
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('description', form.description);
      fd.append('date_start',  new Date(form.date_start).toISOString());
      if (form.date_end)  fd.append('date_end',  new Date(form.date_end).toISOString());
      if (form.location)  fd.append('location',  form.location);
      fd.append('published', String(form.published));
      if (imageFile) fd.append('image', imageFile);

      const url    = editing ? `${API}/api/admin/events/${editing.id}` : `${API}/api/admin/events`;
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, credentials: 'include', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur');

      setModal(null);
      loadEvents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(ev: Event) {
    if (!confirm(`Supprimer « ${ev.title} » ?`)) return;
    await fetch(`${API}/api/admin/events/${ev.id}`, { method: 'DELETE', credentials: 'include' });
    loadEvents();
  }

  async function handleTogglePublish(ev: Event) {
    await fetch(`${API}/api/admin/events/${ev.id}/publish`, { method: 'PATCH', credentials: 'include' });
    loadEvents();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Événements</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-bright transition-colors"
        >
          <Plus className="h-4 w-4" /> Nouvel événement
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : events.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-navy/5">
          <p className="text-slate-500">Aucun événement pour l'instant.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy/5">
          <table className="w-full text-sm">
            <thead className="border-b border-navy/5 bg-cloud">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-navy">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-navy">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-navy">Lieu</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-cloud/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">{ev.title}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {new Date(ev.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{ev.location ?? '—'}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${ev.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {ev.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleTogglePublish(ev)} title={ev.published ? 'Dépublier' : 'Publier'} className="rounded-lg p-2 text-slate-400 hover:bg-cloud hover:text-navy transition-colors">
                        {ev.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => openEdit(ev)} title="Modifier" className="rounded-lg p-2 text-slate-400 hover:bg-cloud hover:text-navy transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(ev)} title="Supprimer" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-navy/5 px-6 py-4">
              <h2 className="text-lg font-bold text-navy">
                {modal === 'create' ? 'Nouvel événement' : 'Modifier l\'événement'}
              </h2>
              <button onClick={() => setModal(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-cloud">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6">
              <Field label="Titre *">
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className={INPUT} placeholder="Nom de l'événement" />
              </Field>

              <Field label="Description">
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={INPUT} placeholder="Description…" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Date de début *">
                  <input required type="datetime-local" value={form.date_start} onChange={e => setForm(f => ({ ...f, date_start: e.target.value }))}
                    className={INPUT} />
                </Field>
                <Field label="Date de fin">
                  <input type="datetime-local" value={form.date_end} onChange={e => setForm(f => ({ ...f, date_end: e.target.value }))}
                    className={INPUT} />
                </Field>
              </div>

              <Field label="Lieu">
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className={INPUT} placeholder="Ville, salle…" />
              </Field>

              <Field label="Image">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-navy/20 px-4 py-3 text-sm text-slate-500 hover:border-orange hover:text-orange transition-colors">
                  <Upload className="h-4 w-4 shrink-0" />
                  {imageFile ? imageFile.name : editing?.image_url ? 'Remplacer l\'image' : 'Choisir une image'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setImageFile(e.target.files?.[0] ?? null)} />
                </label>
              </Field>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="h-4 w-4 accent-orange" />
                <label htmlFor="published" className="text-sm font-medium text-navy">Publier immédiatement</label>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      {children}
    </div>
  );
}
