# Анна Соколова — сайт-визитка психолога

Next.js 16 (App Router), без UI- и анимационных библиотек. Плавный скролл — Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Где что менять
- Тексты, телефон, ссылки, отзывы — `src/data/content.ts` (помечено `TODO`)
- Разметка секций — `src/components/Sections.tsx`
- Фото — компонент `Placeholder` в `Sections.tsx`, замените на `next/image`
- Цвета, шрифты, отступы — переменные в начале `src/app/globals.css`

## Анимации AW-Flow (чистый JS, IntersectionObserver)
Логика — `src/components/AwfEffects.tsx`, параметры — CSS-переменные в `globals.css`.

| Класс | Эффект | Параметры |
|---|---|---|
| `awf-text-blur` | Blur Reveal: слова выходят из размытия каскадом | blur 14px, 900 мс, stagger 45 мс, expo.out |
| `awf-blur-in` | Blur In: блок выплывает из размытия, scale 1.05 → 1 | blur 16px, 900 мс, cubic-bezier(0.5, 1, 0.89, 1) |

Задержка: `style={delay(200)}` (хелпер из `ui.tsx`).
Классы вешаются только на элементы серверных компонентов.
При `prefers-reduced-motion` анимации и плавный скролл отключаются.
