import { FileText } from 'lucide-react';
import PageHero from '../components/PageHero';

export default function MentionsLegales() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />

      {/* Page volontairement vide pour l'instant — contenu à compléter. */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <FileText className="mx-auto h-12 w-12 text-orange" strokeWidth={1.4} />
          <h2 className="mt-5 text-2xl font-bold text-navy">Contenu à venir</h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-600">
            Les mentions légales d’ÉduSport Connect seront publiées ici
            prochainement.
          </p>
        </div>
      </section>
    </>
  );
}
