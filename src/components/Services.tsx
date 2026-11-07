import { SERVICES } from '@/data/content';
import ServiceCard from './ServiceCard';

export default function Services() {
  return (
    <section className="services section" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-fx="fade">
              С чем я работаю
            </p>
            {/* AW-Flow · Mask Reveal */}
            <h2 className="display services__title" id="services-title" data-fx="mask">
              Помогу разобраться даже в&nbsp;самых запутанных ситуациях
            </h2>
          </div>
          <p className="section-head__text" data-fx="fade" data-delay="0.2">
            Работаю со&nbsp;взрослыми в&nbsp;онлайн-формате. Выберите направление — или&nbsp;просто приходите с&nbsp;тем, что
            беспокоит: разберёмся вместе.
          </p>
        </div>

        {/* AW-Flow · Stagger Grid — каждая карточка ведёт на страницу направления */}
        <div className="cards">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
