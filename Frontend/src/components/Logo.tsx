/**
 * Logo ÉduSport Connect.
 *
 * Le pictogramme officiel (personnage bras levés tenant un ballon, posé sur un
 * livre ouvert) est servi depuis `public/images/Logo.webp`. Le wordmark
 * « ÉduSport » (bleu marine / blanc selon le fond) + « CONNECT » (orange) reste
 * en texte pour rester net à toute taille et s'adapter aux deux variantes.
 */

interface LogoProps {
  /** 'dark' : texte bleu marine (sur fond clair). 'light' : texte blanc (sur fond marine). */
  variant?: 'dark' | 'light';
  className?: string;
  /** Hauteur du pictogramme en pixels (la largeur suit le ratio du logo). */
  markSize?: number;
}

export default function Logo({ variant = 'dark', className = '', markSize = 44 }: LogoProps) {
  const eduColor = variant === 'light' ? 'text-white' : 'text-navy';

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <img
        src="/images/Logo.webp"
        alt=""
        aria-hidden="true"
        width={markSize}
        height={markSize}
        style={{ height: markSize, width: 'auto' }}
        className="shrink-0"
      />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.35rem] font-extrabold tracking-tight ${eduColor}`}>
          ÉduSport
        </span>
        <span className="text-sm font-semibold tracking-[0.25em] text-orange -mt-0.5">
          CONNECT
        </span>
      </span>
    </span>
  );
}
