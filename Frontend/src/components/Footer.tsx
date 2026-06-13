import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-navy-deep">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-5 px-4 py-6 text-center sm:px-6 lg:grid-cols-3 lg:gap-4 lg:text-left">
        {/* Logo miniature */}
        <div className="flex justify-center lg:justify-start">
          <Logo variant="light" markSize={36} className="scale-90" />
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/70 lg:text-center">
          © 2026 ÉduSport Connect – Tous droits réservés
        </p>

        {/* Liens légaux */}
        <div className="flex justify-center gap-6 lg:justify-end">
          <a href="#" className="text-xs text-white/70 transition-colors hover:text-white">
            Mentions légales
          </a>
          <a href="#" className="text-xs text-white/70 transition-colors hover:text-white">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </footer>
  );
}
