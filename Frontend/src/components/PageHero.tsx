import type { ReactNode } from 'react';

interface PageHeroProps {
  /** Petit intitulé orange au-dessus du titre (slogan ou catégorie). */
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
}

/**
 * Bandeau d'introduction bleu marine partagé par toutes les pages internes
 * (Notre Histoire, Événements, Bénévole, FAQ, pages légales…). Termine par la
 * vague concave blanche qui fait la jonction avec le contenu en dessous.
 */
export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy pt-20">
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        {eyebrow && (
          <p className="animate-fade-up flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wide text-orange">
            <span className="h-px w-7 bg-orange" aria-hidden="true" />
            {eyebrow}
            <span className="h-px w-7 bg-orange" aria-hidden="true" />
          </p>
        )}
        <h1 className="animate-fade-up-1 mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="animate-fade-up-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Vague de séparation vers le blanc */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[60px] w-full sm:h-[90px]"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="#ffffff" d="M0,28 C 420,104 1020,104 1440,28 L1440,110 L0,110 Z" />
      </svg>
    </section>
  );
}
