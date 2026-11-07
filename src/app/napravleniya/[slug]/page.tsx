import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES, getService } from '@/data/content';
import ServiceCard from '@/components/ServiceCard';
import Cta from '@/components/Cta';
import Footer from '@/components/Footer';
import Effects from '@/components/Effects';
import { Arrow, ButtonLink } from '@/components/ui';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return {
    title: `${s.title} — Анна Соколова, клинический психолог`,
    description: s.lead,
  };
}

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="m5 10.5 3.2 3L15 6.5" />
  </svg>
);

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const index = SERVICES.indexOf(service);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <main className="page" id="top">
        {/* ---------- Шапка направления ---------- */}
        <section className="sp-hero container">
          <div className="sp-hero__text">
            <Link href="/#services" className="sp-back" data-fx="fade">
              <Arrow dir="left" />
              Все направления
            </Link>
            <p className="eyebrow" data-fx="fade">
              <span className="dot" />
              Направление 0{index + 1}
            </p>
            <h1 className="display sp-hero__title" data-fx="mask">
              {service.title}
            </h1>
            <p className="sp-hero__lead" data-fx="blur">
              {service.lead}
            </p>
            <div className="sp-hero__actions" data-fx="fade" data-delay="0.3">
              <ButtonLink quiz={service.slug}>Записаться на консультацию</ButtonLink>
              <ul className="sp-hero__meta">
                <li>Онлайн</li>
                <li>50 минут</li>
                <li>Конфиденциально</li>
              </ul>
            </div>
          </div>
          <figure className="sp-hero__photo" data-fx="wipe">
            <div className="sp-hero__photo-inner" data-wipe-inner>
              <Image src={service.photo} alt={service.photoAlt} fill priority sizes="(max-width: 1024px) 90vw, 45vw" />
            </div>
          </figure>
        </section>

        {/* ---------- О направлении ---------- */}
        <section className="sp-about section container">
          <p className="eyebrow" data-fx="fade">
            О направлении
          </p>
          <div className="sp-about__text">
            {service.about.map((p, i) => (
              <p key={i} data-fx="blur">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* ---------- С чем приходят ---------- */}
        <section className="sp-requests section container">
          <div className="sp-head">
            <h2 className="display sp-title" data-fx="mask">
              С чем приходят
            </h2>
            <p className="sp-head__text" data-fx="fade">
              Узнаёте себя хотя бы в одном пункте? Это уже достаточный повод прийти на знакомство.
            </p>
          </div>
          <ul className="sp-requests__grid">
            {service.requests.map((r, i) => (
              <li className="sp-request" data-fx="batch" key={r.title}>
                <span className="sp-request__num">0{i + 1}</span>
                <h3 className="sp-request__title">{r.title}</h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Как будем работать ---------- */}
        <section className="sp-process section">
          <div className="container">
            <div className="sp-head">
              <h2 className="display sp-title" data-fx="mask">
                Как мы будем работать
              </h2>
              <p className="sp-head__text" data-fx="fade">
                Каждая встреча длится 50 минут. Темп и частоту выбираем вместе, обычно это раз в неделю.
              </p>
            </div>
            <ol className="sp-process__grid">
              {service.process.map((p, i) => (
                <li className="sp-step" data-fx="batch" key={p.title}>
                  <span className="sp-step__num">0{i + 1}</span>
                  <h3 className="sp-step__title">{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Что может измениться ---------- */}
        <section className="sp-outcomes section container">
          <div className={`sp-outcomes__panel theme--${service.theme}`}>
            <div className="sp-outcomes__head">
              <h2 className="display sp-title" data-fx="mask">
                Что может измениться
              </h2>
              <div data-fx="fade">
                <ButtonLink quiz={service.slug} variant={service.theme === 'night' ? 'sand' : 'dark'}>
                  Хочу так же
                </ButtonLink>
              </div>
            </div>
            <ul className="sp-outcomes__grid">
              {service.outcomes.map((o) => (
                <li className="sp-outcome" key={o.title} data-fx="batch">
                  <span className="sp-outcome__icon">
                    <Check />
                  </span>
                  <h3>{o.title}</h3>
                  <p>{o.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Слово психолога ---------- */}
        <section className="sp-quote section container">
          <figure className="sp-quote__inner">
            <blockquote className="sp-quote__text" data-fx="blur">
              «{service.quote}»
            </blockquote>
            <figcaption className="sp-quote__author" data-fx="fade">
              <span className="sp-quote__avatar">
                <Image src="/img/anna-about.jpg" alt="" fill sizes="64px" />
              </span>
              <span>
                <strong>Анна Соколова</strong>
                <br />
                клинический психолог
              </span>
            </figcaption>
          </figure>
        </section>

        {/* ---------- Вопросы ---------- */}
        <section className="sp-faq section container">
          <div className="sp-faq__grid">
            <div>
              <h2 className="display sp-title" data-fx="mask">
                Частые вопросы
              </h2>
              <p className="sp-head__text" data-fx="fade">
                Не нашли ответ? Задайте вопрос на первой встрече или напишите мне.
              </p>
            </div>
            <div className="sp-faq__list">
              {service.faq.map((f, i) => (
                <details className="faq" key={f.q} data-fx="batch" {...(i === 0 ? { open: true } : {})}>
                  <summary>
                    {f.q}
                    <span className="faq__icon" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Cta />

        {/* ---------- Другие направления ---------- */}
        <section className="sp-others section container">
          <h2 className="display sp-title" data-fx="mask">
            Другие направления
          </h2>
          <div className="cards cards--three">
            {others.map((s) => (
              <ServiceCard key={s.slug} service={s} index={SERVICES.indexOf(s)} compact />
            ))}
          </div>
        </section>

        <Footer />
      </main>
      <Effects />
    </>
  );
}
