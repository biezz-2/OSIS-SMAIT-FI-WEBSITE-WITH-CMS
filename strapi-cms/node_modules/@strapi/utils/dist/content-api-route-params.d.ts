import type { z } from 'zod/v4';
/**
 * Minimal route shape used by sanitize/validate to derive allowed extra query/input params
 * from the route's request schema. When present, extra keys are taken from route.request.query
 * / route.request.body and validated or sanitized with Zod.
 */
export interface RouteLike {
    request?: {
        query?: Record<string, z.ZodTypeAny>;
        body?: Record<string, z.ZodTypeAny>;
    };
}
/** Extra query param keys from the route's request.query (excluding core ALLOWED_QUERY_PARAM_KEYS). */
export declare function getExtraQueryKeysFromRoute(route?: RouteLike): string[];
/** Root-level keys from the route's request.body['application/json'] schema shape (for Zod object schemas). */
export declare function getExtraRootKeysFromRouteBody(route?: RouteLike): string[];
//# sourceMappingURL=content-api-route-params.d.ts.map