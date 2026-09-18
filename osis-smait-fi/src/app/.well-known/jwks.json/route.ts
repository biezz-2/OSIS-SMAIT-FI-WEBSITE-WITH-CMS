import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const jwks = {
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        alg: 'RS256',
        kid: 'osis-agent-rsa-2026',
        n: 'uQ1wO7...placeholder_key...89xyz',
        e: 'AQAB',
      },
      {
        kty: 'OKP',
        crv: 'Ed25519',
        use: 'sig',
        kid: 'osis-agent-ed25519-2026',
        x: '11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrGwBO452h10',
      },
    ],
  };

  return NextResponse.json(jwks, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
