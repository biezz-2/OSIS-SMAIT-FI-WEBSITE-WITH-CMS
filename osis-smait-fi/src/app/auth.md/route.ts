import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

const authMdContent = `# auth.md - OSIS SMAIT Fithrah Insani AI Agent Authentication

Welcome to the official AI Agent interface for OSIS SMAIT Fithrah Insani (Agora Acta).

## Audience
This document is intended for autonomous AI agents, crawlers, and LLM-powered services interacting with the OSIS SMAIT Fithrah Insani portal and API ecosystem.

## Machine-Readable Discovery
- **API Catalog**: [/.well-known/api-catalog](https://osissmaitfi.biezz.my.id/.well-known/api-catalog) (RFC 9727)
- **OpenAPI 3.1 Spec**: [/openapi.json](https://osissmaitfi.biezz.my.id/openapi.json)
- **A2A Agent Card**: [/.well-known/agent-card.json](https://osissmaitfi.biezz.my.id/.well-known/agent-card.json)
- **Agent Skills Index**: [/.well-known/agent-skills/index.json](https://osissmaitfi.biezz.my.id/.well-known/agent-skills/index.json)
- **MCP Server Card**: [/.well-known/mcp/server-card.json](https://osissmaitfi.biezz.my.id/.well-known/mcp/server-card.json)
- **OAuth Protected Resource Metadata (PRM)**: [/.well-known/oauth-protected-resource](https://osissmaitfi.biezz.my.id/.well-known/oauth-protected-resource) (RFC 9728)
- **OAuth Authorization Server Metadata**: [/.well-known/oauth-authorization-server](https://osissmaitfi.biezz.my.id/.well-known/oauth-authorization-server) (RFC 8414)

## Authentication Methods
Public read endpoints (/api/events, /api/program-kerja, /api/health) require no authentication.

Protected or rate-limit exempt agents can authenticate via:
1. **Bearer Token (RFC 6750)**: Send Authorization: Bearer <token> in request headers.
2. **Anonymous Agent Access**: Allowed for read-only public queries with User-Agent identification.
3. **ID-JAG Assertion**: Supported via OAuth token exchange.

## Scopes Supported
- read:public - Read public agendas, news, and school activities
- read:events - Read event calendar and competitions
- read:proker - Read work program schedules and status
- write:aspirasi - Submit public feedback/aspirations via /api/inbox

## Contact & Governance
- Organization: OSIS SMAIT Fithrah Insani (Agora Acta)
- Website: https://osissmaitfi.biezz.my.id
`;

export async function GET() {
  return new NextResponse(authMdContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
