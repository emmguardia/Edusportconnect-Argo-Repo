import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'nos-actions', label: 'Nos actions' },
  { id: 'benevole', label: 'Devenir bénévole' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('accueil');

  // Ombre + fond plus opaque dès qu'on quitte le haut de page
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Soulignement orange sur la section visible (scroll spy)
  useEffect(() => {
    const sections = NAV_LINKS
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_20px_-8px_rgba(10,35,66,0.25)]' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a href="#accueil" aria-label="ÉduSport Connect — accueil">
            <Logo variant="dark" markSize={46} />
          </a>

          {/* Navigation centrale (desktop) */}
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="group relative text-[0.95rem] font-medium text-navy/85 transition-colors hover:text-navy"
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-[2.5px] rounded-full bg-orange transition-all duration-300 ${
                    active === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Bouton d'action (desktop) */}
          <a
            href="#benevole"
            className="hidden items-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-bright hover:shadow-md hover:-translate-y-0.5 lg:inline-flex"
          >
            Rejoindre le projet
            <ArrowRight className="h-4 w-4" />
          </a>

          {/* Burger (mobile) */}
          <button
            className="rounded-lg p-2 text-navy transition-colors hover:bg-cloud lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="border-t border-navy/5 pb-5 lg:hidden">
            <nav className="flex flex-col pt-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 text-base font-medium transition-colors ${
                    active === link.id ? 'text-orange' : 'text-navy/85 hover:text-navy'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href="#benevole"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white"
            >
              Rejoindre le projet
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
