'use client';

import { useEffect } from 'react';

/**
 * AW-Flow · Blur Reveal (.awf-text-blur) и Blur In (.awf-blur-in).
 * Чистый JS: текст делится на слова, запуск — IntersectionObserver.
 * Параметры задаются CSS-переменными (см. globals.css), задержка — style={{ '--awf-delay': '200ms' }}.
 * Вешать классы только на элементы серверных компонентов: React не должен перерисовывать разбитый текст.
 */

const TEXT = 'awf-text-blur';
const BLOCK = 'awf-blur-in';

function splitWords(el: HTMLElement) {
  const parts: HTMLElement[] = [];
  (function walk(node: Node) {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) {
        if ((n as Element).tagName !== 'BR') walk(n);
        return;
      }
      if (n.nodeType !== Node.TEXT_NODE || !n.textContent?.trim()) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        const w = document.createElement('span');
        w.className = 'awf-w awf-p';
        w.textContent = chunk;
        parts.push(w);
        frag.appendChild(w);
      });
      node.replaceChild(frag, n);
    });
  })(el);
  parts.forEach((p, i) => p.style.setProperty('--i', String(i)));
}

export default function AwfEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll<HTMLElement>(`.${TEXT}:not([data-awf-split])`).forEach((el) => {
      el.setAttribute('data-awf-split', '');
      splitWords(el);
    });

    const els = Array.from(document.querySelectorAll<HTMLElement>(`.${TEXT}, .${BLOCK}`)).filter(
      (el) => !el.classList.contains('awf-in'),
    );
    els.forEach((el) => el.classList.add('awf-ready'));

    const play = (el: Element) => el.classList.add('awf-in');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(play);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          play(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.2 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
