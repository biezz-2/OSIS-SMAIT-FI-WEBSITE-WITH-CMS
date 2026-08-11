import { ALLOWED_QUERY_PARAM_KEYS } from './content-api-constants.mjs';

/** Extra query param keys from the route's request.query (excluding core ALLOWED_QUERY_PARAM_KEYS). */ function getExtraQueryKeysFromRoute(route) {
    if (!route?.request?.query) return [];
    const coreKeys = new Set(ALLOWED_QUERY_PARAM_KEYS);
    return Object.keys(route.request.query).filter((key)=>!coreKeys.has(key));
}
/** Root-level keys from the route's request.body['application/json'] schema shape (for Zod object schemas). */ function getExtraRootKeysFromRouteBody(route) {
    const bodySchema = route?.request?.body?.['application/json'];
    if (!bodySchema || typeof bodySchema !== 'object') return [];
    if ('shape' in bodySchema && typeof bodySchema.shape === 'object') {
        return Object.keys(bodySchema.shape);
    }
    return [];
}

export { getExtraQueryKeysFromRoute, getExtraRootKeysFromRouteBody };
//# sourceMappingURL=content-api-route-params.mjs.map
