import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/data/content';
import { Arrow } from './ui';

/** Карточка направления: фото на всю карточку, текст на мягком затемнении. Ведёт на страницу направления. */
export default function ServiceCard({ service, index, compact = false }: { service: Service; index: number; compact?: boolean }) {
  return (
    <div className="card-wrap" data-fx="batch">
      <Link
        href={`/napravleniya/${service.slug}`}
        className={`card${compact ? ' card--compact' : ''}`}
        aria-label={`${service.title}: подробнее`}
      >
        <div className="card__media" aria-hidden="true">
          <Image
            src={service.photo}
            alt=""
            fill
            sizes={compact ? '(max-width: 720px) 90vw, 30vw' : '(max-width: 720px) 90vw, (max-width: 1180px) 45vw, 23vw'}
            className="card__img"
          />
        </div>
        <span className="card__num">0{index + 1}</span>
        <div className="card__body">
          <h3 className="card__title">{service.title}</h3>
          {!compact && <p className="card__text">{service.text}</p>}
          <span className="card__link">
            Подробнее
            <span className="card__link-icon">
              <Arrow />
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}
