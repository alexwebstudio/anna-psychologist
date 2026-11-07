'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { isIntroDone, markIntroDone } from '@/lib/intro';
import { useLenis } from './SmoothScroll';

const NAME = 'Анна Соколова';
const MIN_SHOW = 1500; // мс — минимальное время показа

/** AW-Flow · Preloader — Logo Reveal: буквы выезжают по очереди, затем экран уходит вверх шторкой. */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const start = performance.now();

    // при возврате на главную со страницы направления прелоадер не показываем повторно
    if (isIntroDone()) {
      el.style.display = 'none';
      return;
    }
    root.classList.add('is-loading');

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const finish = () => {
      root.classList.remove('is-loading');
      lenisRef.current?.start();
      markIntroDone();
    };

    if (prefersReducedMotion()) {
      el.style.display = 'none';
      finish();
      return;
    }

    let tl: gsap.core.Timeline | undefined;
    const exit = () => {
      if (tl) return;
      const wait = Math.max(0, MIN_SHOW - (performance.now() - start)) / 1000;
      tl = gsap
        .timeline({ delay: wait })
        .to(el.querySelector('.preloader__inner'), { yPercent: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.in' })
        .to(el, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
        .call(finish, [], '<0.4')
        .set(el, { display: 'none' });
    };

    const fallback = window.setTimeout(exit, 4000);
    if (document.readyState === 'complete') exit();
    else window.addEventListener('load', exit, { once: true });

    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener('load', exit);
      tl?.kill();
    };
  }, []);

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <div className="preloader__inner">
        <div className="preloader__logo">
          {NAME.split('').map((ch, i) => (
            <span key={i} className={ch === ' ' ? 'sp' : undefined} style={{ '--i': i } as React.CSSProperties}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>
        <p className="preloader__meta">Клинический психолог</p>
      </div>
    </div>
  );
}
