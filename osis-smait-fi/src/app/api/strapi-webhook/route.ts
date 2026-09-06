import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const PATH_MAP: Record<string, string[]> = {
  sekbid: ['/sekbid', '/program-kerja', '/'],
  'anggota-osis': ['/anggota', '/about', '/'],
  'program-kerja': ['/program-kerja', '/sekbid', '/'],
  'media-asset': ['/media-sosial', '/galeri', '/'],
  halaman: ['/about', '/privacy-policy', '/'],
  'galeri-foto': ['/galeri', '/'],
  event: ['/', '/events'],
  'artikel-mading': ['/sekbid'],
  'edufest-division': ['/edufest-infinity', '/edufest-infinity/panitia'],
  'edufest-member': ['/edufest-infinity', '/edufest-infinity/panitia'],
  'edufest-timeline': ['/edufest-infinity', '/edufest-infinity/timeline'],
  'edufest-config': ['/edufest-infinity', '/edufest-infinity/location'],
  inbox: [],
};

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram credentials missing');
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Failed to send Telegram message:', err);
  }
}

function formatStrapiLog(body: any) {
  const event = body.event || 'unknown';
  const model = body.model || 'unknown';
  const entry = body.entry || {};
  
  const eventMap: Record<string, { emoji: string; label: string }> = {
    'entry.create': { emoji: '🆕', label: 'Data Baru Dibuat' },
    'entry.update': { emoji: '📝', label: 'Data Diperbarui' },
    'entry.delete': { emoji: '🗑️', label: 'Data Dihapus' },
    'entry.publish': { emoji: '🚀', label: 'Data Dipublikasikan' },
    'entry.unpublish': { emoji: '🛑', label: 'Data Ditarik' },
  };

  const { emoji, label } = eventMap[event] || { emoji: '🔔', label: 'Event Strapi' };
  
  return `${emoji} *${label}*\n` +
         `📦 *Model:* \`${model}\`\n` +
         `🆔 *ID:* \`${entry.id || 'N/A'}\`\n` +
         `🕒 *Waktu:* ${new Date().toLocaleString('id-ID')}`;
}

async function purgeCloudflareCache(paths: string[]) {
  const zoneId = process.env.CF_ZONE_ID;
  const apiToken = process.env.CF_API_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://osissmaitfi.biezz.my.id';

  if (!zoneId || !apiToken) {
    return { success: false, reason: 'Cloudflare credentials not configured' };
  }

  const files = paths.map((path) => `${siteUrl}${path}`);

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    });

    const data = await res.json();
    return { success: data.success, errors: data.errors };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret') || request.headers.get('x-webhook-secret');

  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const model = body.model || body.entry?.contentType || body.event?.split('.')[0];
    const targetPaths = [...((model && PATH_MAP[model]) || ['/'])];

    // Jika model adalah event dan memiliki slug, revalidate juga halaman detailnya
    if (model === 'event' && body.entry?.slug) {
      targetPaths.push(`/events/${body.entry.slug}`);
    }

    targetPaths.forEach((path: string) => {
      try {
        revalidatePath(path);
      } catch {}
    });

    const cfResult = await purgeCloudflareCache(targetPaths);

    // Send log to Telegram
    const logMessage = formatStrapiLog(body);
    await sendTelegramMessage(logMessage);

    return NextResponse.json({
      ok: true,
      model,
      revalidatedPaths: targetPaths,
      cloudflarePurge: cfResult,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid payload';
    
    // Log error to Telegram
    await sendTelegramMessage(`🚨 *Website Error*\n\n⚠️ *Pesan:* ${errorMessage}\n🕒 *Waktu:* ${new Date().toLocaleString('id-ID')}`);

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
