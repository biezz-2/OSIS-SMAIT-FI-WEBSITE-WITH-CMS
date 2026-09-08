import { NextResponse } from 'next/server';
import { STRAPI_INTERNAL_URL } from '@/lib/strapi';

// In-memory rate limiting: max 3 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

function escapeTelegramMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

async function sendTelegramNotification(data: { name: string; kelas?: string; category?: string; suggestion: string }) {
  // Strictly use Feedback Bot (@OSISSMAITFIADMIN_bot)
  const token = process.env.TELEGRAM_FEEDBACK_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[Inbox API] Telegram credentials missing');
    return;
  }

  const safeName = escapeTelegramMarkdown(data.name);
  const safeKelas = escapeTelegramMarkdown(data.kelas || '-');
  const safeCategory = escapeTelegramMarkdown(data.category || 'instagram');
  const safeSuggestion = escapeTelegramMarkdown(data.suggestion);

  const text = `💡 *Saran & Masukan Baru Received*\n\n` +
    `👤 *Nama:* ${safeName}\n` +
    `🏫 *Kelas:* ${safeKelas}\n` +
    `🏷️ *Kategori:* \`${safeCategory}\`\n\n` +
    `📝 *Saran/Ide:*\n${safeSuggestion}\n\n` +
    `🕒 *Waktu:* ${new Date().toLocaleString('id-ID')}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'MarkdownV2',
      }),
    });
  } catch (err) {
    console.error('[Inbox API] Failed to send Telegram message:', err);
  }
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, kelas, category, suggestion } = body;

    if (!name || !suggestion) {
      return NextResponse.json(
        { error: 'Nama dan Saran Ide wajib diisi' },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || name.length > 100) {
      return NextResponse.json({ error: 'Nama terlalu panjang (maksimal 100 karakter)' }, { status: 400 });
    }

    if (typeof suggestion !== 'string' || suggestion.length > 2000) {
      return NextResponse.json({ error: 'Saran ide terlalu panjang (maksimal 2000 karakter)' }, { status: 400 });
    }

    // Always send direct Telegram notification so feedback is never lost
    await sendTelegramNotification({ name, kelas, category, suggestion });

    const payload = {
      data: {
        nama: name,
        kelas: kelas || '',
        kategori: category || 'instagram',
        saran_ide: suggestion,
        status: 'Baru',
      },
    };

    // Post to Strapi /api/inboxes
    const strapiRes = await fetch(`${STRAPI_INTERNAL_URL}/api/inboxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text();
      console.warn('[Inbox API] Strapi response error:', strapiRes.status, errorText);

      // Even if Strapi permissions return 403, gracefully acknowledge
      return NextResponse.json({
        success: true,
        message: 'Ide terkirim.',
        status: strapiRes.status,
      });
    }

    const data = await strapiRes.json();
    return NextResponse.json({
      success: true,
      data: data.data,
      message: 'Saran ide berhasil disimpan ke Inbox Strapi!',
    });
  } catch (error: any) {
    console.error('[Inbox API Error]:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim saran ide ke Strapi', details: error?.message },
      { status: 500 }
    );
  }
}
