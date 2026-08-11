import { GenericEndpointContext } from "@better-auth/core";
//#region src/api/middlewares/origin-check.d.ts
/**
 * A middleware to validate callbackURL and origin against trustedOrigins.
 * Also handles CSRF protection using Fetch Metadata for first-login scenarios.
 */
declare const originCheckMiddleware: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
declare const originCheck: (getValue: (ctx: GenericEndpointContext) => string | string[]) => (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
/**
 * Middleware for CSRF protection using Fetch Metadata headers.
 * This prevents cross-site navigation login attacks while supporting progressive enhancement.
 */
declare const formCsrfMiddleware: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
//#endregion
export { formCsrfMiddleware, originCheck, originCheckMiddleware };