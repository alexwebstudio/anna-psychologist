import { PRICES } from '@/data/content';
import { ButtonLink } from './ui';

/** Стоимость. Цены примерные — правятся в src/data/content.ts (PRICES). */
export default function Prices() {
  return (
    <section className="prices section" id="prices" aria-labelledby="prices-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-fx="fade">
              Стоимость
            </p>
            <h2 className="display prices__title" id="prices-title" data-fx="mask">
              Форматы и цены
            </h2>
          </div>
          <p className="section-head__text" data-fx="fade" data-delay="0.2">
            Все встречи проходят онлайн. Оплата перед сессией, перенести встречу можно не позднее чем за 24 часа.
          </p>
        </div>

        <div className="prices__grid">
          {PRICES.map((p) => (
            <article className={`price${p.featured ? ' price--featured' : ''}`} data-fx="batch" key={p.title}>
              {p.featured && <span className="price__badge">Чаще выбирают</span>}
              <div className="price__head">
                <h3 className="price__title">{p.title}</h3>
                <span className="price__duration">{p.duration}</span>
              </div>
              <p className="price__value">
                {p.price}
                {p.note && <span className="price__note">{p.note}</span>}
              </p>
              <ul className="price__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="m5 10.5 3.2 3L15 6.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink quiz variant={p.featured ? 'sand' : 'dark'} className="price__btn">
                Записаться
              </ButtonLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
