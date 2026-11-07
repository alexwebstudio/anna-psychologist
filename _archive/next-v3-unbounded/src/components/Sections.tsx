import {
  EMAIL,
  PHONE,
  PHONE_HREF,
  REVIEWS,
  SERVICES,
  STATS,
  STUDIO_URL,
  TELEGRAM_CHANNEL_URL,
  TELEGRAM_URL,
} from '@/data/content';
import { Button, Placeholder, ServiceIcon, delay } from './ui';

/* Серверные компоненты: классы awf-* безопасно разбиваются на слова на клиенте. */

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <h1 className="hero__name awf-text-blur" id="hero-title">
          Анна
          <br />
          Соколова
        </h1>
        <p className="hero__role awf-text-blur" style={delay(250)}>
          Анна Соколова, клинический психолог
        </p>
        <p className="hero__subtitle awf-text-blur" style={delay(400)}>
          Психологическая поддержка для тех, кто готов к&nbsp;переменам
        </p>
        <div className="awf-blur-in" style={delay(700)}>
          <Button href="#contact">Записаться на консультацию</Button>
        </div>
      </div>

      <figure className="hero__photo awf-blur-in" style={delay(150)}>
        <Placeholder tone="dark" label="Место для портрета Анны Соколовой" caption="Портрет 4:5" />
      </figure>
    </section>
  );
}

export function Stats() {
  return (
    <section className="stats" aria-label="Практика в цифрах">
      {STATS.map((s, i) => (
        <div className="stat awf-blur-in" style={delay(i * 120)} key={s.value}>
          <p className="stat__num">{s.value}</p>
          <p className="stat__label">{s.label}</p>
        </div>
      ))}
    </section>
  );
}

export function Services() {
  return (
    <section className="services section" id="services" aria-labelledby="services-title">
      <h2 className="title awf-text-blur" id="services-title">
        С чем я работаю
      </h2>
      <div className="cards">
        {SERVICES.map((s, i) => (
          <div className="card-wrap awf-blur-in" style={delay(i * 100)} key={s.title}>
            <article className="card">
              <h3 className="card__title">{s.title}</h3>
              <ServiceIcon name={s.icon} />
              <p className="card__text">{s.text}</p>
              <button className="card__link" data-service={i} aria-haspopup="dialog">
                Подробнее →
              </button>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <figure className="about__photo awf-blur-in">
        <Placeholder tone="light" label="Место для фотографии Анны Соколовой" caption="Фото 4:5" />
      </figure>

      <div className="about__body">
        <h2 className="title awf-text-blur" id="about-title">
          Обо мне
        </h2>
        <p className="about__text awf-text-blur" style={{ '--awf-stagger': '30ms' } as React.CSSProperties}>
          Привет! Меня зовут Анна. Я клинический психолог, работаю со&nbsp;взрослыми в&nbsp;онлайн-формате. Помогаю снять
          тревогу, <span className="accent-text">вернуть опору</span> и&nbsp;построить жизнь, в&nbsp;которой есть смысл
          и&nbsp;спокойствие. Со&nbsp;мной бережно, без&nbsp;осуждения и&nbsp;в&nbsp;вашем темпе.
        </p>
        <div className="awf-blur-in">
          <Button href="#contact">Записаться на консультацию</Button>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
      <h2 className="title awf-text-blur" id="reviews-title">
        Отзывы
      </h2>
      <div className="reviews__grid">
        {REVIEWS.map((r, i) => (
          <blockquote className="review awf-blur-in" style={delay(i * 100)} key={r.author}>
            <p>{r.text}</p>
            <footer>{r.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="cta" id="contact" aria-labelledby="cta-title">
      <h2 className="cta__title awf-text-blur" id="cta-title">
        Сделайте первый шаг <span className="cta__accent">уже сегодня</span>
      </h2>
      <p className="cta__text awf-text-blur" style={delay(250)}>
        На&nbsp;первой встрече познакомимся, обсудим ваш запрос и&nbsp;формат работы.
      </p>
      <div className="awf-blur-in" style={delay(350)}>
        <Button href={TELEGRAM_URL} variant="light" external>
          Записаться
        </Button>
      </div>
    </section>
  );
}

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="footer__grid">
        <div className="footer__brand">
          <a href="#top" className="logo">
            Анна Соколова
          </a>
          <p>
            Клинический психолог.
            <br />
            Онлайн-консультации для&nbsp;взрослых.
          </p>
        </div>
        <div>
          <p className="footer__title">Контакты</p>
          <ul className="footer__list">
            <li>
              <a href={PHONE_HREF}>{PHONE}</a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer__title">Telegram</p>
          <ul className="footer__list">
            <li>
              <a href={TELEGRAM_URL} {...ext}>
                Написать в&nbsp;Telegram
              </a>
            </li>
            <li>
              <a href={TELEGRAM_CHANNEL_URL} {...ext}>
                Telegram-канал
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer__title">Соцсети</p>
          <ul className="footer__list">
            <li>
              <a href="https://vk.com/" {...ext}>
                ВКонтакте
              </a>
            </li>
            <li>
              <a href="https://dzen.ru/" {...ext}>
                Дзен
              </a>
            </li>
            <li>
              <a href="https://youtube.com/" {...ext}>
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2026 Анна Соколова</p>
        <a href={STUDIO_URL} {...ext}>
          Разработано AlexWebStudio
        </a>
      </div>
    </footer>
  );
}
