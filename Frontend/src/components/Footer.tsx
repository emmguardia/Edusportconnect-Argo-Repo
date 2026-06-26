import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import Logo from './Logo';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from './icons';

const FOOTER_NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/notre-histoire', label: 'Notre Histoire' },
  { to: '/evenements', label: 'Événements' },
  { to: '/benevole', label: 'Devenir bénévole' },
  { to: '/partenaires', label: 'Devenir partenaire' },
  { to: '/faq', label: 'FAQ' },
];

const SOCIALS = [
  { Icon: FacebookIcon, label: 'Facebook', href: '#' },
  { Icon: InstagramIcon, label: 'Instagram', href: '#' },
  { Icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-deep">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Partie haute */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <Link to="/" aria-label="ÉduSport Connect — accueil">
              <Logo variant="light" markSize={40} />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Accompagner les jeunes par le sport, l’éducation et le numérique,
              en Europe et en Afrique.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_NAV.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-orange" strokeWidth={1.7} />
                <a
                  href="mailto:contact@edusportconnect.fr"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  contact@edusportconnect.fr
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-orange" strokeWidth={1.7} />
                <span className="text-sm text-white/60">Mâcon, France</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-orange hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barre basse */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-white/60">
            © 2026 ÉduSport Connect – Tous droits réservés
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/mentions-legales"
              className="text-xs text-white/60 transition-colors hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              to="/politique-de-confidentialite"
              className="text-xs text-white/60 transition-colors hover:text-white"
            >
              Politique de confidentialité
            </Link>
            <Link
              to="/connect"
              className="text-xs text-white/20 transition-colors hover:text-white/60"
              aria-label="Administration"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
