/**
 * Logo ÉduSport Connect.
 *
 * ⚠️ Le pictogramme ci-dessous est un PLACEHOLDER (personnage stylisé bras levés
 * tenant un ballon, posé sur un livre ouvert). Il sera remplacé par le logo
 * définitif fourni : déposer le fichier dans `public/images/logo.svg` et
 * remplacer le <LogoMark /> par <img src="/images/logo.svg" .../>.
 *
 * Le wordmark « ÉduSport » (bleu marine / blanc selon le fond) + « CONNECT »
 * (orange, majuscules) est lui conforme à la charte.
 */

interface LogoProps {
  /** 'dark' : texte bleu marine (sur fond clair). 'light' : texte blanc (sur fond marine). */
  variant?: 'dark' | 'light';
  className?: string;
  markSize?: number;
}

function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="32" cy="32" r="30" fill="#ffffff" stroke="#0a2342" strokeWidth="3" />
      {/* Ondes "connect" en haut à droite */}
      <path
        d="M41 15a6 6 0 0 1 6 6M41 11a10 10 0 0 1 10 10"
        stroke="#0a2342"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ballon tenu au-dessus des mains */}
      <circle cx="22.5" cy="15.5" r="3.4" fill="none" stroke="#f28c28" strokeWidth="2.4" />
      {/* Personnage : tête + buste + bras levés */}
      <circle cx="32" cy="20.5" r="4" fill="#0a2342" />
      <path
        d="M32 24.5v10M32 27l-8-9M32 27l7-7.5"
        stroke="#0a2342"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Livre ouvert (orange) à la base */}
      <path
        d="M13 39c6-3.4 13.5-3.4 19 0 5.5-3.4 13-3.4 19 0v7.5c-6-3.4-13.5-3.4-19 0-5.5-3.4-13-3.4-19 0V39Z"
        fill="#f28c28"
      />
      <path d="M32 39v7.5" stroke="#0a2342" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ variant = 'dark', className = '', markSize = 44 }: LogoProps) {
  const eduColor = variant === 'light' ? 'text-white' : 'text-navy';

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={markSize} />
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
