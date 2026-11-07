'use client';

import { useCallback, useEffect, useState } from 'react';
import { REVIEWS } from '@/data/content';
import { prefersReducedMotion } from '@/lib/gsap';
import { Arrow } from './ui';

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const [tick, setTick] = useState(0); // сброс автопрокрутки при ручном переключении

  const go = useCallback((i: number) => {
    setCurrent((i + REVIEWS.length) % REVIEWS.length);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % REVIEWS.length), 7000);
    return () => window.clearInterval(id);
  }, [tick]);

  return (
    <div className="reviews" id="reviews">
      <p className="eyebrow" data-fx="fade">
        Отзывы клиентов
      </p>
      <div className="reviews__body" data-fx="fade" data-delay="0.1">
        <span className="reviews__mark" aria-hidden="true">
          “
        </span>
        <div className="reviews__viewport" aria-live="polite">
          {REVIEWS.map((r, i) => (
            <blockquote className={`review${i === current ? ' is-active' : ''}`} key={r.author} aria-hidden={i !== current}>
              <p>{r.text}</p>
              <footer>{r.author}</footer>
            </blockquote>
          ))}
        </div>
        <div className="reviews__controls">
          <div className="reviews__dots" role="tablist" aria-label="Выбор отзыва">
            {REVIEWS.map((r, i) => (
              <button
                key={r.author}
                type="button"
                role="tab"
                aria-label={`Отзыв ${i + 1}`}
                aria-selected={i === current}
                onClick={() => go(i)}
              >
                <span className="reviews__progress" key={`${current}-${tick}`} />
              </button>
            ))}
          </div>
          <div className="reviews__arrows">
            <button className="round-btn" aria-label="Предыдущий отзыв" onClick={() => go(current - 1)} data-magnetic>
              <Arrow dir="left" />
            </button>
            <button className="round-btn" aria-label="Следующий отзыв" onClick={() => go(current + 1)} data-magnetic>
              <Arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
