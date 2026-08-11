export declare const CSP_DEFAULTS: {
    readonly 'connect-src': readonly ["'self'", "https:"];
    readonly 'img-src': readonly ["'self'", "data:", "blob:", "https://market-assets.strapi.io"];
    readonly 'media-src': readonly ["'self'", "data:", "blob:"];
};
/**
 * Utility to extend Strapi middleware configuration. Mainly used to extend the CSP directives from the security middleware.
 *
 * @param middlewares - Array of middleware configurations
 * @param middleware - Middleware configuration to merge/add
 * @returns Modified middlewares array with the new configuration merged
 */
export declare const extendMiddlewareConfiguration: (middlewares: (string | {
    name?: string;
    config?: any;
})[], middleware: {
    name: string;
    config?: any;
}) => (string | {
    name?: string;
    config?: any;
})[];
//# sourceMappingURL=security.d.ts.map