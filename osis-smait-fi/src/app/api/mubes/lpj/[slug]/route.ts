import { NextRequest, NextResponse } from 'next/server';
import { getMubesAccess } from '@/lib/mubes-access';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const access = await getMubesAccess();

  if (!access.allowed) {
    return NextResponse.json(
      { allowed: false, error: 'Akses ditolak. Anda tidak memiliki izin sidang MUBES.' },
      { status: 403 }
    );
  }

  const strapiBaseUrl = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';
  const elevatedToken = process.env.STRAPI_ELEVATED_TOKEN;

  if (!elevatedToken) {
    console.error('[MUBES BFF] Missing STRAPI_ELEVATED_TOKEN');
    return NextResponse.json(
      { allowed: true, role: access.role, lpj: null, error: 'BFF configuration error' },
      { status: 500 }
    );
  }

  const normalizedSlug = slug.trim();
  const slugLower = normalizedSlug.toLowerCase();

  try {
    const filterQuery = `filters[$or][0][program_kerja][slug][$eq]=${encodeURIComponent(normalizedSlug)}&filters[$or][1][program_kerja][slug][$eq]=${encodeURIComponent(slugLower)}`;
    const res = await fetch(
      `${strapiBaseUrl}/api/mubes-lpjs?${filterQuery}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${elevatedToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.error(`[MUBES BFF] Strapi returned status ${res.status}`);
      return NextResponse.json(
        { allowed: true, role: access.role, lpj: null, error: 'Gagal mengambil data LPJ dari Strapi' },
        { status: res.status }
      );
    }

    const payload = await res.json();
    const lpj = payload?.data?.[0] || null;

    return NextResponse.json({
      allowed: true,
      role: access.role,
      status: access.status,
      lpj,
    });
  } catch (err: any) {
    console.error('[MUBES BFF] Network error:', err.message);
    return NextResponse.json(
      { allowed: true, role: access.role, lpj: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
