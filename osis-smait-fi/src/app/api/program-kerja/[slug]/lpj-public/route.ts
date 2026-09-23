import { NextRequest, NextResponse } from 'next/server';
import { fetchProgramKerjaFromStrapi, resolveProkerCapaianEvaluasi } from '@/lib/strapi';

/**
 * Public BFF: Capaian + Evaluasi from program-kerja fields and/or mubes-lpj.sections.
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
    const proker = await fetchProgramKerjaFromStrapi(slug);
    const attrs = proker ? proker.attributes || proker : null;
    const highlights = await resolveProkerCapaianEvaluasi(slug, attrs);
    return NextResponse.json(highlights, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('[lpj-public]', err);
    return NextResponse.json({ capaian: null, evaluasi: null }, { status: 500 });
  }
}
