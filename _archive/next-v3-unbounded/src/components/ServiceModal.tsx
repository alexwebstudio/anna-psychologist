'use client';

import { useEffect, useRef, useState } from 'react';
import { SERVICES } from '@/data/content';
import { useLenis, HEADER_OFFSET } from './SmoothScroll';

/** Окно «Подробнее». Открывается кнопками [data-service] из серверных карточек. */
export default function ServiceModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>('[data-service]');
      if (!btn) return;
      setIndex(Number(btn.dataset.service));
      ref.current?.showModal();
      lenisRef.current?.stop();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const close = () => ref.current?.close();
  const s = SERVICES[index];

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      data-lenis-prevent
      onClose={() => lenis?.start()}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <button className="modal__close" aria-label="Закрыть" onClick={close}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3 3 10 10M13 3 3 13" />
        </svg>
      </button>
      <h3 className="modal__title" id="modal-title">
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
        className="btn btn--dark btn--lg modal__cta"
        onClick={(e) => {
          e.preventDefault();
          close();
          const target = document.getElementById('contact');
          if (!target) return;
          if (lenis) {
            lenis.start();
            lenis.scrollTo(target, { offset: HEADER_OFFSET });
          } else target.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="btn__text">Записаться на консультацию</span>
        <svg className="btn__icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
    </dialog>
  );
}
