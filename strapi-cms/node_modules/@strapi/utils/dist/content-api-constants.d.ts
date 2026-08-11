/**
 * Param keys shared by the Content API (query) and the document service (query building).
 * Add new shared params here only; both ALLOWED_QUERY_PARAM_KEYS and ALLOWED_DOCUMENT_PARAM_KEYS derive from this.
 */
export declare const SHARED_QUERY_PARAM_KEYS: readonly ["filters", "sort", "fields", "populate", "status", "locale", "page", "pageSize", "start", "limit", "_q", "publicationFilter", "hasPublishedVersion"];
/**
 * Core query param keys allowed by the Content API (validate/sanitize query).
 * Used when strictParams is true. User code and plugins can add additional keys via contentAPI.addQueryParams.
 * = SHARED_QUERY_PARAM_KEYS + Content API–only keys (pagination, count, ordering).
 */
export declare const ALLOWED_QUERY_PARAM_KEYS: readonly ["filters", "sort", "fields", "populate", "status", "locale", "page", "pageSize", "start", "limit", "_q", "publicationFilter", "hasPublishedVersion", "pagination", "count", "ordering"];
/**
 * Root-level body.data keys reserved for core (id, documentId).
 * These cannot be added as custom input params via contentAPI.addInputParams.
 */
export declare const RESERVED_INPUT_PARAM_KEYS: readonly [string, string];
//# sourceMappingURL=content-api-constants.d.ts.map