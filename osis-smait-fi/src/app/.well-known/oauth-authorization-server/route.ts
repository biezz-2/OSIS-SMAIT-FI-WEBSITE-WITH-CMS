import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const oauthServerMetadata = {
    issuer: 'https://osissmaitfi.biezz.my.id',
    authorization_endpoint: 'https://osissmaitfi.biezz.my.id/oauth/authorize',
    token_endpoint: 'https://osissmaitfi.biezz.my.id/oauth/token',
    jwks_uri: 'https://osissmaitfi.biezz.my.id/.well-known/jwks.json',
    registration_endpoint: 'https://osissmaitfi.biezz.my.id/oauth/register',
    scopes_supported: ['read:public', 'read:events', 'read:proker', 'write:aspirasi'],
    response_types_supported: ['code', 'token'],
    grant_types_supported: ['authorization_code', 'client_credentials'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    service_documentation: 'https://osissmaitfi.biezz.my.id/docs',
    agent_auth: {
      skill: 'https://osissmaitfi.biezz.my.id/auth.md',
      claim_uri: 'https://osissmaitfi.biezz.my.id/oauth/claim',
      register_uri: 'https://osissmaitfi.biezz.my.id/oauth/register',
      identity_types_supported: ['anonymous', 'identity_assertion'],
      methods: ['anonymous', 'identity_assertion', 'client_credentials'],
      anonymous: {
        credential_types_supported: ['ephemeral', 'token'],
      },
      identity_assertion: {
        assertion_types_supported: ['id-jag', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'],
        credential_types_supported: ['bearer', 'jwt'],
      },
    },
  };

  return NextResponse.json(oauthServerMetadata, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
