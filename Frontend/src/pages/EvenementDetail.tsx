import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, ArrowLeft, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

const API = import.meta.env.VITE_API_URL ?? '';

interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  organizer?: string;
  date_start: string;
  date_end?: string;
  location?: string;
  images: string[];
}

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString('fr-FR', opts);

export default function EvenementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent]   = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    fetch(`${API}/api/events/${slug}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(d => { if (d) setEvent(d.event); })
      .finally(() => setLoading(false));
  }, [slug]);

  // Appelé avant les retours anticipés ci-dessous : un hook ne peut pas être
  // conditionnel. Le titre suit l'événement dès que le fetch a répondu — Google
  // exécute le JS et attend le rendu avant de lire le <head>.
  useSeo({
    title: event?.title ?? 'Événement',
    // `||` et non `??` : une description vide doit aussi basculer sur le repli.
    description: event
      ? (event.description?.replace(/\s+/g, ' ').trim().slice(0, 155) ||
         `${event.title}, un événement organisé par ÉduSport Connect.`)
      : "Le détail d'un événement organisé par ÉduSport Connect.",
    noindex: notFound,
  });

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent" />
    </div>
  );

  if (notFound || !event) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white text-center px-4">
      <p className="text-5xl font-extrabold text-navy/10">404</p>
      <p className="text-xl font-bold text-navy">Événement introuvable</p>
      <Link to="/evenements" className="inline-flex items-center gap-2 text-sm font-semibold text-orange hover:underline">
        <ArrowLeft className="h-4 w-4" /> Retour aux événements
      </Link>
    </div>
  );

  const imgs = event.images;
  const hasImg = imgs.length > 0;

  const dateStart = new Date(event.date_start);
  const dateEnd   = event.date_end ? new Date(event.date_end) : null;
  const sameDay   = dateEnd && dateStart.toDateString() === dateEnd.toDateString();
  const isPast    = dateStart < new Date();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[340px] max-h-[600px] overflow-hidden bg-navy">
        {hasImg && (
          <img
            key={heroIdx}
            src={`${API}${imgs[heroIdx]}`}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500"
          />
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

        {/* Flèches galerie */}
        {imgs.length > 1 && (
          <>
            <button
              onClick={() => setHeroIdx(i => (i - 1 + imgs.length) % imgs.length)}
              className="absolute left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setHeroIdx(i => (i + 1) % imgs.length)}
              className="absolute right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 sm:left-10">
          <Link
            to="/evenements"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Événements
          </Link>
        </div>

        {/* Pastilles miniatures */}
        {imgs.length > 1 && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? 'w-6 bg-orange' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}

        {/* Titre overlaid */}
        <div className="absolute bottom-0 inset-x-0 px-6 pb-8 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            {isPast && (
              <span className="mb-3 inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                Événement passé
              </span>
            )}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {fmt(event.date_start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Miniatures sous le hero ───────────────────────────────────── */}
      {imgs.length > 1 && (
        <div className="bg-navy px-6 pb-5 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl flex gap-2 overflow-x-auto">
            {imgs.map((url, i) => (
              <button
                key={i}
                onClick={() => { setHeroIdx(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`shrink-0 h-14 w-20 overflow-hidden rounded-lg transition-all duration-200 ${i === heroIdx ? 'ring-2 ring-orange' : 'opacity-50 hover:opacity-80'}`}
              >
                <img src={`${API}${url}`} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Corps ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">

          {/* Description */}
          <div>
            {event.organizer && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/10">
                  <User className="h-5 w-5 text-orange" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Organisé par</p>
                  <p className="text-sm font-bold text-navy">{event.organizer}</p>
                </div>
              </div>
            )}

            {event.description ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-navy">À propos</h2>
                <div className="text-base leading-relaxed text-slate-600 space-y-3">
                  {event.description.split('\n').map((p, i) =>
                    p.trim() ? <p key={i}>{p}</p> : null
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Aucune description pour cet événement.</p>
            )}
          </div>

          {/* Carte infos */}
          <div className="lg:sticky lg:top-8 self-start">
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-navy/8">
              {/* Date header */}
              <div className="bg-navy px-6 py-5 text-white">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold leading-none">
                    {fmt(event.date_start, { day: '2-digit' })}
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-orange">
                      {fmt(event.date_start, { month: 'long' })}
                    </p>
                    <p className="text-xs text-white/50">{fmt(event.date_start, { year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-navy/6 px-6">
                {/* Horaire */}
                <div className="flex items-start gap-3 py-4">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Horaire</p>
                    <p className="mt-0.5 text-sm font-semibold text-navy">
                      {dateEnd
                        ? sameDay
                          ? `${fmt(event.date_start, { hour: '2-digit', minute: '2-digit' })} – ${fmt(event.date_end!, { hour: '2-digit', minute: '2-digit' })}`
                          : `Du ${fmt(event.date_start, { day: 'numeric', month: 'short' })} au ${fmt(event.date_end!, { day: 'numeric', month: 'short' })}`
                        : `À ${fmt(event.date_start, { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>

                {/* Lieu */}
                {event.location && (
                  <div className="flex items-start gap-3 py-4">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Lieu</p>
                      <p className="mt-0.5 text-sm font-semibold text-navy">{event.location}</p>
                    </div>
                  </div>
                )}

                {/* Organisateur */}
                {event.organizer && (
                  <div className="flex items-start gap-3 py-4">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Organisateur</p>
                      <p className="mt-0.5 text-sm font-semibold text-navy">{event.organizer}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
