/**
 * Wraps an MCP capability handler to catch and log errors from user-provided callbacks.
 *
 * This prevents externally-registered capabilities (from plugin developers)
 * from crashing Strapi core when they throw during execution.
 *
 * Errors are:
 * - Logged with full detail (message + stack) via Strapi's logger
 * - Returned to the MCP client as a safe error response (no stack trace leak)
 */ const wrapSafeHandler = (handler, options)=>{
    const { strapi, capabilityType, name, createErrorResult } = options;
    return async (...args)=>{
        try {
            return await handler(...args);
        } catch (error) {
            const normalized = error instanceof Error ? error : new Error(String(error));
            strapi.log.error(`[MCP] ${capabilityType} "${name}" threw an error during execution: ${normalized.message}`, {
                error: normalized.message,
                stack: normalized.stack
            });
            return createErrorResult(normalized, args);
        }
    };
};

export { wrapSafeHandler };
//# sourceMappingURL=safeHandlerWrapper.mjs.map
