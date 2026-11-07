'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, hasFinePointer, prefersReducedMotion } from '@/lib/gsap';
import { SERVICES } from '@/data/content';
import { useLenis, scrollToTarget } from './SmoothScroll';
import ServiceIcon from './ServiceIcon';
import { Arrow } from './ui';

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.card');

      // AW-Flow · Border Draw — SVG-рамка точно повторяет скругление карточки
      const ro = new ResizeObserver((entries) => {
        entries.forEach(({ target }) => {
          const rect = target.querySelector('.card__border rect');
          const el = target as HTMLElement;
          rect?.setAttribute('width', String(el.offsetWidth - 1.5));
          rect?.setAttribute('height', String(el.offsetHeight - 1.5));
        });
      });
      cards.forEach((c) => ro.observe(c));

      if (prefersReducedMotion()) return () => ro.disconnect();

      // линейные иконки прорисовываются при появлении
      cards.forEach((card) => {
        const strokes = card.querySelectorAll<SVGGeometryElement>('.card__icon :is(circle, path, rect):not(.accent-fill):not(.dot-fill)');
        strokes.forEach((s) => s.setAttribute('pathLength', '1'));
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: 'top 82%', once: true } })
          .fromTo(strokes, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 0.25)
          .from(card.querySelectorAll('.accent-fill, .dot-fill'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)' }, 1.1);
      });

      // AW-Flow · Spotlight — мягкое световое пятно за курсором
      if (!hasFinePointer()) return () => ro.disconnect();
      const cleanups = cards.map((card) => {
        const spot = card.querySelector<HTMLElement>('.card__spot')!;
        const qx = gsap.quickTo(spot, 'x', { duration: 0.45, ease: 'power3.out' });
        const qy = gsap.quickTo(spot, 'y', { duration: 0.45, ease: 'power3.out' });
        let first = true;
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          if (first) {
            gsap.set(spot, { x, y });
            first = false;
          }
          qx(x);
          qy(y);
        };
        const enter = () => card.classList.add('is-lit');
        const leave = () => {
          card.classList.remove('is-lit');
          first = true;
        };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerenter', enter);
        card.addEventListener('pointerleave', leave);
        return () => {
          card.removeEventListener('pointermove', move);
          card.removeEventListener('pointerenter', enter);
          card.removeEventListener('pointerleave', leave);
        };
      });

      return () => {
        ro.disconnect();
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: ref },
  );

  const open = (i: number) => {
    setActive(i);
    const d = dialogRef.current;
    if (!d) return;
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
    lenis?.stop();
  };

  const close = () => {
    const d = dialogRef.current;
    if (!d) return;
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  };

  const s = SERVICES[active];

  return (
    <section className="services section" id="services" ref={ref} aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-fx="fade">
              С чем я работаю
            </p>
            {/* AW-Flow · Mask Reveal */}
            <h2 className="display services__title" id="services-title" data-fx="mask">
              Помогу разобраться даже в&nbsp;самых запутанных ситуациях
            </h2>
          </div>
          <p className="section-head__text" data-fx="fade" data-delay="0.2">
            Работаю со&nbsp;взрослыми в&nbsp;онлайн-формате. Выберите направление — или&nbsp;просто приходите с&nbsp;тем, что
            беспокоит: разберёмся вместе.
          </p>
        </div>

        {/* AW-Flow · Stagger Grid */}
        <div className="cards">
          {SERVICES.map((item, i) => (
            <div className="card-wrap" data-fx="batch" key={item.title}>
              <article className="card">
                <span className="card__spot" aria-hidden="true" />
                <svg className="card__border" aria-hidden="true">
                  <rect x="0.75" y="0.75" rx="15.25" pathLength="1" />
                </svg>
                <div className="card__top">
                  <span className="card__num">0{i + 1}</span>
                  <h3 className="card__title">{item.title}</h3>
                </div>
                <ServiceIcon name={item.icon} />
                <p className="card__text">{item.text}</p>
                <button className="card__link" onClick={() => open(i)} aria-haspopup="dialog">
                  Подробнее <span aria-hidden="true">→</span>
                </button>
              </article>
            </div>
          ))}
        </div>
      </div>

      <dialog
        className="modal"
        ref={dialogRef}
        aria-labelledby="modal-title"
        data-lenis-prevent
        onClose={() => lenis?.start()}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="modal__inner">
          <button className="modal__close" aria-label="Закрыть" onClick={close}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <p className="eyebrow">Направление 0{active + 1}</p>
          <h3 className="display modal__title" id="modal-title">
            {s.title}
          </h3>
          <p className="modal__lead">{s.lead}</p>
          <p className="modal__subtitle">С какими запросами приходят</p>
          <ul className="modal__list">
            {s.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <a
            href="#contact"
            className="btn btn--dark modal__cta"
            onClick={(e) => {
              e.preventDefault();
              close();
              lenis?.start();
              scrollToTarget(lenis, '#contact');
            }}
          >
            <span className="btn__label">Записаться на консультацию</span>
            <span className="btn__arrow">
              <Arrow />
            </span>
          </a>
        </div>
      </dialog>
    </section>
  );
}
