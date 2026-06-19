import { ArrowRight, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-white pt-20">
      {/* Photographie : domine la moitié droite et le haut */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[60%]">
        <img
          src="/images/hero.jpg"
          alt="Un groupe de jeunes de dos, bras sur les épaules, face à un terrain de sport"
          className="h-full w-full object-cover object-center"
        />
        {/* Voile blanc dégradé vers la gauche → lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent lg:via-white/30" />
        {/* Léger fondu blanc par le bas pour fusionner avec la vague */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Contenu textuel — aligné à gauche */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl py-20 sm:py-24 lg:py-36">
          {/* Slogan officiel */}
          <p className="animate-fade-up flex items-center gap-2.5 text-sm font-semibold tracking-wide text-orange sm:text-[0.95rem]">
            <span className="h-px w-7 bg-orange" aria-hidden="true" />
            Unis par le sport, connectés pour l’avenir.
          </p>

          <h1 className="animate-fade-up-1 mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
            Accompagner les jeunes
            <br />à travers le sport,
            <br />l’éducation et le numérique
          </h1>

          {/* Mission mise en avant dès la première section */}
          <p className="animate-fade-up-2 mt-6 max-w-md text-lg leading-relaxed text-navy/75">
            Notre mission&nbsp;: accompagner la jeunesse en Europe et en Afrique
            par le sport, l’éducation et le numérique — pour apprendre,
            s’engager et grandir ensemble.
          </p>

          <div className="animate-fade-up-3 mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/benevole"
              className="inline-flex items-center gap-3 rounded-xl bg-orange px-7 py-4 text-base font-semibold text-white shadow-lg shadow-orange/25 transition-all duration-300 hover:bg-orange-bright hover:shadow-xl hover:-translate-y-0.5"
            >
              <Handshake className="h-5 w-5" />
              Devenir partenaire
            </Link>
            <Link
              to="/benevole"
              className="inline-flex items-center gap-3 rounded-xl border-2 border-navy/15 bg-white px-7 py-4 text-base font-semibold text-navy transition-all duration-300 hover:border-navy/30 hover:bg-cloud hover:-translate-y-0.5"
            >
              Rejoindre le projet
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Séparation inférieure : vague concave (creuse au centre, remonte aux bords) */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[70px] w-full sm:h-[100px]"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#ffffff"
          d="M0,28 C 420,104 1020,104 1440,28 L1440,110 L0,110 Z"
        />
      </svg>
    </section>
  );
}
