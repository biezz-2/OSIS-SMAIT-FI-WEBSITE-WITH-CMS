import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const ucpDiscovery = {
    protocol_version: '1.0.0',
    services: ['non-profit-student-organization', 'public-events'],
    capabilities: ['catalog-read', 'event-registration'],
    endpoints: {
      catalog: 'https://osissmaitfi.biezz.my.id/api/events',
    },
    commerce_policy: {
      type: 'free-and-open',
      pricing: '0-idr',
      commercial_transactions: false,
    },
  };

  return NextResponse.json(ucpDiscovery, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
