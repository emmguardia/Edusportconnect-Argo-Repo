import {
  HeartHandshake,
  Eye,
  Globe,
  Coins,
  Gift,
  Briefcase,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import ContactSection from '../components/ContactSection';

interface Item {
  Icon: LucideIcon;
  title: string;
  text: string;
}

const BENEFITS: Item[] = [
  {
    Icon: HeartHandshake,
    title: 'Un engagement à impact',
    text: 'Associez votre structure à un projet concret au service de la jeunesse, de l’éducation et de l’inclusion.',
  },
  {
    Icon: Eye,
    title: 'Une visibilité valorisante',
    text: 'Donnez du sens à votre image en soutenant des actions utiles, sur le terrain et dans la durée.',
  },
  {
    Icon: Globe,
    title: 'Une portée internationale',
    text: 'Participez à une dynamique qui relie les jeunesses d’Europe et d’Afrique autour de valeurs communes.',
  },
];

const SUPPORT: Item[] = [
  {
    Icon: Coins,
    title: 'Mécénat financier',
    text: 'Soutenez financièrement nos actions et nos projets, ponctuellement ou dans la durée.',
  },
  {
    Icon: Gift,
    title: 'Dons en nature',
    text: 'Matériel sportif, équipement numérique, locaux… toute contribution matérielle est précieuse.',
  },
  {
    Icon: Briefcase,
    title: 'Mécénat de compétences',
    text: 'Mettez à disposition le savoir-faire de vos équipes pour accompagner nos actions.',
  },
  {
    Icon: Megaphone,
    title: 'Visibilité & réseau',
    text: 'Relayez nos initiatives et ouvrez-nous votre réseau pour amplifier notre impact.',
  },
];

export default function Partenaires() {
  return (
    <>
      <PageHero
        eyebrow="Soutenez la jeunesse"
        title="Devenir partenaire"
        subtitle="Entreprises, structures, collectivités : associez-vous à ÉduSport Connect pour agir, ensemble, en faveur de la jeunesse en Europe et en Afrique."
      />

      {/* Pourquoi devenir partenaire */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Pourquoi nous soutenir
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
              Un partenariat porteur de sens
            </h2>
            <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BENEFITS.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-navy/5 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange shadow-lg shadow-orange/20">
                  <Icon className="h-8 w-8 text-white" strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment nous soutenir */}
      <section className="bg-cloud py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Plusieurs façons d’agir
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
              Comment nous soutenir
            </h2>
            <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-navy/5 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy shadow-lg shadow-navy/10">
                  <Icon className="h-8 w-8 text-white" strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ils nous soutiennent (logos à venir) */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
            Ils nous font confiance
          </span>
          <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
            Nos partenaires
          </h2>
          <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />

          {/* ⚠️ PLACEHOLDER — remplacer par les logos réels des partenaires. */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex h-24 items-center justify-center rounded-xl border border-dashed border-navy/15 bg-cloud text-sm font-medium text-slate-400"
              >
                Logo partenaire
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm italic text-slate-400">
            Cet espace accueillera les logos de nos partenaires.
          </p>
        </div>
      </section>

      {/* Formulaire de contact (réutilisé) */}
      <ContactSection />
    </>
  );
}
