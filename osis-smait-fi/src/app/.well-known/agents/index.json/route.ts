import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const agentsIndex = {
    schema_version: '1.0',
    name: 'OSIS SMAIT Fithrah Insani Agent Gateway',
    description: 'Agentic interface for student organization information, events catalog, and public activities.',
    host: 'osissmaitfi.biezz.my.id',
    agents: [
      {
        id: 'osis-public-agent',
        name: 'OSIS Public Portal Assistant',
        version: '1.0.0',
        protocols: ['acp', 'ucp', 'http-json'],
        capabilities: ['events-query', 'proker-query', 'aspirasi-info'],
        discovery_urls: {
          acp: 'https://osissmaitfi.biezz.my.id/.well-known/acp.json',
          ucp: 'https://osissmaitfi.biezz.my.id/.well-known/ucp',
          dns_aid: 'https://osissmaitfi.biezz.my.id/.well-known/dns-aid.json',
        },
      },
    ],
  };

  return NextResponse.json(agentsIndex, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
