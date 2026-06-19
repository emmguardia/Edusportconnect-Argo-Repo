import { Link } from 'react-router-dom';
import { Calendar, Plane, Users, CalendarClock, ArrowRight, type LucideIcon } from 'lucide-react';
import PageHero from '../components/PageHero';

interface Upcoming {
  Icon: LucideIcon;
  title: string;
  text: string;
}

const UPCOMING: Upcoming[] = [
  {
    Icon: Calendar,
    title: 'Événements sportifs & éducatifs',
    text: 'Tournois, rencontres et ateliers pour fédérer les jeunes autour du sport et de l’apprentissage.',
  },
  {
    Icon: Plane,
    title: 'Échanges internationaux',
    text: 'Des projets de mobilité et de rencontre entre les jeunesses d’Europe et d’Afrique.',
  },
  {
    Icon: Users,
    title: 'Ateliers & formations',
    text: 'Des temps de formation au numérique, à la citoyenneté et aux droits humains.',
  },
];

export default function Evenements() {
  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title="Événements"
        subtitle="Retrouvez ici nos prochains rendez-vous : événements sportifs, échanges internationaux, ateliers et formations."
      />

      {/* État « aucun événement » + ce que nous préparons */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* ⚠️ PLACEHOLDER — remplacer par les vrais événements une fois programmés. */}
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-navy/15 bg-cloud px-6 py-12 text-center">
            <CalendarClock className="mx-auto h-12 w-12 text-orange" strokeWidth={1.5} />
            <h2 className="mt-5 text-2xl font-bold text-navy">
              Aucun événement programmé pour le moment
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-600">
              Notre programmation arrive bientôt. En attendant, découvrez ce que
              nous préparons — et laissez-nous vos coordonnées pour être tenu·e
              informé·e.
            </p>
            <Link
              to="/benevole"
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-bright hover:-translate-y-0.5"
            >
              Être informé·e des prochains événements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Ce que nous préparons */}
          <div className="mt-16 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Ce que nous préparons
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
              Nos prochains rendez-vous
            </h2>
            <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {UPCOMING.map(({ Icon, title, text }) => (
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
    </>
  );
}
