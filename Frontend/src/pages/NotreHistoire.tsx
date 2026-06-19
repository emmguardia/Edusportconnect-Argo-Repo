import { Link } from 'react-router-dom';
import {
  Info,
  User,
  Quote,
  ArrowRight,
  Handshake,
  Users,
  Lightbulb,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import PageHero from '../components/PageHero';

/* -------------------------------------------------------------------------- */
/*  Valeurs (reprises de la charte : bandeau Inclusion · Solidarité ·          */
/*  Innovation · Coopération).                                                 */
/* -------------------------------------------------------------------------- */
interface Value {
  title: string;
  text: string;
  Icon: LucideIcon;
  circle: string; // classe littérale scannée par Tailwind
}

const VALUES: Value[] = [
  {
    title: 'Inclusion',
    text: "Donner à chaque jeune, quel que soit son parcours, une place et une chance de s'épanouir.",
    Icon: Users,
    circle: 'bg-pillar-sport',
  },
  {
    title: 'Solidarité',
    text: 'Avancer ensemble, par l’entraide et le partage, au service de la jeunesse.',
    Icon: Handshake,
    circle: 'bg-orange',
  },
  {
    title: 'Innovation',
    text: 'Imaginer de nouvelles manières d’éduquer, de relier et d’agir, notamment par le numérique.',
    Icon: Lightbulb,
    circle: 'bg-pillar-num',
  },
  {
    title: 'Coopération',
    text: 'Construire des ponts durables entre les territoires, l’Europe et l’Afrique.',
    Icon: Globe,
    circle: 'bg-pillar-inter',
  },
];

export default function NotreHistoire() {
  return (
    <>
      <PageHero
        eyebrow="Unis par le sport, connectés pour l’avenir."
        title="Notre Histoire"
        subtitle="Du parcours d’un fondateur à un projet tourné vers la jeunesse d’Europe et d’Afrique — voici comment est née ÉduSport Connect, et les valeurs qui la portent."
      />

      {/* ──────────────────────────────────────────────────────────────────
          ⚠️ ENCADRÉ PROVISOIRE — supprimer ce bloc une fois le contenu rédigé.
          Les paragraphes ci-dessous sont des exemples à remplacer par le récit
          réel du fondateur.
         ────────────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-orange/60 bg-orange/5 px-5 py-4 text-sm text-navy/80">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
          <p>
            <strong className="font-semibold text-navy">Texte provisoire.</strong>{' '}
            Cette page propose une mise en page complète avec un contenu
            d’exemple. Remplacez chaque paragraphe par votre récit, puis
            supprimez cet encadré.
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          1. Le parcours du fondateur
         ────────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-8">
          {/* Portrait (à remplacer par une vraie photo) */}
          <div className="mx-auto w-full max-w-xs">
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-cloud shadow-sm ring-1 ring-navy/5">
              <User className="h-24 w-24 text-navy/20" strokeWidth={1.2} />
            </div>
            <p className="mt-4 text-center">
              <span className="block font-semibold text-navy">[Nom du fondateur]</span>
              <span className="block text-sm text-slate-500">
                Fondateur d’ÉduSport Connect
              </span>
            </p>
          </div>

          {/* Récit */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Le parcours du fondateur
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
              Un parcours au service des jeunes
            </h2>
            <span className="mt-4 block h-1 w-12 rounded-full bg-orange" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              {/* TODO: remplacer par le vrai parcours du fondateur */}
              <p>
                Mon engagement auprès de la jeunesse est né de mon propre
                parcours. Entre le sport, l’éducation et le terrain associatif,
                j’ai vu très tôt à quel point un accompagnement bienveillant
                pouvait changer la trajectoire d’un jeune.
              </p>
              <p>
                De ces expériences est née une conviction simple&nbsp;: le
                sport et l’éducation, lorsqu’ils sont reliés, ouvrent des
                possibles. C’est cette conviction qui m’a poussé à créer
                ÉduSport Connect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          2. La naissance d'ÉduSport Connect
         ────────────────────────────────────────────────────────────────── */}
      <section className="bg-cloud py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
            La création
          </span>
          <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
            La naissance d’ÉduSport Connect
          </h2>
          <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />

          <div className="relative mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-7 text-left shadow-sm sm:p-9">
            <Quote className="absolute -top-4 left-6 h-9 w-9 text-orange/30" />
            {/* TODO: remplacer par l'histoire réelle de la création */}
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                ÉduSport Connect est née de la volonté de rassembler, au sein
                d’un même projet, ce qui aide vraiment les jeunes à grandir&nbsp;:
                le sport, l’éducation, le numérique, les droits humains et
                l’ouverture sur le monde.
              </p>
              <p>
                L’idée fondatrice est restée la même depuis le premier jour&nbsp;:
                des jeunes engagés accompagnent d’autres jeunes. Une chaîne de
                transmission, de confiance et d’entraide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          3. Une vision Afrique – Europe
         ────────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          {/* Carte Europe–Afrique */}
          <div className="order-last lg:order-first">
            <div className="mx-auto max-w-md rounded-2xl bg-cloud p-8 shadow-sm ring-1 ring-navy/5">
              <img
                src="/images/Map_France_Afrique_Edusport_connect.webp"
                alt="Carte stylisée reliant l’Europe et l’Afrique"
                className="mx-auto w-full max-w-[260px]"
                width={261}
                height={258}
              />
              <p className="mt-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-navy">
                Europe <span className="text-orange">–</span> Afrique
              </p>
            </div>
          </div>

          {/* Texte vision */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Notre vision
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
              Agir pour la jeunesse, en Europe et en Afrique
            </h2>
            <span className="mt-4 block h-1 w-12 rounded-full bg-orange" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              {/* TODO: remplacer par la vision réelle Afrique-Europe */}
              <p>
                ÉduSport Connect se pense des deux côtés de la Méditerranée.
                Nous voulons relier les jeunesses d’Europe et d’Afrique autour
                de projets communs&nbsp;: échanges, mobilité, partage de
                pratiques et de cultures.
              </p>
              <p>
                Cette ouverture est au cœur de notre démarche&nbsp;: apprendre
                les uns des autres, construire des ponts durables et porter, sur
                les deux continents, une même ambition pour la jeunesse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          4. Nos valeurs
         ────────────────────────────────────────────────────────────────── */}
      <section className="bg-cloud py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Ce qui nous guide
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
              Nos valeurs
            </h2>
            <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ title, text, Icon, circle }) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-navy/5 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg shadow-navy/10 ${circle}`}
                >
                  <Icon className="h-8 w-8 text-white" strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          Appel à l'action
         ────────────────────────────────────────────────────────────────── */}
      <section className="bg-navy">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Envie d’écrire la suite avec nous&nbsp;?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Rejoignez l’aventure ÉduSport Connect, en France comme à
            l’international.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/partenaires"
              className="inline-flex items-center gap-3 rounded-xl bg-orange px-8 py-4 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-orange-bright hover:shadow-xl hover:-translate-y-0.5"
            >
              <Handshake className="h-5 w-5" />
              Devenir partenaire
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-xl border-2 border-white/25 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/50 hover:-translate-y-0.5"
            >
              Retour à l’accueil
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
