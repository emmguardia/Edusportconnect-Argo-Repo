/**
 * Icônes SVG sur-mesure.
 *
 * - Icônes des piliers : tracées en trait fin (outline), couleur héritée via
 *   `currentColor` → on les pose dans un cercle coloré avec la classe text-white.
 * - Icônes réseaux sociaux : glyphes de marque, blanches sur cercle bleu marine.
 *
 * On les dessine à la main plutôt que de dépendre d'un pack d'icônes : contrôle
 * total du rendu (épaisseur, formes) et aucun risque de glyphe manquant.
 */

interface IconProps {
  className?: string;
}

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* --------------------------------- Piliers -------------------------------- */

// Ballon de basket
export function BasketballIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M5.6 5.6c3.4 3.2 3.4 9.6 0 12.8" />
      <path d="M18.4 5.6c-3.4 3.2-3.4 9.6 0 12.8" />
    </svg>
  );
}

// Ordinateur portable ouvert
export function LaptopIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <rect x="4.5" y="5" width="15" height="10.5" rx="1.5" />
      <path d="M2.5 19.5h19" />
    </svg>
  );
}

// Balance de la justice
export function ScalesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <line x1="12" y1="4.6" x2="12" y2="20" />
      <line x1="6.5" y1="20" x2="17.5" y2="20" />
      <line x1="5" y1="7" x2="19" y2="7" />
      <circle cx="12" cy="4" r="1.2" />
      {/* plateau gauche */}
      <line x1="5" y1="7" x2="2.8" y2="11.2" />
      <line x1="5" y1="7" x2="7.2" y2="11.2" />
      <path d="M2.4 11.2a2.6 2 0 0 0 5.2 0" />
      {/* plateau droit */}
      <line x1="19" y1="7" x2="16.8" y2="11.2" />
      <line x1="19" y1="7" x2="21.2" y2="11.2" />
      <path d="M16.4 11.2a2.6 2 0 0 0 5.2 0" />
    </svg>
  );
}

// Globe terrestre quadrillé
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M4.6 7h14.8" />
      <path d="M4.6 17h14.8" />
    </svg>
  );
}

// Livre ouvert
export function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M12 6.4C9.9 5.1 6 5.1 3.5 6.3V18c2.5-1.2 6.4-1.2 8.5.1" />
      <path d="M12 6.4C14.1 5.1 18 5.1 20.5 6.3V18c-2.5-1.2-6.4-1.2-8.5.1" />
      <line x1="12" y1="6.4" x2="12" y2="18.1" />
    </svg>
  );
}

// Deux mains se serrant, formant subtilement un cœur (poignée de solidarité)
export function HandshakeHeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M12 20S3.5 14.6 3.5 8.9C3.5 6.2 5.6 4.2 8.1 4.2c1.7 0 3 .9 3.9 2.4C12.9 5.1 14.2 4.2 15.9 4.2c2.5 0 4.6 2 4.6 4.7C20.5 14.6 12 20 12 20Z" />
      <path d="M8.6 9.4 11 11.6c.4.4 1 .4 1.4 0M10.4 12.9l1.2 1.1c.4.3.9.3 1.3 0" />
    </svg>
  );
}

/* ----------------------------- Réseaux sociaux ---------------------------- */

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 21v-7.1h2.4l.36-2.78H13.5V9.34c0-.8.22-1.35 1.38-1.35h1.47V5.5a19.6 19.6 0 0 0-2.15-.11c-2.13 0-3.59 1.3-3.59 3.69v2.06H8.2v2.78h2.41V21h2.89Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.3 9h3.4v11.5H3.3V9Zm5.5 0h3.27v1.57h.05c.46-.86 1.57-1.77 3.23-1.77 3.45 0 4.09 2.27 4.09 5.23v6.47h-3.41v-5.74c0-1.37-.02-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03v5.84H8.8V9Z" />
    </svg>
  );
}
