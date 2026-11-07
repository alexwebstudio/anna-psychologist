import { STATS } from '@/data/content';

export default function Stats() {
  return (
    <section className="stats" aria-label="Практика в цифрах">
      <div className="container stats__grid">
        {STATS.map((s) => (
          <div className="stat" key={s.value} data-fx="batch">
            <p className="stat__num">
              {/* AW-Flow · Number Roll */}
              <span data-fx="count" data-to={s.value}>
                {s.value}
              </span>
              {s.suffix}
            </p>
            <p className="stat__label">
              {s.label[0]}
              <br />
              {s.label[1]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
