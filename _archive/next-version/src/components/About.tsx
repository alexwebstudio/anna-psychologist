import { ButtonLink, Mark, PortraitPlaceholder } from './ui';
import Reviews from './Reviews';

export default function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          {/* AW-Flow · Mask Wipe */}
          <figure className="about__photo" data-fx="wipe">
            <div className="about__photo-inner" data-wipe-inner>
              <PortraitPlaceholder tone="light" label="Место для фотографии Анны Соколовой" />
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
            {/* AW-Flow · Blur Reveal + Marker Highlight */}
            <p className="about__lead" data-fx="blur">
              Привет! Меня зовут Анна. Я&nbsp;<Mark>клинический психолог</Mark>, работаю со&nbsp;взрослыми в&nbsp;онлайн-формате.
              Помогаю <Mark>снять тревогу</Mark>, <Mark>вернуть опору</Mark> и&nbsp;построить жизнь, в&nbsp;которой есть{' '}
              <Mark>смысл и спокойствие</Mark>. Со&nbsp;мной — бережно, без&nbsp;осуждения и&nbsp;в&nbsp;вашем темпе.
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
              <ButtonLink href="#contact" variant="outline">
                Записаться на консультацию
              </ButtonLink>
            </div>
          </div>
        </div>

        <Reviews />
      </div>
    </section>
  );
}
