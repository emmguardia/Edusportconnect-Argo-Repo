import { useEffect, useState } from 'react';
import { Menu, X, Handshake } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';

const NAV_LINKS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/notre-histoire', label: 'Notre Histoire' },
  { to: '/evenements', label: 'Événements' },
  { to: '/benevole', label: 'Devenir bénévole' },
  { to: '/faq', label: 'FAQ' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Ombre + fond plus opaque dès qu'on quitte le haut de page
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
          <Link to="/" aria-label="ÉduSport Connect — accueil">
            <Logo variant="dark" markSize={46} />
          </Link>

          {/* Navigation centrale (desktop) */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className="group relative text-[0.95rem] font-medium text-navy/85 transition-colors hover:text-navy"
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2.5px] rounded-full bg-orange transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bouton d'action (desktop) */}
          <Link
            to="/benevole"
            className="hidden items-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-bright hover:shadow-md hover:-translate-y-0.5 lg:inline-flex"
          >
            <Handshake className="h-4 w-4" />
            Devenir partenaire
          </Link>

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
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-base font-medium transition-colors ${
                      isActive ? 'text-orange' : 'text-navy/85 hover:text-navy'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <Link
              to="/benevole"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white"
            >
              <Handshake className="h-4 w-4" />
              Devenir partenaire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
