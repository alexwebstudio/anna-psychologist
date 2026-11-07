'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { MARQUEE } from '@/data/content';

/** AW-Flow · Marquee: бесшовная строка, замедляется при наведении, ускоряется от скорости скролла, стоит вне экрана. */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = ref.current!;
      const tween = gsap.to('.marquee__track', { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
      let hover = false;
      let boost = 1;
      let reset: gsap.core.Tween | undefined;

      const apply = () => gsap.to(tween, { timeScale: (hover ? 0.25 : 1) * boost, duration: 0.6, overwrite: true });

      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
        onUpdate: (self) => {
          boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 3);
          apply();
          reset?.kill();
          reset = gsap.delayedCall(0.2, () => {
            boost = 1;
            apply();
          });
        },
      });

      const enter = () => {
        hover = true;
        apply();
      };
      const leave = () => {
        hover = false;
        apply();
      };
      root.addEventListener('mouseenter', enter);
      root.addEventListener('mouseleave', leave);
      return () => {
        root.removeEventListener('mouseenter', enter);
        root.removeEventListener('mouseleave', leave);
      };
    },
    { scope: ref },
  );

  const row = (key: string) => (
    <div className="marquee__group" key={key} aria-hidden={key !== 'a'}>
      {MARQUEE.map((t) => (
        <span className="marquee__item" key={t}>
          {t}
          <svg className="marquee__star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" ref={ref}>
      <div className="marquee__track">{[row('a'), row('b')]}</div>
    </div>
  );
}
