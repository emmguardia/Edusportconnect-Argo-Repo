import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, ArrowRight, ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react';
import PageHero from '../components/PageHero';

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

function formatDateShort(iso: string) {
  return {
    day:   new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: new Date(iso).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
    year:  new Date(iso).getFullYear(),
  };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function ImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return (
    <div className="flex h-full w-full items-center justify-center bg-navy/5">
      <CalendarClock className="h-12 w-12 text-navy/20" />
    </div>
  );
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        key={idx}
        src={`${API}${images[idx]}`}
        alt=""
        className="h-full w-full object-cover transition-opacity duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.preventDefault(); setIdx(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={e => { e.preventDefault(); setIdx(i => (i + 1) % images.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const d = formatDateShort(event.date_start);
  const isPast = new Date(event.date_start) < new Date();

  return (
    <Link to={`/evenements/${event.slug}`} className="group block rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-navy/6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-navy/5">
        <ImageCarousel images={event.images} />
        {/* Badge date */}
        <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl bg-white/95 backdrop-blur-sm px-3 py-2 shadow-sm min-w-[52px] text-center">
          <span className="text-[1.3rem] font-extrabold leading-none text-navy">{d.day}</span>
          <span className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-orange">{d.month}</span>
          <span className="text-[0.6rem] text-navy/40">{d.year}</span>
        </div>
        {isPast && (
          <div className="absolute top-3 right-3 rounded-lg bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
            Passé
          </div>
        )}
      </div>

      {/* Corps */}
      <div className="p-5">
        <h3 className="text-base font-bold text-navy line-clamp-2 group-hover:text-orange transition-colors">
          {event.title}
        </h3>

        <div className="mt-3 space-y-1.5">
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-orange" strokeWidth={2} />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <User className="h-3.5 w-3.5 shrink-0 text-orange" strokeWidth={2} />
              <span className="truncate">{event.organizer}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-navy/6 pt-4">
          <div className="text-xs text-slate-400">
            {event.date_end
              ? `${formatTime(event.date_start)} – ${formatTime(event.date_end)}`
              : `À ${formatTime(event.date_start)}`}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange">
            En savoir plus <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Evenements() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/events`)
      .then(r => r.json())
      .then(d => setEvents(d.events ?? []))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => new Date(e.date_start) >= new Date());
  const past     = events.filter(e => new Date(e.date_start) < new Date());

  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title="Événements"
        subtitle="Retrouvez ici nos prochains rendez-vous : événements sportifs, échanges internationaux, ateliers et formations."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse rounded-2xl overflow-hidden bg-white ring-1 ring-navy/6">
                  <div className="h-52 bg-navy/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-navy/8 rounded w-3/4" />
                    <div className="h-3 bg-navy/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-navy/15 bg-cloud px-6 py-12 text-center">
              <CalendarClock className="mx-auto h-12 w-12 text-orange" strokeWidth={1.5} />
              <h2 className="mt-5 text-2xl font-bold text-navy">Aucun événement programmé</h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-600">
                Notre programmation arrive bientôt. Laissez-nous vos coordonnées pour être informé·e.
              </p>
              <Link
                to="/benevole"
                className="mt-7 inline-flex items-center gap-3 rounded-xl bg-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-bright hover:-translate-y-0.5"
              >
                Être informé·e <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {!loading && upcoming.length > 0 && (
            <>
              <div className="mb-8">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">À venir</span>
                <h2 className="mt-2 text-2xl font-bold text-navy">Prochains événements</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            </>
          )}

          {!loading && past.length > 0 && (
            <div className="mt-16">
              <div className="mb-8">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-navy/40">Archives</span>
                <h2 className="mt-2 text-2xl font-bold text-navy/60">Événements passés</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-70">
                {past.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
