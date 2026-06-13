import { useState, type FormEvent, type ReactNode } from 'react';
import { Calendar, Plane, Users, Mail, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from './icons';

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
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Front-end uniquement pour l'instant — pas de back-end branché.
    setSent(true);
    setTimeout(() => setSent(false), 4000);
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
            <form
              onSubmit={handleSubmit}
              className="relative rounded-2xl bg-cloud p-6 pb-12 shadow-sm sm:p-8 sm:pb-14"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  name="nom"
                  required
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
                  rows={5}
                  placeholder="Votre message…"
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 outline-none transition-all focus:border-orange focus:ring-2 focus:ring-orange/30"
                />
              </div>

              {/* Bouton Envoyer — chevauche la bordure inférieure du bloc gris */}
              <button
                type="submit"
                className="absolute bottom-0 right-6 translate-y-1/2 rounded-lg bg-navy px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-navy-deep hover:-translate-y-[calc(50%+2px)]"
              >
                {sent ? 'Merci !' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
