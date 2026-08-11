'use strict';

var authentication = require('./authentication.js');
var handlePost = require('./handlers/handlePost.js');
var McpCapabilityDefinitionRegistry = require('./internal/McpCapabilityDefinitionRegistry.js');
var McpConfiguration = require('./internal/McpConfiguration.js');
var McpServerFactory = require('./internal/McpServerFactory.js');
var oauthDiscoveryFallback = require('./middleware/oauthDiscoveryFallback.js');
var routes = require('./routes.js');
var metrics = require('./metrics/metrics.js');
var log = require('./tools/log.js');

/**
 * Creates an MCP service instance for Strapi Core
 */ const createMcpService = (strapi)=>{
    // Initialize configuration
    const config = new McpConfiguration.McpConfiguration(strapi);
    const authenticationStrategy = authentication.createMcpAdminTokenAuthenticator(strapi);
    // Status tracking
    let serverStatus = 'idle';
    // Definition registries
    const toolDefinitions = new McpCapabilityDefinitionRegistry.McpCapabilityDefinitionRegistry('tool');
    const promptDefinitions = new McpCapabilityDefinitionRegistry.McpCapabilityDefinitionRegistry('prompt');
    const resourceDefinitions = new McpCapabilityDefinitionRegistry.McpCapabilityDefinitionRegistry('resource');
    // Prepare handler dependencies
    const handlerDependencies = {
        strapi,
        authenticationStrategy,
        config,
        createServerWithRegistries: McpServerFactory.createMcpServerWithRegistries,
        capabilityDefinitions: {
            tools: toolDefinitions,
            prompts: promptDefinitions,
            resources: resourceDefinitions
        }
    };
    // Create HTTP handlers
    const handlePost$1 = handlePost.createPostHandler(handlerDependencies);
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
            strapi.server.use(oauthDiscoveryFallback.createOAuthDiscoveryFallbackMiddleware());
            const routes$1 = routes.createMcpRoutes(config, {
                handlePost: handlePost$1
            });
            strapi.server.routes(routes$1);
            serverStatus = 'running';
            metrics.sendDidStartMcpServer(strapi, {
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
    service.registerTool(log.logToolDefinition);
    return service;
};

exports.createMcpService = createMcpService;
//# sourceMappingURL=index.js.map
