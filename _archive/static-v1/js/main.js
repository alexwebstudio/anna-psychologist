(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Хедер: плотный белый на скролле ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Мобильное меню ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    if (open) header.classList.add('is-scrolled'); else onScroll();
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });

  /* ---------- Имя во всю ширину ---------- */
  const fitEl = document.querySelector('[data-fit]');
  const fitName = () => {
    if (!fitEl) return;
    const target = fitEl.parentElement.clientWidth;
    fitEl.style.fontSize = '100px';
    const w = fitEl.getBoundingClientRect().width;
    if (w > 0) fitEl.parentElement.style.fontSize = (100 * target / w * 0.995).toFixed(2) + 'px';
    fitEl.style.fontSize = '';
  };
  fitName();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);
  let raf;
  let lastW = 0;
  const scheduleFit = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitName);
  };
  if ('ResizeObserver' in window && fitEl) {
    new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w !== lastW) { lastW = w; scheduleFit(); }
    }).observe(fitEl.parentElement);
  } else {
    window.addEventListener('resize', scheduleFit);
  }

  /* ---------- Появление при скролле ---------- */
  document.querySelectorAll('.cards, .stats__grid, .about__facts').forEach((group) => {
    group.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', (i * 0.08) + 's'));
  });

  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const end = Number(el.dataset.count);
    if (reduceMotion) { el.textContent = end; return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        const counter = entry.target.querySelector('[data-count]');
        if (counter) animateCount(counter);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Отзывы ---------- */
  const reviews = Array.from(document.querySelectorAll('.review'));
  const dotsWrap = document.querySelector('.reviews__dots');
  let current = 0;
  let timer;

  const dots = reviews.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Отзыв ${i + 1}`);
    b.setAttribute('aria-selected', String(i === 0));
    b.addEventListener('click', () => { show(i); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });

  function show(i) {
    current = (i + reviews.length) % reviews.length;
    reviews.forEach((r, idx) => r.classList.toggle('is-active', idx === current));
    dots.forEach((d, idx) => d.setAttribute('aria-selected', String(idx === current)));
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => show(current + 1), 7000);
  }
  document.querySelectorAll('.reviews__arrows [data-dir]').forEach((btn) => {
    btn.addEventListener('click', () => { show(current + Number(btn.dataset.dir)); restart(); });
  });
  restart();

  /* ---------- Модальное окно «Подробнее» ---------- */
  const services = [
    {
      title: 'Тревога и стресс',
      lead: 'Разберёмся, откуда берётся тревога, научимся снижать напряжение и вернём ощущение контроля над своей жизнью.',
      items: ['Постоянное беспокойство и «накручивание»', 'Панические атаки', 'Проблемы со сном, хроническая усталость', 'Эмоциональное выгорание']
    },
    {
      title: 'Самооценка и уверенность',
      lead: 'Поможем внутреннему критику стать тише, а опоре на себя — крепче. Без «просто полюби себя», с конкретными шагами.',
      items: ['Страх ошибки и перфекционизм', 'Зависимость от чужого мнения', 'Трудно говорить «нет» и отстаивать себя', 'Ощущение «я недостаточно хорош(а)»']
    },
    {
      title: 'Отношения и близость',
      lead: 'Исследуем, что повторяется в ваших отношениях, и найдём способ быть рядом с другими, не теряя себя.',
      items: ['Конфликты и непонимание с партнёром', 'Одиночество, страх близости', 'Сложности с границами', 'Отношения с родителями']
    },
    {
      title: 'Поиск себя и смысла',
      lead: 'Когда прежние ориентиры перестают работать — это не тупик, а точка роста. Найдём, что действительно важно для вас.',
      items: ['Кризис, «всё есть, но радости нет»', 'Выбор профессии или смена пути', 'Переезд, развод и другие перемены', 'Вопрос «чего я на самом деле хочу»']
    }
  ];

  const modal = document.getElementById('service-modal');
  const mNum = document.getElementById('modal-num');
  const mTitle = document.getElementById('modal-title');
  const mLead = document.getElementById('modal-lead');
  const mList = document.getElementById('modal-list');

  document.querySelectorAll('[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.service);
      const s = services[i];
      mNum.textContent = `Направление 0${i + 1}`;
      mTitle.textContent = s.title;
      mLead.textContent = s.lead;
      mList.innerHTML = '';
      s.items.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        mList.appendChild(li);
      });
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    });
  });

  const closeModal = () => (typeof modal.close === 'function' ? modal.close() : modal.removeAttribute('open'));
  modal.querySelector('.modal__close').addEventListener('click', closeModal);
  modal.querySelector('.modal__cta').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
})();
