'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText, hasFinePointer, prefersReducedMotion } from '@/lib/gsap';
import { onIntroDone } from '@/lib/intro';

/**
 * Скролл-эффекты по data-атрибутам (в духе AW-Flow — эффект назначается атрибутом):
 *   data-fx="mask"   — Mask Reveal: строки выезжают из-под маски
 *   data-fx="blur"   — Blur Reveal + Marker Highlight для .mk внутри
 *   data-fx="fade"   — Fade Up (data-delay — задержка в секундах)
 *   data-fx="wipe"   — Mask Wipe для изображений ([data-wipe-inner] «оседает» по масштабу)
 *   data-fx="batch"  — Stagger Grid через ScrollTrigger.batch
 *   data-fx="count"  — Number Roll (data-to — конечное значение)
 *   data-magnetic    — Magnetic Button
 *   data-blob        — Floating Blobs
 *   data-spin        — медленное вращение орнамента от скролла
 */
export default function Effects() {
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    let magnetCleanup: (() => void) | undefined;

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

        // Blur Reveal + Marker Highlight
        gsap.utils.toArray<HTMLElement>('[data-fx="blur"]').forEach((el) => {
          const split = SplitText.create(el, { type: 'words', wordsClass: 'fx-word' });
          const marks = el.querySelectorAll('.mk');
          gsap
            .timeline({ scrollTrigger: once(el, 'top 80%') })
            .from(split.words, {
              autoAlpha: 0,
              filter: 'blur(10px)',
              y: 10,
              duration: 0.9,
              stagger: 0.028,
              ease: 'power2.out',
              clearProps: 'filter',
            })
            .from(marks, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.6, stagger: 0.08, ease: 'power2.inOut' }, '-=0.5');
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

        // орнаменты вращаются от скролла
        gsap.utils.toArray<HTMLElement>('[data-spin]').forEach((el) => {
          gsap.to(el, {
            rotate: 90 * Number(el.dataset.spin),
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        });
      });

      magnetCleanup = setupMagnetic();
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      off();
      ctx?.revert();
      magnetCleanup?.();
    };
  }, []);

  return null;
}

/** AW-Flow · Magnetic Button: притягивается к курсору в радиусе, плавно возвращается. */
function setupMagnetic() {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  const STRENGTH = 0.35;
  const RADIUS = 60;

  const items = gsap.utils.toArray<HTMLElement>('[data-magnetic]').map((el) => {
    const inner = el.querySelector<HTMLElement>('.btn__label, svg');
    return {
      el,
      on: false,
      x: gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' }),
      ix: inner ? gsap.quickTo(inner, 'x', { duration: 0.4, ease: 'power3.out' }) : null,
      iy: inner ? gsap.quickTo(inner, 'y', { duration: 0.4, ease: 'power3.out' }) : null,
    };
  });

  let raf = 0;
  let mx = 0;
  let my = 0;
  const update = () => {
    raf = 0;
    items.forEach((it) => {
      const r = it.el.getBoundingClientRect();
      const inside = mx > r.left - RADIUS && mx < r.right + RADIUS && my > r.top - RADIUS && my < r.bottom + RADIUS;
      if (inside) {
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        it.on = true;
        it.x(dx * STRENGTH);
        it.y(dy * STRENGTH);
        it.ix?.(dx * STRENGTH * 0.35);
        it.iy?.(dy * STRENGTH * 0.35);
      } else if (it.on) {
        it.on = false;
        it.x(0);
        it.y(0);
        it.ix?.(0);
        it.iy?.(0);
      }
    });
  };
  const move = (e: PointerEvent) => {
    mx = e.clientX;
    my = e.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('pointermove', move, { passive: true });
  return () => {
    window.removeEventListener('pointermove', move);
    cancelAnimationFrame(raf);
    items.forEach((it) => gsap.set([it.el, it.el.querySelector('.btn__label, svg')].filter(Boolean), { clearProps: 'transform' }));
  };
}
