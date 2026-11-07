// Синхронизация: анимации героя, хедера и скролл-эффекты стартуют, когда прелоадер начинает уезжать.
// На страницах без прелоадера (направления) старт сразу — см. Effects.

let done = false;
const listeners = new Set<() => void>();

export const isIntroDone = () => done;

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

export function onIntroDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
