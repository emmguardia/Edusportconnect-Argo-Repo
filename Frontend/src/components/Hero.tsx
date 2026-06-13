import { ArrowRight } from 'lucide-react';

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
          <h1 className="animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
            Accompagner les jeunes
            <br />à travers le sport,
            <br />l’éducation et le numérique
          </h1>

          <p className="animate-fade-up-1 mt-6 max-w-md text-lg leading-relaxed text-navy/75">
            Un projet éducatif, citoyen, ouvert sur le monde et tourné vers
            l’avenir.
          </p>

          <a
            href="#benevole"
            className="animate-fade-up-2 mt-9 inline-flex items-center gap-3 rounded-xl bg-navy px-7 py-4 text-base font-semibold text-white shadow-lg shadow-navy/20 transition-all duration-300 hover:bg-navy-deep hover:shadow-xl hover:-translate-y-0.5"
          >
            Rejoindre le projet
            <ArrowRight className="h-5 w-5" />
          </a>
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
