import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'ÉduSport Connect';
const ORIGIN = 'https://edusportconnect.fr';

export interface SeoOptions {
  /** Titre de la page, sans le nom du site : il est suffixé automatiquement. */
  title: string;
  /** Résumé affiché sous le lien dans Google. Au-delà de ~160 caractères, tronqué. */
  description: string;
  /** Chemin canonique. Par défaut, celui de la route courante. */
  path?: string;
  /** Pages sans intérêt pour la recherche : 404, back-office. */
  noindex?: boolean;
}

/** Renseigne une balise <meta>, en la créant dans <head> si elle manque. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Aligne le <head> sur la route affichée : titre, description, URL canonique et
 * balises de partage.
 *
 * Le site est un SPA — index.html ne contient qu'un seul jeu de balises, celui
 * de la page d'accueil, servi tel quel pour les huit routes publiques. Sans ce
 * hook Google indexe huit pages portant le même titre, la même description et
 * la même canonique pointant vers « / » : il les traite comme des doublons de
 * l'accueil et n'en garde qu'une.
 *
 * Les balises existantes sont mises à jour plutôt que dupliquées, pour ne pas
 * laisser deux <meta name="description"> concurrentes dans le document.
 */
export function useSeo({ title, description, path, noindex = false }: SeoOptions) {
  const { pathname } = useLocation();
  const routePath = path ?? pathname;

  useEffect(() => {
    // Le titre de l'accueil porte déjà la marque : ne pas la répéter.
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const canonical = new URL(routePath.replace(/\/+$/, '') || '/', ORIGIN).href;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setCanonical(canonical);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
  }, [title, description, routePath, noindex]);
}
