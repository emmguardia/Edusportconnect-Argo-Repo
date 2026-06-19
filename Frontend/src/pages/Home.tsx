import Hero from '../components/Hero';
import About from '../components/About';
import Pillars from '../components/Pillars';
import CtaBanner from '../components/CtaBanner';
import ContactSection from '../components/ContactSection';

export default function Home() {
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
