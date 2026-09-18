import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: 'https://osissmaitfi.biezz.my.id/api',
        'service-desc': [
          {
            href: 'https://osissmaitfi.biezz.my.id/openapi.json',
            type: 'application/openapi+json',
          },
        ],
        'service-doc': [
          {
            href: 'https://osissmaitfi.biezz.my.id/docs',
            type: 'text/html',
          },
        ],
        status: [
          {
            href: 'https://osissmaitfi.biezz.my.id/api/health',
            type: 'application/json',
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
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
