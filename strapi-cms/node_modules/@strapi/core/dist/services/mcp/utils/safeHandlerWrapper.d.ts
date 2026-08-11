import type { Core } from '@strapi/types';
/**
 * Wraps an MCP capability handler to catch and log errors from user-provided callbacks.
 *
 * This prevents externally-registered capabilities (from plugin developers)
 * from crashing Strapi core when they throw during execution.
 *
 * Errors are:
 * - Logged with full detail (message + stack) via Strapi's logger
 * - Returned to the MCP client as a safe error response (no stack trace leak)
 */
export declare const wrapSafeHandler: <TArgs extends unknown[], TResult>(handler: (...args: TArgs) => Promise<TResult>, options: {
    strapi: Core.Strapi;
    capabilityType: string;
    name: string;
    createErrorResult: (error: Error, args: TArgs) => TResult;
}) => ((...args: TArgs) => Promise<TResult>);
//# sourceMappingURL=safeHandlerWrapper.d.ts.map