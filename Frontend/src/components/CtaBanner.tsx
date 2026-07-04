import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CtaBanner() {
  return (
    <section id="benevole" className="relative overflow-hidden bg-navy">
      {/* Photographie en filigrane, fusionnée avec le fond bleu marine */}
      <img
        src="/images/cta.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/75 to-navy/95" />

      {/* Contenu centré */}
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Rejoignez un projet concret pour les jeunes&nbsp;!
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          En devenant bénévole, vous participez à une aventure humaine utile,
          enrichissante et porteuse de sens.
        </p>
        <Link
          to="/benevole"
          className="mt-9 inline-flex items-center gap-3 rounded-xl bg-orange px-8 py-4 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-orange-bright hover:shadow-xl hover:-translate-y-0.5"
        >
          Devenir bénévole
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
