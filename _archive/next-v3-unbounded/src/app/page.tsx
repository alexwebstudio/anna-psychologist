import SmoothScroll from '@/components/SmoothScroll';
import Header from '@/components/Header';
import ServiceModal from '@/components/ServiceModal';
import AwfEffects from '@/components/AwfEffects';
import { About, Cta, Footer, Hero, Reviews, Services, Stats } from '@/components/Sections';

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main id="top">
        <Hero />
        <Stats />
        <Services />
        <About />
        <Reviews />
        <Cta />
      </main>
      <Footer />
      <ServiceModal />
      <AwfEffects />
    </SmoothScroll>
  );
}
