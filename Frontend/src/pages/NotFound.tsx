import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-white px-4 pt-20">
      <div className="text-center">
        <p className="text-6xl font-extrabold tracking-tight text-orange sm:text-7xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">Page introuvable</h1>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-slate-600">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-navy-deep hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Retour à l’accueil
          </Link>
          <Link
            to="/benevole"
            className="inline-flex items-center gap-2.5 rounded-xl border-2 border-navy/15 px-7 py-3.5 text-sm font-semibold text-navy transition-all duration-300 hover:border-navy/30 hover:bg-cloud"
          >
            <ArrowLeft className="h-4 w-4" />
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
