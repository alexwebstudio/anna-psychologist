'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { QUIZ, TELEGRAM_URL, type QuizOption } from '@/data/content';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useLenis } from './SmoothScroll';
import { Arrow } from './ui';

type Answers = {
  topics: string[];
  duration: string;
  experience: string;
  format: string;
  time: string[];
  name: string;
  contact: string;
  messenger: string;
  consent: boolean;
};

const EMPTY: Answers = {
  topics: [],
  duration: '',
  experience: '',
  format: '',
  time: [],
  name: '',
  contact: '',
  messenger: 'telegram',
  consent: false,
};

const STEPS = [
  { name: 'Запрос', title: 'Что вас беспокоит?', hint: 'Можно выбрать несколько вариантов' },
  { name: 'Длительность', title: 'Как давно это длится?', hint: 'Выберите один вариант' },
  { name: 'Опыт', title: 'Был ли у вас опыт работы с психологом?', hint: 'Выберите один вариант' },
  { name: 'Формат', title: 'Какой формат вам удобнее?', hint: 'Все встречи проходят онлайн' },
  { name: 'Время', title: 'Когда вам удобно встречаться?', hint: 'Можно выбрать несколько вариантов' },
  { name: 'Контакты', title: 'Как с вами связаться?', hint: 'Напишу, чтобы договориться о первой встрече' },
];

const label = (opts: QuizOption[], v: string) => opts.find((o) => o.value === v)?.label ?? v;
const contactOk = (v: string) => v.replace(/\D/g, '').length >= 10 || /^@?[a-zA-Z0-9_]{5,32}$/.test(v.trim());

/**
 * Квиз записи на консультацию. Открывается любой кнопкой с атрибутом data-quiz
 * (значение — направление, которое нужно отметить заранее).
 */
export default function QuizModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [touched, setTouched] = useState(false);
  const statusRef = useRef(status);
  statusRef.current = status;
  const suppressClick = useRef(false);
  const backdropDown = useRef(false);

  // открытие по клику на любую кнопку [data-quiz]
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-quiz]');
      if (!el) return;
      e.preventDefault();
      const topic = el.dataset.quiz;
      if (statusRef.current === 'done') {
        setA(EMPTY);
        setStep(0);
        setStatus('idle');
        setTouched(false);
      }
      if (topic) setA((prev) => (prev.topics.includes(topic) ? prev : { ...prev, topics: [...prev.topics, topic] }));
      if (ref.current) ref.current.style.translate = ''; // каждый раз открываем по центру
      ref.current?.showModal();
      lenisRef.current?.stop();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // на десктопе окно можно перетаскивать за верхнюю панель, не выходя за края экрана
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const canDrag = () => window.matchMedia('(min-width: 1025px) and (pointer: fine)').matches;
    const EDGE = 12;
    let drag: { id: number; sx: number; sy: number; ox: number; oy: number; rect: DOMRect; handle: Element; moved: boolean } | null =
      null;

    const current = () => {
      const [x = '0', y = '0'] = dialog.style.translate.split(' ');
      return { x: parseFloat(x) || 0, y: parseFloat(y) || 0 };
    };
    const onDown = (e: PointerEvent) => {
      const handle = (e.target as Element).closest('[data-drag-handle]');
      if (!handle || !canDrag() || e.button !== 0 || (e.target as Element).closest('button, a, input, label')) return;
      const { x, y } = current();
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: x, oy: y, rect: dialog.getBoundingClientRect(), handle, moved: false };
      // захват на ручке, а не на самом диалоге: иначе отпускание мыши считается кликом по фону и окно закрывается
      handle.setPointerCapture(e.pointerId);
      dialog.classList.add('is-dragging');
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 3) drag.moved = true;
      const { rect } = drag;
      const dx = Math.min(Math.max(e.clientX - drag.sx, EDGE - rect.left), window.innerWidth - EDGE - rect.right);
      const dy = Math.min(Math.max(e.clientY - drag.sy, EDGE - rect.top), window.innerHeight - EDGE - rect.bottom);
      dialog.style.translate = `${drag.ox + dx}px ${drag.oy + dy}px`;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        // гасим «клик», который браузер шлёт сразу после перетаскивания
        suppressClick.current = true;
        window.setTimeout(() => (suppressClick.current = false), 0);
      }
      if (drag.handle.hasPointerCapture(e.pointerId)) drag.handle.releasePointerCapture(e.pointerId);
      drag = null;
      dialog.classList.remove('is-dragging');
    };
    // при ресайзе окна возвращаем в центр, чтобы не потерять его за краем
    const onResize = () => {
      dialog.style.translate = '';
    };

    dialog.addEventListener('pointerdown', onDown);
    dialog.addEventListener('pointermove', onMove);
    dialog.addEventListener('pointerup', onUp);
    dialog.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      dialog.removeEventListener('pointerdown', onDown);
      dialog.removeEventListener('pointermove', onMove);
      dialog.removeEventListener('pointerup', onUp);
      dialog.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // плавная смена шага
  useEffect(() => {
    const el = bodyRef.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 18, filter: 'blur(8px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out', clearProps: 'filter,transform' },
    );
    return () => {
      tween.kill();
    };
  }, [step, status]);

  const close = () => ref.current?.close();
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => setA((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: 'topics' | 'time', value: string) =>
    setA((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  const pick = (key: 'duration' | 'experience' | 'format', value: string) => {
    set(key, value);
    window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 260); // одиночный выбор — сразу дальше
  };

  const contactsValid = a.name.trim().length >= 2 && contactOk(a.contact) && a.consent;
  const canNext = [
    a.topics.length > 0,
    !!a.duration,
    !!a.experience,
    !!a.format,
    a.time.length > 0,
    contactsValid,
  ][step];

  const submit = async () => {
    setTouched(true);
    if (!contactsValid) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: a.topics.map((t) => label(QUIZ.topics, t)),
          duration: label(QUIZ.duration, a.duration),
          experience: label(QUIZ.experience, a.experience),
          format: label(QUIZ.format, a.format),
          time: a.time.map((t) => label(QUIZ.time, t)),
          name: a.name.trim(),
          contact: a.contact.trim(),
          messenger: label(QUIZ.messenger, a.messenger),
          consent: a.consent,
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const next = () => (step === STEPS.length - 1 ? submit() : canNext && setStep(step + 1));
  const progress = status === 'done' ? 1 : (step + 1) / STEPS.length;

  const Option = ({ o, selected, onClick, multi }: { o: QuizOption; selected: boolean; onClick: () => void; multi?: boolean }) => (
    <button type="button" className={`quiz-opt${selected ? ' is-selected' : ''}`} onClick={onClick} aria-pressed={selected}>
      <span className={`quiz-opt__check${multi ? ' quiz-opt__check--box' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
      </span>
      <span className="quiz-opt__label">
        {o.label}
        {o.hint && <span className="quiz-opt__hint">{o.hint}</span>}
      </span>
    </button>
  );

  return (
    <dialog
      ref={ref}
      className="quiz"
      aria-labelledby="quiz-title"
      data-lenis-prevent
      onClose={() => lenisRef.current?.start()}
      // закрытие по фону — только если и нажали, и отпустили на самом фоне, и это не конец перетаскивания
      onPointerDown={(e) => (backdropDown.current = e.target === e.currentTarget)}
      onClick={(e) => {
        const fromBackdrop = backdropDown.current && e.target === e.currentTarget;
        backdropDown.current = false;
        if (suppressClick.current || !fromBackdrop) return;
        close();
      }}
    >
      <div className="quiz__panel">
        <aside className="quiz__aside" data-drag-handle>
          <div className="quiz__aside-blob" aria-hidden="true" />
          <div className="quiz__aside-text">
            <p className="eyebrow eyebrow--light">Запись на консультацию</p>
            <p className="quiz__aside-title">
              Первый шаг
              <br />
              самый важный
            </p>
            <ol className="quiz__steps">
              {STEPS.map((s, i) => (
                <li
                  key={s.name}
                  className={status === 'done' || i < step ? 'is-done' : i === step ? 'is-current' : ''}
                >
                  <span className="quiz__steps-dot" aria-hidden="true" />
                  {s.name}
                </li>
              ))}
            </ol>
          </div>
          <div className="quiz__photo">
            <Image src="/img/anna-hero.webp" alt="" fill sizes="320px" />
          </div>
        </aside>

        <div className="quiz__main">
          <div className="quiz__head" data-drag-handle>
            <span className="quiz__counter">
              <span className="quiz__grip" aria-hidden="true" title="Окно можно перетащить" />
              {status === 'done' ? 'Заявка отправлена' : `Шаг ${step + 1} из ${STEPS.length}`}
            </span>
            <button type="button" className="quiz__close" onClick={close} aria-label="Закрыть">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m3 3 10 10M13 3 3 13" />
              </svg>
            </button>
          </div>
          <div className="quiz__progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>

          <div className="quiz__body" ref={bodyRef}>
            {status === 'done' ? (
              <div className="quiz__done">
                <span className="quiz__done-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path d="m9 16.5 5 5 9-11" />
                  </svg>
                </span>
                <h2 className="quiz__title" id="quiz-title">
                  Спасибо, {a.name.trim()}!
                </h2>
                <p className="quiz__text">
                  Заявка отправлена. Я свяжусь с&nbsp;вами ({label(QUIZ.messenger, a.messenger)}), чтобы договориться о&nbsp;времени
                  первой встречи.
                </p>
                <button type="button" className="btn btn--dark" onClick={close}>
                  <span className="btn__label">Закрыть</span>
                </button>
              </div>
            ) : (
              <>
                <h2 className="quiz__title" id="quiz-title">
                  {STEPS[step].title}
                </h2>
                <p className="quiz__hint">{STEPS[step].hint}</p>

                {step === 0 && (
                  <div className="quiz__options">
                    {QUIZ.topics.map((o) => (
                      <Option key={o.value} o={o} multi selected={a.topics.includes(o.value)} onClick={() => toggle('topics', o.value)} />
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div className="quiz__options">
                    {QUIZ.duration.map((o) => (
                      <Option key={o.value} o={o} selected={a.duration === o.value} onClick={() => pick('duration', o.value)} />
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="quiz__options quiz__options--one">
                    {QUIZ.experience.map((o) => (
                      <Option key={o.value} o={o} selected={a.experience === o.value} onClick={() => pick('experience', o.value)} />
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div className="quiz__options quiz__options--one">
                    {QUIZ.format.map((o) => (
                      <Option key={o.value} o={o} selected={a.format === o.value} onClick={() => pick('format', o.value)} />
                    ))}
                  </div>
                )}
                {step === 4 && (
                  <div className="quiz__options">
                    {QUIZ.time.map((o) => (
                      <Option key={o.value} o={o} multi selected={a.time.includes(o.value)} onClick={() => toggle('time', o.value)} />
                    ))}
                  </div>
                )}
                {step === 5 && (
                  <form
                    className="quiz__form"
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      submit();
                    }}
                  >
                    <label className="quiz-field">
                      <span>Имя</span>
                      <input
                        type="text"
                        autoComplete="given-name"
                        value={a.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="Как к вам обращаться"
                        aria-invalid={touched && a.name.trim().length < 2}
                      />
                      {touched && a.name.trim().length < 2 && <em>Напишите, как к вам обращаться</em>}
                    </label>
                    <label className="quiz-field">
                      <span>Телефон или ник в Telegram</span>
                      <input
                        type="text"
                        inputMode="text"
                        autoComplete="tel"
                        value={a.contact}
                        onChange={(e) => set('contact', e.target.value)}
                        placeholder="+7 900 000 00 00 или @username"
                        aria-invalid={touched && !contactOk(a.contact)}
                      />
                      {touched && !contactOk(a.contact) && <em>Укажите телефон или ник в Telegram</em>}
                    </label>
                    <div className="quiz-field">
                      <span>Где удобнее связаться</span>
                      <div className="quiz-chips">
                        {QUIZ.messenger.map((o) => (
                          <button
                            type="button"
                            key={o.value}
                            className={`quiz-chip${a.messenger === o.value ? ' is-selected' : ''}`}
                            aria-pressed={a.messenger === o.value}
                            onClick={() => set('messenger', o.value)}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className={`quiz-consent${touched && !a.consent ? ' is-invalid' : ''}`}>
                      <input type="checkbox" checked={a.consent} onChange={(e) => set('consent', e.target.checked)} />
                      <span className="quiz-consent__box" aria-hidden="true">
                        <svg viewBox="0 0 16 16">
                          <path d="m3.5 8.5 3 3 6-7" />
                        </svg>
                      </span>
                      Согласен(на) на&nbsp;обработку персональных данных
                    </label>
                    {status === 'error' && (
                      <p className="quiz__error" role="alert">
                        Не получилось отправить заявку. Попробуйте ещё раз или{' '}
                        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                          напишите в&nbsp;Telegram
                        </a>
                        .
                      </p>
                    )}
                  </form>
                )}
              </>
            )}
          </div>

          {status !== 'done' && (
            <div className="quiz__foot">
              {step > 0 ? (
                <button type="button" className="quiz__back" onClick={() => setStep(step - 1)}>
                  <Arrow dir="left" />
                  Назад
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                className="btn btn--dark"
                onClick={next}
                disabled={(step < STEPS.length - 1 && !canNext) || status === 'sending'}
              >
                <span className="btn__label">
                  {step === STEPS.length - 1 ? (status === 'sending' ? 'Отправляю…' : 'Отправить заявку') : 'Далее'}
                </span>
                <span className="btn__arrow">
                  <Arrow />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
