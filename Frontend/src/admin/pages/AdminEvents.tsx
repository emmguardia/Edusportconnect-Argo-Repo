import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Upload, Image as ImageIcon } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? '';

interface EventImage { id: number; url: string; position: number }
interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  organizer: string | null;
  date_start: string;
  date_end: string | null;
  location: string | null;
  images: EventImage[];
  published: boolean;
}

const EMPTY_FORM = { title: '', description: '', organizer: '', date_start: '', date_end: '', location: '', published: false };

// L'appel réseau est sorti du composant : il ne touche à aucun state, ce qui
// permet de le partager entre le chargement initial (dans l'effet) et les
// rechargements déclenchés par l'interface, sans dupliquer l'URL.
async function fetchEvents(signal?: AbortSignal): Promise<Event[]> {
  const res  = await fetch(`${API}/api/admin/events`, { credentials: 'include', signal });
  const data = await res.json();
  return data.events ?? [];
}

export default function AdminEvents() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [newFiles, setNewFiles]   = useState<File[]>([]);
  const [keptImages, setKeptImages] = useState<EventImage[]>([]);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  // Rechargement déclenché par l'UI (après enregistrement, suppression ou
  // publication) : le passage par `loading` est voulu, on est dans un
  // gestionnaire d'événement.
  async function loadEvents() {
    setLoading(true);
    try {
      setEvents(await fetchEvents());
    } finally { setLoading(false); }
  }

  // Chargement initial. `loading` vaut déjà true au premier rendu : l'effet n'a
  // donc rien à écrire synchroniquement, les états ne bougent qu'au retour du
  // fetch. L'AbortController coupe la requête au démontage, ce qui évite qu'une
  // réponse tardive repeuple un composant disparu — et, en StrictMode, que le
  // premier montage vienne écraser le résultat du second.
  useEffect(() => {
    const ac = new AbortController();
    fetchEvents(ac.signal)
      .then(list => { setEvents(list); setLoading(false); })
      .catch(() => { if (!ac.signal.aborted) setLoading(false); });
    return () => ac.abort();
  }, []);

  function openCreate() {
    setEditing(null); setForm(EMPTY_FORM); setNewFiles([]); setKeptImages([]); setError(''); setModal('create');
  }

  function openEdit(ev: Event) {
    setEditing(ev);
    setForm({
      title: ev.title, description: ev.description ?? '', organizer: ev.organizer ?? '',
      date_start: ev.date_start?.slice(0, 16) ?? '', date_end: ev.date_end?.slice(0, 16) ?? '',
      location: ev.location ?? '', published: ev.published,
    });
    setNewFiles([]); setKeptImages(ev.images); setError(''); setModal('edit');
  }

  function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const total = keptImages.length + newFiles.length + selected.length;
    if (total > 5) { setError('Maximum 5 images.'); return; }
    setNewFiles(f => [...f, ...selected]);
    setError('');
    e.target.value = '';
  }

  function removeKept(id: number) { setKeptImages(imgs => imgs.filter(i => i.id !== id)); }
  function removeNew(idx: number) { setNewFiles(fs => fs.filter((_, i) => i !== idx)); }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const totalImages = keptImages.length + newFiles.length;
    if (totalImages < 1) { setError('Au moins une image est requise.'); return; }
    setSaving(true); setError('');

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      if (form.description) fd.append('description', form.description);
      if (form.organizer)   fd.append('organizer', form.organizer);
      fd.append('date_start', new Date(form.date_start).toISOString());
      if (form.date_end) fd.append('date_end', new Date(form.date_end).toISOString());
      if (form.location) fd.append('location', form.location);
      fd.append('published', String(form.published));
      if (editing) fd.append('keep_images', JSON.stringify(keptImages.map(i => i.id)));
      for (const f of newFiles) fd.append('images', f);

      const url    = editing ? `${API}/api/admin/events/${editing.id}` : `${API}/api/admin/events`;
      const method = editing ? 'PUT' : 'POST';
      const res  = await fetch(url, { method, credentials: 'include', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur');

      setModal(null); loadEvents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally { setSaving(false); }
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

  const totalImages = keptImages.length + newFiles.length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Événements</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-bright transition-colors">
          <Plus className="h-4 w-4" /> Nouvel événement
        </button>
      </div>

      {loading ? <p className="text-slate-500">Chargement…</p> : events.length === 0 ? (
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
                <th className="px-4 py-3 text-center font-semibold text-navy">Images</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-cloud/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {ev.images[0] ? (
                        <img src={`${API}${ev.images[0].url}`} alt="" className="h-9 w-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="flex h-9 w-14 items-center justify-center rounded-lg bg-navy/5 shrink-0">
                          <ImageIcon className="h-4 w-4 text-navy/20" />
                        </div>
                      )}
                      <span className="font-medium text-navy">{ev.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {new Date(ev.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{ev.location ?? '—'}</td>
                  <td className="px-4 py-4 text-center text-slate-500">{ev.images.length}/5</td>
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
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-navy/5 px-6 py-4 shrink-0">
              <h2 className="text-lg font-bold text-navy">
                {modal === 'create' ? 'Nouvel événement' : 'Modifier l\'événement'}
              </h2>
              <button onClick={() => setModal(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-cloud">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4">
              <Field label="Titre *">
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className={INPUT} placeholder="Nom de l'événement" />
              </Field>

              <Field label="Description">
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={INPUT} placeholder="Description…" />
              </Field>

              <Field label="Organisateur">
                <input value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value }))}
                  className={INPUT} placeholder="Nom de l'organisateur (optionnel)" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Date de début *">
                  <input required type="datetime-local" value={form.date_start} onChange={e => setForm(f => ({ ...f, date_start: e.target.value }))} className={INPUT} />
                </Field>
                <Field label="Date de fin">
                  <input type="datetime-local" value={form.date_end} onChange={e => setForm(f => ({ ...f, date_end: e.target.value }))} className={INPUT} />
                </Field>
              </div>

              <Field label="Lieu">
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className={INPUT} placeholder="Ville, salle…" />
              </Field>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-navy">
                    Images * <span className="text-slate-400 font-normal">(1 à 5 — min. 1 requise)</span>
                  </label>
                  <span className={`text-xs font-semibold ${totalImages >= 5 ? 'text-orange' : 'text-slate-400'}`}>
                    {totalImages}/5
                  </span>
                </div>

                {/* Miniatures existantes + nouvelles */}
                {(keptImages.length > 0 || newFiles.length > 0) && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {keptImages.map(img => (
                      <div key={img.id} className="relative group">
                        <img src={`${API}${img.url}`} alt="" className="h-16 w-20 rounded-lg object-cover ring-1 ring-navy/10" />
                        <button type="button" onClick={() => removeKept(img.id)}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {newFiles.map((f, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(f)} alt="" className="h-16 w-20 rounded-lg object-cover ring-1 ring-orange/30" />
                        <button type="button" onClick={() => removeNew(i)}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-orange/80 px-1 py-0.5 text-center text-[9px] text-white">nouveau</div>
                      </div>
                    ))}
                  </div>
                )}

                {totalImages < 5 && (
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-navy/20 px-4 py-3 text-sm text-slate-500 hover:border-orange hover:text-orange transition-colors">
                    <Upload className="h-4 w-4 shrink-0" />
                    Ajouter des images ({5 - totalImages} restante{5 - totalImages > 1 ? 's' : ''})
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={addFiles} />
                  </label>
                )}
              </div>

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
