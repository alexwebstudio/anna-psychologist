import type { ReactNode } from 'react';

export function Arrow({ dir = 'right' }: { dir?: 'right' | 'left' }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d={dir === 'right' ? 'M3 8h10M9 4l4 4-4 4' : 'M13 8H3M7 4 3 8l4 4'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Кнопка со стрелкой. data-magnetic включает эффект Magnetic Button. */
export function ButtonLink({
  href,
  children,
  variant = 'dark',
  arrow = true,
  external = false,
  className = '',
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: 'dark' | 'sand' | 'outline' | 'ghost-light';
  arrow?: boolean;
  external?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href={href}
      className={`btn btn--${variant} ${className}`}
      data-magnetic
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="btn__label">{children}</span>
      {arrow && (
        <span className="btn__arrow">
          <Arrow />
        </span>
      )}
    </a>
  );
}

/** Marker Highlight: каждое слово получает свой маркер, который прорисовывается слева направо. */
export function Mark({ children }: { children: string }) {
  const words = children.split(' ');
  return (
    <span className="hl">
      {words.map((w, i) => (
        <span key={i}>
          <span className="mk-word">
            {w}
            <span className="mk" aria-hidden="true" />
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/** Заглушка под портрет. Замените на <Image src=... /> когда будут фото. */
export function PortraitPlaceholder({ tone, label }: { tone: 'dark' | 'light'; label: string }) {
  const fill = tone === 'dark' ? 'url(#portrait-grad)' : 'rgba(201,187,168,.45)';
  return (
    <div className={`portrait portrait--${tone}`} role="img" aria-label={label}>
      <svg className="portrait__svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        {tone === 'dark' && (
          <defs>
            <linearGradient id="portrait-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C9BBA8" stopOpacity=".24" />
              <stop offset="1" stopColor="#C9BBA8" stopOpacity=".04" />
            </linearGradient>
          </defs>
        )}
        <circle cx="200" cy="190" r="150" fill="none" stroke="#C9BBA8" strokeOpacity={tone === 'dark' ? 0.18 : 0.7} />
        <ellipse cx="200" cy="200" rx="66" ry="82" fill={fill} />
        <path d="M172 268h56v40h-56z" fill={fill} />
        <path d="M48 500c8-112 70-176 152-176s144 64 152 176z" fill={fill} />
      </svg>
      <span className="portrait__tag">Фото · 4:5</span>
    </div>
  );
}
