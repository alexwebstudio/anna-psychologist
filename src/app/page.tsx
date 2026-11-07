import Preloader from '@/components/Preloader';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import About from '@/components/About';
import Reviews from '@/components/Reviews';
import Prices from '@/components/Prices';
import Cta from '@/components/Cta';
import Footer from '@/components/Footer';
import Effects from '@/components/Effects';

export default function Home() {
  return (
    <>
      <Preloader />
      <main className="page" id="top">
        <Hero />
        <Stats />
        <Services />
        <About />
        <Reviews />
        <Prices />
        <Cta />
        <Footer />
      </main>
      <Effects />
    </>
  );
}
