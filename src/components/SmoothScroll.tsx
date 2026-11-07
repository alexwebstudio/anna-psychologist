'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

export const HEADER_OFFSET = -96;

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Плавный скролл Lenis, синхронизированный с тикером GSAP и ScrollTrigger. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      anchors: { offset: HEADER_OFFSET },
      autoRaf: false,
    });

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (document.documentElement.classList.contains('is-loading')) instance.stop();
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // смена страницы: наверх (или к якорю, если перешли на «/#раздел»)
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current === pathname) return; // реагируем только на реальный переход
    prevPath.current = pathname;
    const id = window.setTimeout(() => {
      lenis?.resize();
      const hash = window.location.hash;
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (target) scrollToTarget(lenis, hash);
      else if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Скролл к якорю: через Lenis, если он активен, иначе нативно. */
export function scrollToTarget(lenis: Lenis | null, selector: string) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
