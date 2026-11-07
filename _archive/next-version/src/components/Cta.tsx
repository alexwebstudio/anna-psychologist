import { PHONE, PHONE_HREF, TELEGRAM_URL } from '@/data/content';
import { ButtonLink } from './ui';

export default function Cta() {
  return (
    <section className="cta" id="contact" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta__card">
          {/* AW-Flow · Floating Blobs */}
          <div className="cta__blobs" aria-hidden="true">
            <span className="blob blob--1" data-blob />
            <span className="blob blob--2" data-blob />
            <span className="blob blob--3" data-blob />
          </div>
          <svg className="cta__ornament cta__ornament--l" viewBox="0 0 200 200" aria-hidden="true" data-spin="1">
            <circle cx="100" cy="100" r="98" />
            <circle cx="100" cy="100" r="66" />
            <circle cx="100" cy="100" r="34" />
          </svg>
          <svg className="cta__ornament cta__ornament--r" viewBox="0 0 200 200" aria-hidden="true" data-spin="-1">
            <rect x="30" y="30" width="140" height="140" />
            <rect x="30" y="30" width="140" height="140" transform="rotate(45 100 100)" />
          </svg>

          <p className="eyebrow eyebrow--light" data-fx="fade">
            <span className="dot" />
            Первый шаг к переменам
          </p>
          <h2 className="display cta__title" id="cta-title" data-fx="mask">
            Сделайте первый шаг <span>уже сегодня</span>
          </h2>
          <p className="cta__text" data-fx="fade" data-delay="0.3">
            На&nbsp;первой встрече познакомимся, обсудим ваш запрос и&nbsp;решим, как&nbsp;двигаться дальше. Без&nbsp;обязательств.
          </p>
          <div className="cta__actions" data-fx="fade" data-delay="0.45">
            <ButtonLink href={TELEGRAM_URL} variant="sand" external>
              Записаться
            </ButtonLink>
            <ButtonLink href={PHONE_HREF} variant="ghost-light" arrow={false}>
              {PHONE}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
