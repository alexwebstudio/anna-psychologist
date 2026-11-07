import { EMAIL, PHONE, PHONE_HREF, TELEGRAM_CHANNEL_URL, TELEGRAM_URL } from '@/data/content';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand" data-fx="batch">
            <a href="#top" className="logo">
              Анна Соколова
            </a>
            <p>
              Клинический психолог.
              <br />
              Онлайн-консультации для&nbsp;взрослых.
            </p>
          </div>
          <div data-fx="batch">
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
          <div data-fx="batch">
            <p className="footer__title">Telegram</p>
            <ul className="footer__list">
              <li>
                <a href={TELEGRAM_URL} {...ext}>
                  Написать в&nbsp;Telegram
                </a>
              </li>
              <li id="blog">
                <a href={TELEGRAM_CHANNEL_URL} {...ext}>
                  Блог — Telegram-канал
                </a>
              </li>
            </ul>
          </div>
          <div data-fx="batch">
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
          <p>© 2026 Анна Соколова. Все права защищены.</p>
          <a href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}
