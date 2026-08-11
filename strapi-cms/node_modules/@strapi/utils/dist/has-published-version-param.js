'use strict';

var errors = require('./errors.js');

/**
 * Parses the deprecated `hasPublishedVersion` query param (REST boolean or "true"/"false" strings).
 * @deprecated Prefer `publicationFilter` with document-scoped modes.
 */ const parseHasPublishedVersionQueryParam = (value)=>{
    if (value === undefined || value === null) {
        return undefined;
    }
    if (value === true || value === 'true') {
        return true;
    }
    if (value === false || value === 'false') {
        return false;
    }
    throw new errors.ValidationError("Invalid value for 'hasPublishedVersion'. Expected boolean or 'true'/'false' string.");
};
/** Maps legacy boolean to the document-scoped `publicationFilter` cohorts (same semantics as the old subquery). */ const hasPublishedVersionBooleanToPublicationFilterMode = (value)=>value ? 'has-published-version-document' : 'never-published-document';

exports.hasPublishedVersionBooleanToPublicationFilterMode = hasPublishedVersionBooleanToPublicationFilterMode;
exports.parseHasPublishedVersionQueryParam = parseHasPublishedVersionQueryParam;
//# sourceMappingURL=has-published-version-param.js.map
