import { useState, type FormEvent, type ReactNode } from 'react';
import { Calendar, Plane, Users, Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from './icons';

const API = import.meta.env.VITE_API_URL ?? '';

const UPCOMING = [
  { Icon: Calendar, text: 'Des événements sportifs et éducatifs' },
  { Icon: Plane, text: 'Des échanges internationaux' },
  { Icon: Users, text: 'Des ateliers et formations pour les jeunes' },
];

const SOCIALS = [
  { Icon: FacebookIcon, label: 'Facebook', href: '#' },
  { Icon: InstagramIcon, label: 'Instagram', href: '#' },
  { Icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
];

/** Titre court bleu marine avec fin soulignement orange. */
function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="relative inline-block pb-2 text-xl font-bold text-navy">
      {children}
      <span className="absolute bottom-0 left-0 h-[3px] w-10 rounded-full bg-orange" />
    </h3>
  );
}

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('nom') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    setStatus('sending');
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="contact-grid">
          {/* Colonne 1 — À venir */}
          <div>
            <ColumnTitle>À venir</ColumnTitle>
            <ul className="mt-7 space-y-5">
              {UPCOMING.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-navy" strokeWidth={1.6} />
                  <span className="text-sm text-slate-600">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 2 — Contact */}
          <div>
            <ColumnTitle>Contact</ColumnTitle>
            <ul className="mt-7 space-y-5">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-navy" strokeWidth={1.6} />
                <a
                  href="mailto:contact@edusportconnect.fr"
                  className="text-sm text-slate-600 transition-colors hover:text-orange"
                >
                  contact@edusportconnect.fr
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-navy" strokeWidth={1.6} />
                <span className="text-sm text-slate-600">Mâcon, France</span>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white transition-all duration-300 hover:bg-orange hover:-translate-y-0.5"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 3 — Formulaire */}
          <div className="relative">
            {status === 'sent' ? (
              /* Vrai écran de succès — remplace le formulaire */
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-cloud p-8 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy">Message envoyé !</h3>
                <p className="mt-2 max-w-xs text-sm text-slate-600">
                  Merci de nous avoir contactés. Nous reviendrons vers vous dans les plus brefs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm font-semibold text-orange transition-colors hover:text-navy"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative rounded-2xl bg-cloud p-6 pb-12 shadow-sm sm:p-8 sm:pb-14"
              >
                {status === 'error' && (
                  /* Bannière d'erreur réelle — le formulaire reste pour réessayer */
                  <div
                    role="alert"
                    className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                    <span>
                      L'envoi a échoué. Réessayez, ou écrivez-nous directement à{' '}
                      <a href="mailto:contact@edusportconnect.fr" className="font-semibold underline">
                        contact@edusportconnect.fr
                      </a>.
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="text"
                    name="nom"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Nom"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 outline-none transition-all focus:border-orange focus:ring-2 focus:ring-orange/30"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 outline-none transition-all focus:border-orange focus:ring-2 focus:ring-orange/30"
                  />
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={5}
                    placeholder="Votre message…"
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 outline-none transition-all focus:border-orange focus:ring-2 focus:ring-orange/30"
                  />
                </div>

                {/* Bouton Envoyer — largeur fixe : ne bouge plus quand le texte change */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                  className="absolute bottom-0 right-6 flex w-[150px] translate-y-1/2 items-center justify-center gap-2 rounded-lg bg-navy px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-navy-deep hover:-translate-y-[calc(50%+2px)] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-1/2 disabled:hover:bg-navy"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Envoi…
                    </>
                  ) : (
                    'Envoyer'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
