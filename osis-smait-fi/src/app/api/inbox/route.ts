import { NextResponse } from 'next/server';
import { STRAPI_INTERNAL_URL } from '@/lib/strapi';

async function sendTelegramNotification(data: { name: string; kelas?: string; category?: string; suggestion: string }) {
  // Strictly use Feedback Bot (@OSISSMAITFIADMIN_bot)
  const token = process.env.TELEGRAM_FEEDBACK_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[Inbox API] Telegram credentials missing');
    return;
  }

  const text = `💡 *Saran & Masukan Baru Received*\n\n` +
    `👤 *Nama:* ${data.name}\n` +
    `🏫 *Kelas:* ${data.kelas || '-'}\n` +
    `🏷️ *Kategori:* \`${data.category || 'instagram'}\`\n\n` +
    `📝 *Saran/Ide:*\n${data.suggestion}\n\n` +
    `🕒 *Waktu:* ${new Date().toLocaleString('id-ID')}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('[Inbox API] Failed to send Telegram message:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, kelas, category, suggestion } = body;

    if (!name || !suggestion) {
      return NextResponse.json(
        { error: 'Nama dan Saran Ide wajib diisi' },
        { status: 400 }
      );
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
