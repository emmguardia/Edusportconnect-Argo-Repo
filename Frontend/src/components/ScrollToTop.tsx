import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Gère le défilement lors d'un changement de route :
 *  - sans ancre  → on remonte en haut de la page ;
 *  - avec ancre (#section) → on défile en douceur jusqu'à la section, une fois
 *    la nouvelle page montée (ex. lien « Devenir partenaire » → /#contact).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
