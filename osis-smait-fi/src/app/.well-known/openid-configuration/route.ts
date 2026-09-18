import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const oidcMetadata = {
    issuer: 'https://osissmaitfi.biezz.my.id',
    authorization_endpoint: 'https://osissmaitfi.biezz.my.id/oauth/authorize',
    token_endpoint: 'https://osissmaitfi.biezz.my.id/oauth/token',
    jwks_uri: 'https://osissmaitfi.biezz.my.id/.well-known/jwks.json',
    response_types_supported: ['code', 'id_token', 'token id_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256', 'EdDSA'],
    scopes_supported: ['openid', 'profile', 'email', 'read:public'],
  };

  return NextResponse.json(oidcMetadata, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
