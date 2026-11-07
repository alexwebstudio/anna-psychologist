import Image from 'next/image';
import { ButtonLink } from './ui';

export default function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          {/* AW-Flow · Mask Wipe */}
          <figure className="about__photo" data-fx="wipe">
            <div className="about__photo-inner" data-wipe-inner>
              <Image
                src="/img/anna-about.jpg"
                alt="Анна Соколова в кабинете"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="about__img"
              />
            </div>
            <figcaption className="about__badge" data-fx="fade" data-delay="0.6">
              <span className="about__badge-num">8 лет</span>
              <span>
                помогаю людям
                <br />
                вернуть опору
              </span>
            </figcaption>
          </figure>

          <div className="about__body">
            <p className="eyebrow" id="about-title" data-fx="fade">
              Обо мне
            </p>
            {/* AW-Flow · Blur Reveal. Акцентом выделено только одно словосочетание */}
            <p className="about__lead" data-fx="blur">
              Привет! Меня зовут Анна. Я&nbsp;клинический психолог, работаю со&nbsp;взрослыми в&nbsp;онлайн-формате.
              Помогаю снять тревогу, <span className="accent-text">вернуть опору</span> и&nbsp;построить жизнь, в&nbsp;которой
              есть смысл и&nbsp;спокойствие. Со&nbsp;мной — бережно, без&nbsp;осуждения и&nbsp;в&nbsp;вашем темпе.
            </p>

            <ul className="about__facts">
              <li data-fx="batch">
                <span className="about__fact-title">Формат</span>Онлайн: Zoom, Telegram или&nbsp;WhatsApp
              </li>
              <li data-fx="batch">
                <span className="about__fact-title">Длительность</span>50&nbsp;минут, обычно раз в&nbsp;неделю
              </li>
              <li data-fx="batch">
                <span className="about__fact-title">Принципы</span>Конфиденциальность и&nbsp;этический кодекс
              </li>
            </ul>

            <div data-fx="fade">
              <ButtonLink quiz variant="outline">
                Записаться на консультацию
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
