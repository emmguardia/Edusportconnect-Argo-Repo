import Hero from '../components/Hero';
import About from '../components/About';
import Pillars from '../components/Pillars';
import CtaBanner from '../components/CtaBanner';
import ContactSection from '../components/ContactSection';
import { useSeo } from '../hooks/useSeo';

export default function Home() {
  useSeo({
    title: "ÉduSport Connect — Accompagner les jeunes par le sport, l'éducation et le numérique",
    description:
      "Association engagée pour accompagner les jeunes dans leur développement personnel, éducatif et citoyen : sport, éducation, numérique, droits humains et mobilité internationale.",
  });

  return (
    <>
      <Hero />
      <About />
      <Pillars />
      <CtaBanner />
      <ContactSection />
    </>
  );
}
