import { FIRST_STEPS, TELEGRAM_URL } from '@/data/content';
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

          <div className="cta__main">
            <p className="eyebrow eyebrow--light" data-fx="fade">
              <span className="dot" />
              Первый шаг к переменам
            </p>
            <h2 className="display cta__title" id="cta-title" data-fx="mask">
              Сделайте первый шаг <span>уже сегодня</span>
            </h2>
            <p className="cta__text" data-fx="fade" data-delay="0.3">
              Ответьте на несколько вопросов, и я свяжусь с&nbsp;вами, чтобы договориться о&nbsp;первой встрече.
            </p>
            <div className="cta__actions" data-fx="fade" data-delay="0.45">
              <ButtonLink quiz variant="sand">
                Записаться
              </ButtonLink>
              <ButtonLink href={TELEGRAM_URL} variant="ghost-light" arrow={false} external>
                Написать в Telegram
              </ButtonLink>
            </div>
          </div>

          <ol className="cta__steps">
            {FIRST_STEPS.map((s, i) => (
              <li className="cta__step" data-fx="batch" key={s.title}>
                <span className="cta__step-num">0{i + 1}</span>
                <div>
                  <h3 className="cta__step-title">{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
