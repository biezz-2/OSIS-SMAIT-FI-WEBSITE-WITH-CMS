import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  url: env('PUBLIC_URL', env('URL', 'https://osisstrapi.biezz.my.id')),
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Built-in MCP (Content Manager + Media Library). Auth: Admin token Bearer.
  // Docs: https://docs.strapi.io/cms/features/strapi-mcp-server
  mcp: {
    enabled: env.bool('MCP_ENABLED', true),
    connectTimeoutMs: env.int('MCP_CONNECT_TIMEOUT_MS', 10000),
    requestTimeoutMs: env.int('MCP_REQUEST_TIMEOUT_MS', 120000),
  },
});

export default config;
