import { HeartHandshake, Sparkles, GraduationCap, type LucideIcon } from 'lucide-react';
import PageHero from '../components/PageHero';
import ContactSection from '../components/ContactSection';

interface Reason {
  Icon: LucideIcon;
  title: string;
  text: string;
}

const REASONS: Reason[] = [
  {
    Icon: HeartHandshake,
    title: 'Une aventure humaine',
    text: 'Rencontrez, accompagnez et soutenez des jeunes dans leur développement personnel et citoyen.',
  },
  {
    Icon: GraduationCap,
    title: 'Transmettre & apprendre',
    text: 'Partagez vos compétences, votre énergie et votre temps — et apprenez autant que vous transmettez.',
  },
  {
    Icon: Sparkles,
    title: 'Un impact concret',
    text: 'Participez à des actions utiles, en France comme à l’international, qui changent vraiment les choses.',
  },
];

export default function Benevole() {
  return (
    <>
      <PageHero
        eyebrow="Rejoignez le projet"
        title="Devenir bénévole"
        subtitle="Bénévole ou partenaire, vous avez une place chez ÉduSport Connect. Découvrez comment contribuer, puis écrivez-nous."
      />

      {/* Pourquoi nous rejoindre */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
              Pourquoi nous rejoindre
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-[2.1rem]">
              Donnez du sens à votre engagement
            </h2>
            <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {REASONS.map(({ Icon, title, text }) => (
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

          {/* Bénévole ou partenaire */}
          <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-cloud p-7 text-center sm:p-9">
            <h3 className="text-xl font-bold text-navy">Bénévole ou partenaire&nbsp;?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
              Vous souhaitez donner de votre temps en tant que bénévole, ou
              soutenir nos actions en tant que partenaire (structure, entreprise,
              collectivité)&nbsp;? Dans les deux cas, utilisez le formulaire
              ci-dessous&nbsp;: nous reviendrons vers vous rapidement.
            </p>
          </div>
        </div>
      </section>

      {/* Formulaire de contact (réutilisé) */}
      <ContactSection />
    </>
  );
}
