'use strict';

var sendJsonRpcError = require('./utils/sendJsonRpcError.js');

/**
 * Handler for unsupported HTTP methods on /mcp endpoint.
 * Returns JSON-RPC error instead of plain text so MCP clients can parse it.
 */ const handleMethodNotAllowed = async (ctx)=>{
    // Opt out of Koa's response phase — sendJsonRpcError writes directly to ctx.res.
    ctx.respond = false;
    // ctx.set() writes to Koa's in-memory headers which are never flushed when ctx.respond = false.
    // Use res.setHeader() so the header is included when sendJsonRpcError calls res.writeHead().
    ctx.res.setHeader('Allow', 'POST');
    sendJsonRpcError.sendJsonRpcError(ctx.res, 'METHOD_NOT_ALLOWED');
};
/**
 * Creates MCP route definitions for registration with Strapi server.
 * @internal
 */ const createMcpRoutes = (config, handlers)=>{
    const noAuth = {
        auth: false
    };
    return [
        {
            method: 'POST',
            path: config.path,
            handler: handlers.handlePost,
            config: noAuth
        },
        {
            method: 'GET',
            path: config.path,
            handler: handleMethodNotAllowed,
            config: noAuth
        },
        {
            method: 'DELETE',
            path: config.path,
            handler: handleMethodNotAllowed,
            config: noAuth
        },
        {
            method: 'PUT',
            path: config.path,
            handler: handleMethodNotAllowed,
            config: noAuth
        },
        {
            method: 'PATCH',
            path: config.path,
            handler: handleMethodNotAllowed,
            config: noAuth
        }
    ];
};

exports.createMcpRoutes = createMcpRoutes;
//# sourceMappingURL=routes.js.map
