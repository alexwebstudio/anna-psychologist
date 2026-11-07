'use client';

import { useEffect, useRef } from 'react';
import { gsap, hasFinePointer, prefersReducedMotion } from '@/lib/gsap';

const HOVER = 'a, button, [role="button"], [data-cursor]';

/** AW-Flow · Custom Cursor: точка + кольцо, которое догоняет с задержкой и растёт над ссылками. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        dot.classList.add('is-visible');
        ring.classList.add('is-visible');
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      ring.classList.toggle('is-hover', !!t?.closest?.(HOVER));
    };
    const leave = () => {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
      shown = false;
    };
    const down = () => ring.classList.add('is-down');
    const up = () => ring.classList.remove('is-down');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('mouseleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);

    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <i />
      </div>
    </>
  );
}
