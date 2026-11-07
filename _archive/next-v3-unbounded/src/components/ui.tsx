import type { ReactNode } from 'react';
import type { ServiceIconName } from '@/data/content';

/** Кнопка: при наведении фон заливается акцентом справа налево. */
export function Button({
  href,
  children,
  variant = 'dark',
  size = 'lg',
  arrow = true,
  external = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: 'dark' | 'light';
  size?: 'lg' | 'sm';
  arrow?: boolean;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`btn btn--${variant} btn--${size} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="btn__text">{children}</span>
      {arrow && (
        <svg className="btn__icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
    </a>
  );
}

/** Заглушка под фото. Замените на <Image src=... /> из next/image. */
export function Placeholder({ tone, label, caption }: { tone: 'dark' | 'light'; label: string; caption: string }) {
  const fill = tone === 'dark' ? 'url(#ph-grad)' : 'rgba(201,187,168,.5)';
  return (
    <div className={`placeholder placeholder--${tone}`} role="img" aria-label={label}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        {tone === 'dark' && (
          <defs>
            <linearGradient id="ph-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C9BBA8" stopOpacity=".26" />
              <stop offset="1" stopColor="#C9BBA8" stopOpacity=".05" />
            </linearGradient>
          </defs>
        )}
        <ellipse cx="200" cy="205" rx="68" ry="84" fill={fill} />
        <path d="M172 275h56v40h-56z" fill={fill} />
        <path d="M44 500c8-112 72-178 156-178s148 66 156 178z" fill={fill} />
      </svg>
      <span className="placeholder__label">{caption}</span>
    </div>
  );
}

export function ServiceIcon({ name }: { name: ServiceIconName }) {
  return (
    <svg className="card__icon" viewBox="0 0 120 120" aria-hidden="true">
      {name === 'anxiety' && (
        <>
          <circle cx="60" cy="96" r="12" />
          <circle cx="60" cy="84" r="24" />
          <circle cx="60" cy="72" r="36" />
          <circle cx="60" cy="62" r="46" className="accent" />
        </>
      )}
      {name === 'esteem' && (
        <>
          <circle cx="60" cy="62" r="46" />
          <path d="M60 16 100 85H20Z" className="accent" />
          <path d="M60 16v69M40 50.5h40" />
        </>
      )}
      {name === 'relations' && (
        <>
          <circle cx="44" cy="60" r="32" />
          <circle cx="76" cy="60" r="32" />
          <circle cx="60" cy="60" r="52" className="accent" />
        </>
      )}
      {name === 'meaning' && (
        <>
          <rect x="28" y="28" width="64" height="64" />
          <rect x="28" y="28" width="64" height="64" transform="rotate(45 60 60)" className="accent" />
          <circle cx="60" cy="60" r="16" />
        </>
      )}
    </svg>
  );
}

/** Задержка анимации AW-Flow через CSS-переменную. */
export const delay = (ms: number) => ({ '--awf-delay': `${ms}ms` }) as React.CSSProperties;
