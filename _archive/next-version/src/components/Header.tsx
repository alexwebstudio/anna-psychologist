'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { onIntroDone } from '@/lib/intro';
import { NAV, PHONE, PHONE_HREF } from '@/data/content';
import { ButtonLink } from './ui';

export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  // появление хедера после прелоадера
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-intro]');
      gsap.set(items, { yPercent: -120, autoAlpha: 0 });
      return onIntroDone(() =>
        gsap.to(items, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.07, ease: 'expo.out', delay: 0.55 }),
      );
    },
    { scope: ref },
  );

  const close = () => setOpen(false);

  return (
    <header ref={ref} className={`header${scrolled || open ? ' is-scrolled' : ''}`}>
      <div className="header__inner">
        <a href="#top" className="logo" data-intro aria-label="Анна Соколова — на главную">
          Анна Соколова
        </a>

        <nav className={`nav${open ? ' is-open' : ''}`} id="nav" aria-label="Основное меню">
          <ul className="nav__list">
            {NAV.map((item) => (
              <li key={item.href} data-intro>
                <a href={item.href} className="nav__link" onClick={close}>
                  <span className="nav__link-text" data-text={item.label}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__mobile-extra">
            <a href={PHONE_HREF} className="nav__phone">
              {PHONE}
            </a>
            <ButtonLink href="#contact" arrow={false} className="btn--sm" onClick={close}>
              Записаться
            </ButtonLink>
          </div>
        </nav>

        <div className="header__actions">
          <a href={PHONE_HREF} className="header__phone" data-intro>
            {PHONE}
          </a>
          <span data-intro className="header__cta">
            <ButtonLink href="#contact" arrow={false} className="btn--sm">
              Записаться
            </ButtonLink>
          </span>
          <button
            className="burger"
            data-intro
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            aria-controls="nav"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
