import { NextRequest, NextResponse } from 'next/server';
import { fetchStrapiAPI } from '@/lib/strapi';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division');
    const status = searchParams.get('status') || 'all';

    let endpoint = '/api/program-kerjas?populate=*&pagination[limit]=100';
    if (division) {
      endpoint += `&filters[$or][0][divisi][$containsi]=${encodeURIComponent(division)}&filters[$or][1][sekbid][nama][$containsi]=${encodeURIComponent(division)}`;
    }

    const json: any = await fetchStrapiAPI(endpoint, { silent404: true });
    const items = json?.data || [];

    const formattedProkers = items.map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        slug: attrs.slug || `proker-${item.id}`,
        title: attrs.judul || attrs.nama || 'Program Kerja',
        division: attrs.divisi || attrs.sekbid?.nama || 'OSIS',
        description: attrs.deskripsi || attrs.tujuan || '',
        targetExecution: attrs.target_pelaksanaan || attrs.waktu || '',
        status: attrs.status || 'planned',
      };
    });

    const filtered = status === 'all'
      ? formattedProkers
      : formattedProkers.filter((p: any) => p.status === status);

    return NextResponse.json(
      {
        data: filtered,
        meta: {
          total: filtered.length,
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
    console.error('[API Program Kerja] Error fetching proker:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch work programs',
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
