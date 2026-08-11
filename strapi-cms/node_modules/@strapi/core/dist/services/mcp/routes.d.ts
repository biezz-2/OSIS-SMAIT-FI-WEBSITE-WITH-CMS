import type { Core } from '@strapi/types';
import { McpConfiguration } from './internal/McpConfiguration';
export type McpRouteHandlers = {
    handlePost: Core.MiddlewareHandler;
};
/**
 * Creates MCP route definitions for registration with Strapi server.
 * @internal
 */
export declare const createMcpRoutes: (config: McpConfiguration, handlers: McpRouteHandlers) => Omit<Core.Route, "info">[];
//# sourceMappingURL=routes.d.ts.map