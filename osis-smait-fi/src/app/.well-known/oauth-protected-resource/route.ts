import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const resourceMetadata = {
    resource: 'https://osissmaitfi.biezz.my.id',
    authorization_servers: ['https://osissmaitfi.biezz.my.id'],
    scopes_supported: ['read:public', 'read:events', 'read:proker', 'write:aspirasi'],
    bearer_methods_supported: ['header'],
    resource_documentation: 'https://osissmaitfi.biezz.my.id/docs',
  };

  return NextResponse.json(resourceMetadata, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
