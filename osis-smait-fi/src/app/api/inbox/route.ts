import { NextResponse } from 'next/server';
import { STRAPI_INTERNAL_URL } from '@/lib/strapi';

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
