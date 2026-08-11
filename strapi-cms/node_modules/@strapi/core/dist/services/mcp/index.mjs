import { createMcpAdminTokenAuthenticator } from './authentication.mjs';
import { createPostHandler } from './handlers/handlePost.mjs';
import { McpCapabilityDefinitionRegistry } from './internal/McpCapabilityDefinitionRegistry.mjs';
import { McpConfiguration } from './internal/McpConfiguration.mjs';
import { createMcpServerWithRegistries } from './internal/McpServerFactory.mjs';
import { createOAuthDiscoveryFallbackMiddleware } from './middleware/oauthDiscoveryFallback.mjs';
import { createMcpRoutes } from './routes.mjs';
import { sendDidStartMcpServer } from './metrics/metrics.mjs';
import { logToolDefinition } from './tools/log.mjs';

/**
 * Creates an MCP service instance for Strapi Core
 */ const createMcpService = (strapi)=>{
    // Initialize configuration
    const config = new McpConfiguration(strapi);
    const authenticationStrategy = createMcpAdminTokenAuthenticator(strapi);
    // Status tracking
    let serverStatus = 'idle';
    // Definition registries
    const toolDefinitions = new McpCapabilityDefinitionRegistry('tool');
    const promptDefinitions = new McpCapabilityDefinitionRegistry('prompt');
    const resourceDefinitions = new McpCapabilityDefinitionRegistry('resource');
    // Prepare handler dependencies
    const handlerDependencies = {
        strapi,
        authenticationStrategy,
        config,
        createServerWithRegistries: createMcpServerWithRegistries,
        capabilityDefinitions: {
            tools: toolDefinitions,
            prompts: promptDefinitions,
            resources: resourceDefinitions
        }
    };
    // Create HTTP handlers
    const handlePost = createPostHandler(handlerDependencies);
    const service = {
        isEnabled () {
            return config.isEnabled();
        },
        isRunning () {
            return serverStatus === 'running';
        },
        registerTool (tool) {
            if (serverStatus !== 'idle') {
                throw new Error('[MCP] Cannot register tools after the MCP server has started.');
            }
            toolDefinitions.define(tool);
        },
        registerPrompt (prompt) {
            if (serverStatus !== 'idle') {
                throw new Error('[MCP] Cannot register prompts after the MCP server has started.');
            }
            promptDefinitions.define(prompt);
        },
        registerResource (resource) {
            if (serverStatus !== 'idle') {
                throw new Error('[MCP] Cannot register resources after the MCP server has started.');
            }
            resourceDefinitions.define(resource);
        },
        async start () {
            if (service.isEnabled() === false) {
                strapi.log.debug('[MCP] Server is disabled');
                return;
            }
            if (serverStatus === 'error') {
                throw new Error('[MCP] Cannot start server: previous error state');
            }
            if (serverStatus !== 'idle') {
                throw new Error(`[MCP] Server already started or starting (status: ${serverStatus})`);
            }
            serverStatus = 'starting';
            strapi.server.use(createOAuthDiscoveryFallbackMiddleware());
            const routes = createMcpRoutes(config, {
                handlePost
            });
            strapi.server.routes(routes);
            serverStatus = 'running';
            sendDidStartMcpServer(strapi, {
                path: config.path,
                numberOfTools: toolDefinitions.size,
                numberOfPrompts: promptDefinitions.size,
                numberOfResources: resourceDefinitions.size
            });
            const baseUrl = strapi.config.get('server.url', 'http://localhost:1337');
            strapi.log.info(`[MCP] Server available at ${baseUrl}${config.path}`);
        },
        async stop () {
            serverStatus = 'idle';
            strapi.log.info('[MCP] Service stopped');
        }
    };
    service.registerTool(logToolDefinition);
    return service;
};

export { createMcpService };
//# sourceMappingURL=index.mjs.map
