import type { ReactNode } from 'react';

export function Arrow({ dir = 'right' }: { dir?: 'right' | 'left' | 'up-right' }) {
  const d = { right: 'M3 8h10M9 4l4 4-4 4', left: 'M13 8H3M7 4 3 8l4 4', 'up-right': 'M4.5 11.5l7-7M6 4.5h5.5V10' }[dir];
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Variant = 'dark' | 'sand' | 'outline' | 'ghost-light';

/**
 * Кнопка со стрелкой. При наведении фон плавно заливается акцентом от правого края,
 * квадрат со стрелкой свой цвет не меняет.
 * quiz — открывает квиз записи (значение — направление, которое отметить заранее).
 */
export function ButtonLink({
  href = '#',
  children,
  variant = 'dark',
  arrow = true,
  external = false,
  quiz,
  className = '',
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  external?: boolean;
  quiz?: string | true;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}) {
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {arrow && (
        <span className="btn__arrow">
          <Arrow />
        </span>
      )}
    </>
  );
  const cls = `btn btn--${variant} ${className}`;

  if (quiz) {
    return (
      <button type="button" className={cls} data-quiz={quiz === true ? '' : quiz} aria-haspopup="dialog" onClick={onClick}>
        {inner}
      </button>
    );
  }

  return (
    <a href={href} className={cls} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  );
}
