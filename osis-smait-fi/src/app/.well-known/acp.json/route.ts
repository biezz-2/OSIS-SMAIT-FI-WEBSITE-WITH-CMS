import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const acpDiscovery = {
    protocol: {
      name: 'acp',
      version: '1.0.0',
    },
    api_base_url: 'https://osissmaitfi.biezz.my.id/api',
    transports: ['http-json', 'mcp'],
    capabilities: {
      services: ['catalog', 'information'],
    },
    organization: {
      name: 'OSIS SMAIT Fithrah Insani',
      type: 'non-profit-student-organization',
      website: 'https://osissmaitfi.biezz.my.id',
    },
    endpoints: {
      catalog: 'https://osissmaitfi.biezz.my.id/api/events',
      info: 'https://osissmaitfi.biezz.my.id/api/inbox',
    },
  };

  return NextResponse.json(acpDiscovery, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
