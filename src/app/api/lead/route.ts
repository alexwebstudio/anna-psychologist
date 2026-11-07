import { NextResponse } from 'next/server';

/**
 * Приём заявок из квиза.
 * Если заданы переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID,
 * заявка уходит сообщением в Telegram. Иначе просто пишется в лог сервера.
 */

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 80)).filter(Boolean).slice(0, 10) : []);

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const name = str(data.name, 100);
  const contact = str(data.contact, 100);
  if (!name || !contact || data.consent !== true) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 400 });
  }

  const text = [
    'Новая заявка с сайта',
    '',
    `Имя: ${name}`,
    `Контакт: ${contact} (${str(data.messenger, 30)})`,
    `Запрос: ${list(data.topics).join(', ')}`,
    `Длительность: ${str(data.duration)}`,
    `Опыт с психологом: ${str(data.experience)}`,
    `Формат: ${str(data.format)}`,
    `Удобное время: ${list(data.time).join(', ')}`,
  ].join('\n');

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      if (!res.ok) return NextResponse.json({ ok: false, error: 'telegram' }, { status: 502 });
    } catch {
      return NextResponse.json({ ok: false, error: 'telegram' }, { status: 502 });
    }
  } else {
    console.info(`[lead]\n${text}`);
  }

  return NextResponse.json({ ok: true });
}
