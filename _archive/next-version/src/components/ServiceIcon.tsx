import type { Service } from '@/data/content';

export default function ServiceIcon({ name }: { name: Service['icon'] }) {
  return (
    <svg className="card__icon" viewBox="0 0 120 120" aria-hidden="true">
      {name === 'anxiety' && (
        <>
          <circle cx="60" cy="96" r="12" />
          <circle cx="60" cy="84" r="24" />
          <circle cx="60" cy="72" r="36" />
          <circle cx="60" cy="62" r="46" className="accent-stroke" />
        </>
      )}
      {name === 'esteem' && (
        <>
          <circle cx="60" cy="62" r="46" />
          <path d="M60 16 100 85H20Z" className="accent-stroke" />
          <path d="M60 16v69M40 50.5h40" />
        </>
      )}
      {name === 'relations' && (
        <>
          <defs>
            <clipPath id="clip-rel">
              <circle cx="44" cy="60" r="32" />
            </clipPath>
          </defs>
          <circle cx="76" cy="60" r="32" clipPath="url(#clip-rel)" className="accent-fill" />
          <circle cx="44" cy="60" r="32" />
          <circle cx="76" cy="60" r="32" />
          <circle cx="60" cy="60" r="52" className="accent-stroke" />
        </>
      )}
      {name === 'meaning' && (
        <>
          <rect x="28" y="28" width="64" height="64" />
          <rect x="28" y="28" width="64" height="64" transform="rotate(45 60 60)" className="accent-stroke" />
          <circle cx="60" cy="60" r="16" />
          <circle cx="60" cy="60" r="2.5" className="dot-fill" />
        </>
      )}
    </svg>
  );
}
