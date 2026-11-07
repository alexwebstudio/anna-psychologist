'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from '@/lib/gsap';
import { markIntroDone, onIntroDone } from '@/lib/intro';

/**
 * Скролл-эффекты по data-атрибутам (в духе AW-Flow — эффект назначается атрибутом):
 *   data-fx="mask"   — Mask Reveal: строки выезжают из-под маски
 *   data-fx="blur"   — Blur Reveal: слова выходят из размытия
 *   data-fx="fade"   — Fade Up (data-delay — задержка в секундах)
 *   data-fx="wipe"   — Mask Wipe для изображений ([data-wipe-inner] «оседает» по масштабу)
 *   data-fx="batch"  — Stagger Grid через ScrollTrigger.batch
 *   data-fx="count"  — Number Roll (data-to — конечное значение)
 *   data-blob        — Floating Blobs
 *   data-draw-group  — иллюстрация: линии [data-draw] прорисовываются, заливки [data-draw-fill] проявляются
 */
export default function Effects() {
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    // на страницах без прелоадера (направления) стартуем сразу
    if (!document.querySelector('.preloader')) markIntroDone();
    // эффекты стартуют после прелоадера, чтобы счётчики не отыграли под ним
    const off = onIntroDone(() => {
    ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const once = (trigger: Element, start = 'top 86%') => ({ trigger, start, once: true });

      // Number Roll
      gsap.utils.toArray<HTMLElement>('[data-fx="count"]').forEach((el) => {
        const to = Number(el.dataset.to);
        const obj = { v: 0 };
        el.textContent = '0';
        gsap.to(obj, {
          v: to,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: once(el, 'top 92%'),
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });

      // Mask Reveal — по строкам, пересобирается при ресайзе
      gsap.utils.toArray<HTMLElement>('[data-fx="mask"]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'fx-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 112,
              rotate: 4,
              transformOrigin: '0% 100%',
              duration: 1.1,
              stagger: 0.12,
              ease: 'expo.out',
              scrollTrigger: once(el, 'top 85%'),
            }),
        });
      });

      // Blur Reveal
      gsap.utils.toArray<HTMLElement>('[data-fx="blur"]').forEach((el) => {
        const split = SplitText.create(el, { type: 'words', wordsClass: 'fx-word' });
        gsap.from(split.words, {
          autoAlpha: 0,
          filter: 'blur(10px)',
          y: 10,
          duration: 0.9,
          stagger: 0.028,
          ease: 'power2.out',
          clearProps: 'filter',
          scrollTrigger: once(el, 'top 80%'),
        });
      });

      // Fade Up
      gsap.utils.toArray<HTMLElement>('[data-fx="fade"]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          delay: Number(el.dataset.delay ?? 0),
          ease: 'power3.out',
          scrollTrigger: once(el, 'top 90%'),
        });
      });

      // Mask Wipe
      gsap.utils.toArray<HTMLElement>('[data-fx="wipe"]').forEach((el) => {
        const inner = el.querySelector('[data-wipe-inner]');
        const tl = gsap.timeline({ scrollTrigger: once(el, 'top 80%') });
        tl.from(el, { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' });
        if (inner) tl.from(inner, { scale: 1.12, duration: 1.8, ease: 'power3.out' }, 0);
      });

      // Stagger Grid
      const batch = gsap.utils.toArray<HTMLElement>('[data-fx="batch"]');
      gsap.set(batch, { y: 60, autoAlpha: 0 });
      ScrollTrigger.batch(batch, {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out', overwrite: true }),
      });

      // Иллюстрации направлений: линии прорисовываются, заливки проявляются
      gsap.utils.toArray<SVGSVGElement>('[data-draw-group]').forEach((svg) => {
        const lines = svg.querySelectorAll<SVGGeometryElement>('[data-draw]');
        const fills = svg.querySelectorAll<SVGElement>('[data-draw-fill]');
        lines.forEach((l) => l.setAttribute('pathLength', '1'));
        gsap
          .timeline({ scrollTrigger: once(svg, 'top 88%') })
          .fromTo(lines, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.1, ease: 'power2.inOut' }, 0.2)
          .from(fills, { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%', duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.5);
      });

      // Floating Blobs
      gsap.utils.toArray<HTMLElement>('[data-blob]').forEach((b, i) => {
        gsap.to(b, {
          x: () => gsap.utils.random(-120, 120),
          y: () => gsap.utils.random(-80, 80),
          scale: () => gsap.utils.random(0.85, 1.25),
          duration: gsap.utils.random(9, 13),
          delay: i * 0.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        });
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return null;
}
