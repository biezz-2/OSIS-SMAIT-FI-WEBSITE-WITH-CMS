'use strict';

var contentTypes = require('./content-types.js');

/**
 * Param keys shared by the Content API (query) and the document service (query building).
 * Add new shared params here only; both ALLOWED_QUERY_PARAM_KEYS and ALLOWED_DOCUMENT_PARAM_KEYS derive from this.
 */ const SHARED_QUERY_PARAM_KEYS = [
    'filters',
    'sort',
    'fields',
    'populate',
    'status',
    'locale',
    'page',
    'pageSize',
    'start',
    'limit',
    '_q',
    'publicationFilter',
    // Deprecated: replaced by `publicationFilter` for richer cohorts; kept for backward compatibility.
    'hasPublishedVersion'
];
/**
 * Core query param keys allowed by the Content API (validate/sanitize query).
 * Used when strictParams is true. User code and plugins can add additional keys via contentAPI.addQueryParams.
 * = SHARED_QUERY_PARAM_KEYS + Content API–only keys (pagination, count, ordering).
 */ const ALLOWED_QUERY_PARAM_KEYS = [
    ...SHARED_QUERY_PARAM_KEYS,
    'pagination',
    'count',
    'ordering'
];
/**
 * Root-level body.data keys reserved for core (id, documentId).
 * These cannot be added as custom input params via contentAPI.addInputParams.
 */ const RESERVED_INPUT_PARAM_KEYS = [
    contentTypes.constants.ID_ATTRIBUTE,
    contentTypes.constants.DOC_ID_ATTRIBUTE
];

exports.ALLOWED_QUERY_PARAM_KEYS = ALLOWED_QUERY_PARAM_KEYS;
exports.RESERVED_INPUT_PARAM_KEYS = RESERVED_INPUT_PARAM_KEYS;
exports.SHARED_QUERY_PARAM_KEYS = SHARED_QUERY_PARAM_KEYS;
//# sourceMappingURL=content-api-constants.js.map
