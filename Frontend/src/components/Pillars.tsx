import { useEffect, useRef, type ComponentType } from 'react';
import {
  BasketballIcon,
  LaptopIcon,
  ScalesIcon,
  GlobeIcon,
  BookIcon,
  HandshakeHeartIcon,
} from './icons';

interface Pillar {
  title: string;
  text: string;
  Icon: ComponentType<{ className?: string }>;
  /** Classes littérales (scannées par Tailwind) pour cercle + libellé. */
  circle: string;
  label: string;
}

const PILLARS: Pillar[] = [
  {
    title: 'Sport',
    text: "Des activités pour développer la confiance, l’esprit d’équipe et le respect.",
    Icon: BasketballIcon,
    circle: 'bg-pillar-sport',
    label: 'text-pillar-sport',
  },
  {
    title: 'Numérique',
    text: "Sensibilisation à l’usage responsable du numérique et à l’inclusion digitale.",
    Icon: LaptopIcon,
    circle: 'bg-pillar-num',
    label: 'text-pillar-num',
  },
  {
    title: 'Droits humains',
    text: "Éducation aux valeurs de respect, d’égalité, de citoyenneté et de vivre ensemble.",
    Icon: ScalesIcon,
    circle: 'bg-pillar-droits',
    label: 'text-pillar-droits',
  },
  {
    title: 'International',
    text: "Ouverture sur le monde à travers des projets de mobilité internationale et d’interculturalité.",
    Icon: GlobeIcon,
    circle: 'bg-pillar-inter',
    label: 'text-pillar-inter',
  },
  {
    title: 'Éducation',
    text: 'Accompagnement des jeunes dans leur parcours scolaire et personnel.',
    Icon: BookIcon,
    circle: 'bg-pillar-edu',
    label: 'text-pillar-edu',
  },
  {
    title: 'Engagement',
    text: 'Participation à des actions solidaires et développement de projets citoyens.',
    Icon: HandshakeHeartIcon,
    circle: 'bg-pillar-engagement',
    label: 'text-pillar-engagement',
  },
];

export default function Pillars() {
  const gridRef = useRef<HTMLDivElement>(null);

  // Révélation au scroll, en cascade
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.reveal');
    if (!cards) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="nos-actions" className="bg-cloud py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy sm:text-[2.1rem]">
            Nos piliers d’action
          </h2>
          <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-orange" />
        </div>

        {/* Grille (6 colonnes en desktop) */}
        <div ref={gridRef} className="pillars-grid mt-14">
          {PILLARS.map(({ title, text, Icon, circle, label }, i) => (
            <div
              key={title}
              className="reveal flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full shadow-lg shadow-navy/10 transition-transform duration-300 hover:-translate-y-1.5 ${circle}`}
              >
                <Icon className="h-10 w-10 text-white" />
              </div>
              <h3 className={`mt-5 text-lg font-bold ${label}`}>{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
