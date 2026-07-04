import { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? '';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/messages`, { credentials: 'include' });
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce message ?')) return;
    await fetch(`${API}/api/admin/messages/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Messages de contact</h1>

      {loading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-navy/5">
          <Mail className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="text-slate-500">Aucun message pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-navy/5 overflow-hidden">
              <div
                className="flex cursor-pointer items-center justify-between px-6 py-4 hover:bg-cloud/50 transition-colors"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-navy">{msg.name}</span>
                    <span className="text-sm text-slate-400">{msg.email}</span>
                  </div>
                  {msg.subject && (
                    <p className="mt-0.5 text-sm text-slate-600 truncate">{msg.subject}</p>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400">
                    {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                    className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {expanded === msg.id && (
                <div className="border-t border-navy/5 px-6 pb-5 pt-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{msg.message}</p>
                  <div className="mt-4">
                    <a
                      href={`mailto:${msg.email}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-bright transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Répondre
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
