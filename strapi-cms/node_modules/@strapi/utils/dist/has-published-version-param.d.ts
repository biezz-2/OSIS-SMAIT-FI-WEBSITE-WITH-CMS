import type { PublicationFilterMode } from './publication-filter';
/**
 * Parses the deprecated `hasPublishedVersion` query param (REST boolean or "true"/"false" strings).
 * @deprecated Prefer `publicationFilter` with document-scoped modes.
 */
export declare const parseHasPublishedVersionQueryParam: (value: unknown) => boolean | undefined;
/** Maps legacy boolean to the document-scoped `publicationFilter` cohorts (same semantics as the old subquery). */
export declare const hasPublishedVersionBooleanToPublicationFilterMode: (value: boolean) => Extract<PublicationFilterMode, "never-published-document" | "has-published-version-document">;
//# sourceMappingURL=has-published-version-param.d.ts.map