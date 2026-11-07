'use client';

import { useEffect, useRef, useState } from 'react';
import { NAV, PHONE, PHONE_HREF } from '@/data/content';
import { Button } from './ui';

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

  const close = () => setOpen(false);

  return (
    <header ref={ref} className={`header${scrolled || open ? ' is-solid' : ''}`}>
      <a href="#top" className="logo" onClick={close}>
        Анна Соколова
      </a>

      <nav className={`nav${open ? ' is-open' : ''}`} id="nav" aria-label="Основное меню">
        <ul className="nav__list">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={close}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav__mobile" onClick={close}>
          <a href={PHONE_HREF} className="nav__phone">
            {PHONE}
          </a>
          <Button href="#contact" size="sm" arrow={false}>
            Записаться
          </Button>
        </div>
      </nav>

      <div className="header__actions">
        <a href={PHONE_HREF} className="header__phone">
          {PHONE}
        </a>
        <Button href="#contact" size="sm" arrow={false} className="header__btn">
          Записаться
        </Button>
        <button
          className="burger"
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
    </header>
  );
}
