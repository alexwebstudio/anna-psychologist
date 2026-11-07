import type { Metadata, Viewport } from 'next';
import { Manrope, Unbounded } from 'next/font/google';
import './globals.css';

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '700', '800'],
  variable: '--font-unbounded',
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

export const viewport: Viewport = { themeColor: '#F4F2EE' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${manrope.variable}`}>
      <body>
        <noscript>
          <style>{`.awf-text-blur,.awf-blur-in,.awf-text-blur .awf-p{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
