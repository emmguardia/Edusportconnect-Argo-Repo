import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';

interface QA {
  q: string;
  a: string;
}

/* ⚠️ PLACEHOLDER — questions/réponses d'exemple, à adapter à votre réalité. */
const FAQ: QA[] = [
  {
    q: 'Qu’est-ce qu’ÉduSport Connect ?',
    a: 'ÉduSport Connect est une association qui accompagne les jeunes à travers le sport, l’éducation, le numérique, les droits humains et la mobilité internationale, en Europe comme en Afrique.',
  },
  {
    q: 'Comment puis-je devenir bénévole ?',
    a: 'Rendez-vous sur la page « Devenir bénévole » et remplissez le formulaire de contact. Nous reviendrons vers vous pour échanger sur la façon dont vous souhaitez vous engager.',
  },
  {
    q: 'Faut-il une expérience particulière pour s’engager ?',
    a: 'Non. La motivation et l’envie d’aider les jeunes suffisent. Chacun peut contribuer selon ses compétences, ses centres d’intérêt et son temps disponible.',
  },
  {
    q: 'Comment devenir partenaire de l’association ?',
    a: 'Structures, entreprises et collectivités peuvent nous soutenir de multiples façons. Contactez-nous via la page « Devenir bénévole / Contact » en précisant votre projet.',
  },
  {
    q: 'Où se déroulent vos actions ?',
    a: 'Nos actions se déploient localement (région de Mâcon, France) et à l’international, dans le cadre de notre vision reliant l’Europe et l’Afrique.',
  },
];

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="Vous vous posez des questions ?"
        title="Foire aux questions"
        subtitle="Les réponses aux questions les plus fréquentes sur l’association, l’engagement et nos actions."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-navy/10 bg-white px-5 py-1 shadow-sm transition-colors open:border-orange/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  <span>{q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-orange transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-slate-600">{a}</p>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-cloud p-7 text-center sm:p-9">
            <h2 className="text-xl font-bold text-navy">Vous n’avez pas trouvé votre réponse&nbsp;?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
              Écrivez-nous directement, nous serons ravis de vous répondre.
            </p>
            <Link
              to="/benevole"
              className="mt-6 inline-flex items-center gap-3 rounded-xl bg-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-bright hover:-translate-y-0.5"
            >
              Poser une question
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
