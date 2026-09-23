# Strapi MCP — Cursor & Claude Code (OSIS)

Built-in MCP server (Strapi ≥ 5.47, OSIS uses **5.51**). Endpoint: `POST /mcp`.

## What it can do

- CRUD + publish/unpublish on content-types (scoped by **Admin token** permissions)
- Media Library metadata / folders (no binary upload via MCP)
- Audit log entries with `origin: mcp`

## What it cannot do

- Content-Type Builder / schema / config code
- Upload new media files (upload in Admin first, then reference)
- Nested populate on list/get

## Enable (server)

[`strapi-cms/config/server.ts`](../../strapi-cms/config/server.ts):

```ts
mcp: {
  enabled: env.bool('MCP_ENABLED', true),
  connectTimeoutMs: env.int('MCP_CONNECT_TIMEOUT_MS', 10000),
  requestTimeoutMs: env.int('MCP_REQUEST_TIMEOUT_MS', 120000),
},
```

Restart Strapi (`pm2 restart osis-strapi-backend` after build if production).

## Admin token (required)

MCP rejects Content-API tokens. Use an **Admin token**.

```bash
cd strapi-cms
# uses STRAPI_ADMIN_EMAIL / STRAPI_ADMIN_PASSWORD + STRAPI_URL from .env
npm run mcp:token:rotate
```

- Default scope `content`: visitor CTs only (no MUBES / inbox / telemetri / akses-user).
- Token plaintext written once to `~/.config/agoraacta/strapi-mcp.token` (mode 600). **Never commit.**

## Claude Code (this server)

```bash
TOKEN=$(cat ~/.config/agoraacta/strapi-mcp.token)
claude mcp remove strapi-mcp 2>/dev/null || true
claude mcp add strapi-mcp --transport http http://127.0.0.1:1337/mcp \
  -H "Authorization: Bearer ${TOKEN}"
# then: claude  →  /mcp
```

Use production URL only if you intentionally expose MCP with a locked-down token:

`https://osisstrapi.biezz.my.id/mcp`

## Cursor

User or project MCP config (example — substitute real token from the token file):

```json
{
  "mcpServers": {
    "strapi-mcp": {
      "type": "streamable-http",
      "url": "http://127.0.0.1:1337/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_ADMIN_TOKEN"
      }
    }
  }
}
```

Template (no secret): [`docs/guides/strapi-mcp.cursor.example.json`](./strapi-mcp.cursor.example.json)

Reload Cursor MCP after saving.

## Smoke test

1. `curl -sS -X POST http://127.0.0.1:1337/mcp -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}'`
2. In Claude/Cursor: “List 5 artikel-mading terbaru”.
3. Confirm MUBES tools are **absent** with default content token.

## Security

- Prefer `127.0.0.1` for agents on this VPS.
- Rotate token after leakage: `npm run mcp:token:rotate`.
- For MUBES work, create a separate short-lived Admin token in the Admin panel; revoke after.
