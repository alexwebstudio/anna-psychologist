import type { Metadata, Viewport } from 'next';
import { Manrope, Oswald } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import Header from '@/components/Header';
import QuizModal from '@/components/QuizModal';
import './globals.css';

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Анна Соколова — клинический психолог онлайн',
  description:
    'Клинический психолог Анна Соколова. Онлайн-консультации для взрослых: тревога и стресс, самооценка, отношения, поиск себя.',
};

export const viewport: Viewport = {
  themeColor: '#F4F2EE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${oswald.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        {/* без JS: прелоадер скрыт, герой показан сразу */}
        <noscript>
          <style>{`.preloader{display:none!important}html.is-loading{overflow:auto!important}.hero{visibility:visible!important}`}</style>
        </noscript>
        <SmoothScroll>
          <Header />
          {children}
          <QuizModal />
        </SmoothScroll>
      </body>
    </html>
  );
}
