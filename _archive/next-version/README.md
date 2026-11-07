# Анна Соколова — сайт-визитка психолога

Next.js 16 (App Router) + GSAP 3.15 (ScrollTrigger, SplitText) + Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Где что менять
- Тексты, телефон, ссылки, отзывы — `src/data/content.ts` (помечено `TODO`)
- Фото — заглушки `PortraitPlaceholder` в `Hero.tsx` и `About.tsx`, замените на `next/image`
- Цвета и шрифты — переменные в начале `src/app/globals.css`

## Анимации (из каталога AW-Flow)
| Эффект | Где |
|---|---|
| Preloader — Logo Reveal | `Preloader.tsx` |
| Split Stagger + Mask Wipe + параллакс | `Hero.tsx` |
| Mask Reveal (`data-fx="mask"`) | заголовки секций |
| Blur Reveal + Marker Highlight (`data-fx="blur"`, `<Mark>`) | «Обо мне» |
| Number Roll (`data-fx="count"`) | статистика |
| Stagger Grid (`data-fx="batch"`) | карточки, факты, футер |
| Mask Wipe (`data-fx="wipe"`) | фото «Обо мне» |
| Border Draw + Spotlight + прорисовка иконок | карточки направлений |
| Magnetic Button (`data-magnetic`) | все кнопки |
| Custom Cursor | `Cursor.tsx` (только мышь) |
| Marquee | `Marquee.tsx` |
| Hover Fill | пункты меню |
| Floating Blobs (`data-blob`) | финальный CTA |
| Плавный скролл Lenis | `SmoothScroll.tsx` |

Скролл-эффекты собраны в `src/components/Effects.tsx` и стартуют после прелоадера.
При `prefers-reduced-motion` анимации, курсор и Lenis отключаются.
