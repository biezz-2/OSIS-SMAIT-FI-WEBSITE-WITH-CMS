import { NextRequest, NextResponse } from 'next/server';
import { fetchAllEventsForPage, getStrapiMediaUrl } from '@/lib/strapi';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '20', 10);
    const limit = isNaN(limitParam) ? 20 : Math.min(Math.max(limitParam, 1), 100);
    const statusParam = searchParams.get('status') || 'all';

    const rawEvents = await fetchAllEventsForPage();
    const now = new Date();

    const formattedEvents = rawEvents.map((item: any) => {
      const attrs = item.attributes || item;
      const bannerMedia = attrs.banner || attrs.gambar;
      const bannerUrl = getStrapiMediaUrl(bannerMedia, '');

      const startDateStr = attrs.tanggal_mulai || attrs.tanggal || attrs.createdAt;
      const endDateStr = attrs.tanggal_selesai || startDateStr;
      const startDate = startDateStr ? new Date(startDateStr) : null;
      const endDate = endDateStr ? new Date(endDateStr) : null;

      let status = 'upcoming';
      if (endDate && endDate < now) {
        status = 'past';
      } else if (startDate && startDate <= now && (!endDate || endDate >= now)) {
        status = 'ongoing';
      }

      return {
        id: item.id,
        slug: attrs.slug || `event-${item.id}`,
        title: attrs.judul || attrs.nama || attrs.title || 'Event OSIS',
        description: attrs.deskripsi || attrs.deskripsi_singkat || '',
        startDate: startDateStr,
        endDate: endDateStr,
        location: attrs.lokasi || attrs.tempat || 'Kampus SMAIT Fithrah Insani',
        bannerUrl,
        ctaUrl: attrs.cta_url || `/events/${attrs.slug || item.id}`,
        status,
      };
    });

    const filtered = statusParam === 'all'
      ? formattedEvents
      : formattedEvents.filter((ev: any) => ev.status === statusParam);

    const paginated = filtered.slice(0, limit);

    return NextResponse.json(
      {
        data: paginated,
        meta: {
          total: filtered.length,
          returned: paginated.length,
        },
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      }
    );
  } catch (error) {
    console.error('[API Events] Error fetching events:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch public events',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
