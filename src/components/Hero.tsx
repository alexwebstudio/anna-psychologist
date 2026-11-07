'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import Image from 'next/image';
import { onIntroDone } from '@/lib/intro';
import { ButtonLink } from './ui';

/** Подгоняет размер имени точно под ширину контейнера (ширина текста растёт не строго линейно). */
function fitToWidth(h1: HTMLElement, text: HTMLElement) {
  const target = h1.clientWidth - parseFloat(getComputedStyle(h1).paddingLeft) * 2;
  let size = 100;
  for (let i = 0; i < 4; i++) {
    h1.style.fontSize = `${size}px`;
    const w = text.getBoundingClientRect().width;
    if (!w) return;
    size *= target / w;
  }
  h1.style.fontSize = `${(size * 0.995).toFixed(2)}px`;
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const h1 = root.querySelector<HTMLElement>('.hero__name')!;
      const text = h1.querySelector<HTMLElement>('.hero__name-text')!;
      const reduced = prefersReducedMotion();

      // AW-Flow · Split Stagger — имя делится на буквы
      const split = SplitText.create(text, { type: 'chars', charsClass: 'hero__char' });

      fitToWidth(h1, text);
      let last = h1.clientWidth;
      const ro = new ResizeObserver(() => {
        if (h1.clientWidth === last) return;
        last = h1.clientWidth;
        fitToWidth(h1, text);
        ScrollTrigger.refresh();
      });
      ro.observe(h1);
      document.fonts?.ready.then(() => {
        fitToWidth(h1, text);
        ScrollTrigger.refresh();
      });

      // герой скрыт в CSS до этого момента — без вспышки до гидрации
      gsap.set(root, { visibility: 'visible' });

      if (reduced) return () => ro.disconnect();

      // порядок: сначала фото Анны, затем имя, затем текст — чтобы первый экран не выглядел пустым
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      tl.from('.hero__person', { yPercent: 6, scale: 1.03, autoAlpha: 0, duration: 1.2, ease: 'power3.out' }, 0)
        .from(
          split.chars,
          {
            yPercent: 118,
            rotate: 7,
            transformOrigin: '0% 100%',
            duration: 1.3,
            stagger: 0.045,
          },
          0.45,
        )
        .from('[data-hero-fade]', { y: 34, autoAlpha: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out' }, 1);

      // старт — когда прелоадер начинает уезжать
      const off = onIntroDone(() => tl.play());

      // мягкий параллакс при скролле
      const st = { trigger: root, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(h1, { yPercent: 22, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__person', { y: -36, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__left, .hero__right', { y: -40, ease: 'none', scrollTrigger: st });

      return () => {
        off();
        ro.disconnect();
      };
    },
    { scope: ref },
  );

  return (
    <section className="hero container" ref={ref} aria-labelledby="hero-title">
      <h1 className="hero__name" id="hero-title" aria-label="Анна Соколова">
        <span className="hero__name-text" aria-hidden="true">
          Анна Соколова
        </span>
      </h1>

      <div className="hero__stage">
        <div className="hero__left">
          <p className="hero__signature" data-hero-fade>
            Анна Соколова, клинический психолог
          </p>
          <div className="hero__left-bottom">
            <p className="hero__subtitle" data-hero-fade>
              Психологическая поддержка для тех, кто готов к&nbsp;переменам
            </p>
            <div data-hero-fade>
              <ButtonLink quiz>
                Записаться на консультацию
              </ButtonLink>
            </div>
          </div>
        </div>

        <figure className="hero__card">
          {/* фото без фона стоит прямо на фоне страницы */}
          <div className="hero__person">
            <Image
              src="/img/anna-hero.webp"
              alt="Анна Соколова, клинический психолог"
              fill
              priority
              sizes="(max-width: 720px) 90vw, 32vw"
            />
          </div>
        </figure>

        <div className="hero__right">
          <p className="hero__quote" data-hero-fade>
            Бережно. Без&nbsp;осуждения.
            <br />
            В&nbsp;вашем темпе.
          </p>
          <ul className="hero__facts">
            <li data-hero-fade>Онлайн из любой точки мира</li>
            <li data-hero-fade>Сессия — 50 минут</li>
            <li data-hero-fade>Полная конфиденциальность</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
