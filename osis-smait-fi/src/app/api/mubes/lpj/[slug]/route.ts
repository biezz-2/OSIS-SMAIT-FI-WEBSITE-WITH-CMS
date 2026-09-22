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
    // Deep-populate sections + media so dynamic LPJ body reaches the UI
    const populate =
      'populate[sections]=true&populate[nota_kwitansi]=true&populate[program_kerja][fields][0]=slug&populate[program_kerja][fields][1]=judul';
    const filterQuery = `filters[$or][0][program_kerja][slug][$eq]=${encodeURIComponent(normalizedSlug)}&filters[$or][1][program_kerja][slug][$eq]=${encodeURIComponent(slugLower)}`;
    const res = await fetch(
      `${strapiBaseUrl}/api/mubes-lpjs?${filterQuery}&${populate}`,
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
    const raw = payload?.data?.[0] || null;
    const attrs = raw ? raw.attributes || raw : null;

    const sectionsRaw = attrs?.sections;
    const sectionsList = Array.isArray(sectionsRaw)
      ? sectionsRaw
      : Array.isArray(sectionsRaw?.data)
        ? sectionsRaw.data
        : [];

    const lpj = attrs
      ? {
          id: raw.id,
          documentId: raw.documentId || attrs.documentId,
          realisasi_anggaran: attrs.realisasi_anggaran ?? null,
          sumber_dana: attrs.sumber_dana ?? null,
          evaluasi_internal: attrs.evaluasi_internal ?? null,
          kendala_solusi: attrs.kendala_solusi ?? null,
          status_pengesahan: attrs.status_pengesahan || 'draft',
          nota_kwitansi: attrs.nota_kwitansi?.data || attrs.nota_kwitansi || [],
          sections: sectionsList
            .map((s: any, i: number) => {
              const row = s?.attributes || s || {};
              const judul = String(row.judul ?? '').trim();
              const isi = String(row.isi ?? '').trim();
              if (!judul && !isi) return null;
              const order =
                typeof row.order === 'number' ? row.order : row.order != null ? Number(row.order) : i;
              return {
                id: s?.id ?? i,
                judul: judul || `Bagian ${i + 1}`,
                isi,
                order: Number.isFinite(order) ? order : i,
              };
            })
            .filter(Boolean)
            .sort((a: { order?: number }, b: { order?: number }) => (a.order ?? 0) - (b.order ?? 0)),
        }
      : null;

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
