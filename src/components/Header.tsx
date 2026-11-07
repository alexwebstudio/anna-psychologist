'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { onIntroDone } from '@/lib/intro';
import { NAV, PHONE, PHONE_HREF } from '@/data/content';
import { ButtonLink } from './ui';

export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  // на главной якоря обрабатывает Lenis (обычные <a>), на внутренних страницах — переход на главную
  const to = (hash: string) => (isHome ? hash : `/${hash}`);
  const NavLink = isHome ? 'a' : Link;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

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

  // «Капля»: при скролле стеклянное меню отрывается от верха страницы — тянется перемычкой,
  // отрывается и пружинит; при возврате наверх снова прилипает к краю.
  const detached = scrolled || open;
  const dropRef = useRef<{ tl: gsap.core.Timeline; attach: () => void; detach: () => void } | null>(null);

  useGSAP(
    () => {
      const header = ref.current!;
      const neck = header.querySelector<HTMLElement>('.header__neck')!;
      const reduced = prefersReducedMotion();
      // ширина считается по видимой области без полосы прокрутки — меню никогда не выходит за края
      const width = () => {
        const vw = document.documentElement.clientWidth;
        return Math.min(1240, vw - (vw < 720 ? 16 : 32));
      };
      gsap.set(header, { xPercent: -50, x: 0 });
      let attachTween: gsap.core.Tween | undefined;

      const tl = gsap
        .timeline({ paused: true })
        .to(header, { width, top: 12, borderRadius: 24, duration: 0.55, ease: 'power3.inOut' }, 0)
        .fromTo(neck, { width: '26%', height: 0, autoAlpha: 1 }, { height: 13, duration: 0.55, ease: 'power3.inOut' }, 0)
        .to(neck, { width: 0, height: 0, autoAlpha: 0, duration: 0.32, ease: 'power2.in' }, 0.5)
        .to(header, { scaleY: 0.9, scaleX: 1.015, duration: 0.14, ease: 'power2.out' }, 0.52)
        .to(header, { scaleY: 1, scaleX: 1, duration: 1, ease: 'elastic.out(1, 0.32)' }, 0.66);

      const detach = () => {
        attachTween?.kill(); // иначе «прилипание» продолжает тянуть ширину к 100% параллельно с отрывом
        if (reduced) {
          gsap.set(header, { width, top: 12, borderRadius: 24 });
          return;
        }
        tl.invalidate().restart();
      };
      const attach = () => {
        tl.pause();
        attachTween?.kill();
        gsap.set(neck, { autoAlpha: 0, width: 0, height: 0 });
        attachTween = gsap.to(header, {
          width: '100%',
          top: 0,
          borderRadius: 0,
          scaleX: 1,
          scaleY: 1,
          duration: reduced ? 0 : 0.5,
          ease: 'power3.out',
        });
      };
      dropRef.current = { tl, attach, detach };

      const onResize = () => {
        if (header.classList.contains('is-scrolled')) {
          tl.progress(1).pause();
          gsap.set(header, { width, scaleX: 1, scaleY: 1 });
        } else {
          attachTween?.progress(1);
          gsap.set(header, { width: '100%' });
        }
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
    { scope: ref },
  );

  const wasDetached = useRef(false);
  useEffect(() => {
    if (!dropRef.current || detached === wasDetached.current) return;
    wasDetached.current = detached;
    if (detached) dropRef.current.detach();
    else dropRef.current.attach();
  }, [detached]);

  const close = () => setOpen(false);

  return (
    <header ref={ref} className={`header${detached ? ' is-scrolled' : ''}`}>
      <span className="header__neck" aria-hidden="true" />
      <div className="header__inner">
        <NavLink href={isHome ? '#top' : '/'} className="logo" data-intro aria-label="Анна Соколова — на главную">
          Анна Соколова
        </NavLink>

        <nav className={`nav${open ? ' is-open' : ''}`} id="nav" aria-label="Основное меню">
          <ul className="nav__list">
            {NAV.map((item) => (
              <li key={item.href} data-intro>
                <NavLink href={to(item.href)} className="nav__link" onClick={close}>
                  <span className="nav__link-text" data-text={item.label}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="nav__mobile-extra">
            <a href={PHONE_HREF} className="nav__phone">
              {PHONE}
            </a>
            <ButtonLink quiz arrow={false} className="btn--sm" onClick={close}>
              Записаться
            </ButtonLink>
          </div>
        </nav>

        <div className="header__actions">
          <a href={PHONE_HREF} className="header__phone" data-intro>
            {PHONE}
          </a>
          <span data-intro className="header__cta">
            <ButtonLink quiz arrow={false} className="btn--sm">
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
