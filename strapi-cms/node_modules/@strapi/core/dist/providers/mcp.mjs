import { defineProvider } from './provider.mjs';
import { createMcpService } from '../services/mcp/index.mjs';

var mcp = defineProvider({
    init (strapi) {
        strapi.add('ai.mcp', ()=>createMcpService(strapi));
    },
    async bootstrap (strapi) {
        if (strapi.ai.mcp.isEnabled()) {
            try {
                strapi.log.info('[MCP] Starting MCP server...');
                await strapi.ai.mcp.start();
            } catch (error) {
                strapi.log.error('[MCP] Failed to start MCP server', {
                    error
                });
            }
        } else {
            strapi.log.debug('[MCP] MCP server is disabled in configuration');
        }
    },
    async destroy (strapi) {
        if (strapi.ai.mcp.isRunning()) {
            try {
                strapi.log.info('[MCP] Stopping MCP server...');
                await strapi.ai.mcp.stop();
            } catch (error) {
                strapi.log.error('[MCP] Failed to stop MCP server', {
                    error
                });
            }
        }
    }
});

export { mcp as default };
//# sourceMappingURL=mcp.mjs.map
