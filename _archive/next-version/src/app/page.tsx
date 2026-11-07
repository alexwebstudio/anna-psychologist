import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import Cursor from '@/components/Cursor';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import About from '@/components/About';
import Cta from '@/components/Cta';
import Footer from '@/components/Footer';
import Effects from '@/components/Effects';

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <Header />
      <main className="page" id="top">
        <Hero />
        <Stats />
        <Marquee />
        <Services />
        <About />
        <Cta />
        <Footer />
      </main>
      <Effects />
    </SmoothScroll>
  );
}
