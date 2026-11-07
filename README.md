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
- Цвета, шрифты, отступы — переменные в начале `src/app/globals.css`

## Страницы направлений
`/napravleniya/[slug]` — генерируются из `SERVICES` в `src/data/content.ts` (тексты, запросы, результаты, тема фона).
Иллюстрации — `src/components/ServiceArt.tsx`.

## Квиз записи и заявки в Telegram
Любая кнопка с `quiz` (`<ButtonLink quiz>`) открывает квиз из 6 шагов (`QuizModal.tsx`).
Заявка отправляется на `/api/lead`. Чтобы получать её в Telegram, создайте `.env.local`:

```
TELEGRAM_BOT_TOKEN=токен от @BotFather
TELEGRAM_CHAT_ID=id чата, куда слать заявки
```

Без этих переменных заявка только пишется в лог сервера.
Сайту нужен Node-хостинг (Vercel и т. п.), статический экспорт не подойдёт из-за `/api/lead`.

## Анимации (из каталога AW-Flow)
| Эффект | Где |
|---|---|
| Split Stagger + Mask Wipe + параллакс | `Hero.tsx` |
| Заливка кнопки справа налево (`.btn--fill`) | кнопка в герое |
| Mask Reveal (`data-fx="mask"`) | заголовки секций |
| Blur Reveal (`data-fx="blur"`) | текст «Обо мне» |
| Number Roll (`data-fx="count"`) | статистика |
| Stagger Grid (`data-fx="batch"`) | карточки, факты, футер |
| Mask Wipe (`data-fx="wipe"`) | фото «Обо мне» |
| Border Draw + прорисовка иконок | карточки направлений |
| Floating Blobs (`data-blob`) | финальный CTA |
| Плавный скролл Lenis | `SmoothScroll.tsx` |

Скролл-эффекты собраны в `src/components/Effects.tsx`.
При `prefers-reduced-motion` анимации и плавный скролл отключаются.
