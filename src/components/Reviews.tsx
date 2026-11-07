'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { REVIEWS } from '@/data/content';
import { Arrow } from './ui';

/**
 * Отзывы — горизонтальная лента карточек на тёплом фоне.
 * Листается стрелками, свайпом, колёсиком/тачпадом по горизонтали и перетаскиванием мышью.
 */
export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setProgress(max > 0 ? t.scrollLeft / max : 0);
    setEdges({ start: t.scrollLeft <= 4, end: t.scrollLeft >= max - 4 });
  }, []);

  const scrollByCard = (dir: number) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>('.review-card');
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(t).columnGap || '0') : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  // перетаскивание мышью на десктопе
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    update();
    let drag: { x: number; left: number; moved: boolean } | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: t.scrollLeft, moved: false };
      t.classList.add('is-grabbing');
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      t.scrollLeft = drag.left - dx;
    };
    const up = () => {
      drag = null;
      t.classList.remove('is-grabbing');
    };
    t.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    t.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      t.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      t.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  return (
    <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
      <div className="container reviews__head">
        <div>
          <p className="eyebrow" data-fx="fade">
            <span className="dot" />
            Отзывы клиентов
          </p>
          <h2 className="display reviews__title" id="reviews-title" data-fx="fade">
            Что говорят после наших встреч
          </h2>
        </div>
        <div className="reviews__nav" data-fx="fade" data-delay="0.15">
          <div className="reviews__bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${0.18 + progress * 0.82})` }} />
          </div>
          <div className="reviews__arrows">
            <button className="round-btn" aria-label="Предыдущие отзывы" onClick={() => scrollByCard(-1)} disabled={edges.start}>
              <Arrow dir="left" />
            </button>
            <button className="round-btn" aria-label="Следующие отзывы" onClick={() => scrollByCard(1)} disabled={edges.end}>
              <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div className="reviews__track" ref={trackRef} role="list" aria-label="Отзывы">
        {REVIEWS.map((r, i) => (
          <div className="review-wrap" role="listitem" data-fx="batch" key={r.name + r.age}>
            <figure className={`review-card${i % 3 === 1 ? ' review-card--dark' : ''}`}>
              <div className="review-card__top">
                <span className="review-card__mark" aria-hidden="true">
                  “
                </span>
                <span className="review-card__topic">{r.topic}</span>
              </div>
              <blockquote className="review-card__text">{r.text}</blockquote>
              <figcaption className="review-card__author">
                <span className="review-card__avatar" aria-hidden="true">
                  {r.name[0]}
                </span>
                <span>
                  <strong>{r.name}</strong>
                  <span>{r.age}</span>
                </span>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
