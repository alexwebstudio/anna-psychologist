'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const HEADER_OFFSET = -96;

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Плавный скролл (Lenis). Якорные ссылки обрабатываются с отступом под хедер. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const instance = new Lenis({ lerp: 0.09, anchors: { offset: HEADER_OFFSET }, autoRaf: true });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
