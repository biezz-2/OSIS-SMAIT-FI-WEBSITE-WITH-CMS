import { NextRequest, NextResponse } from 'next/server';
import { fetchPublicProkerLpjHighlights } from '@/lib/strapi';

/**
 * Public BFF: Capaian + Evaluasi from mubes-lpj.sections (text only).
 * No MUBES auth — anggaran/nota intentionally omitted.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug?.trim()) {
    return NextResponse.json({ capaian: null, evaluasi: null }, { status: 400 });
  }

  try {
    const highlights = await fetchPublicProkerLpjHighlights(slug);
    return NextResponse.json(highlights, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('[lpj-public]', err);
    return NextResponse.json({ capaian: null, evaluasi: null }, { status: 500 });
  }
}
