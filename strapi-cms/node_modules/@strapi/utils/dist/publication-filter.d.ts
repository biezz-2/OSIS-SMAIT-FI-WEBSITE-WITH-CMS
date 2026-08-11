import type { Model } from './types';
export type PublicationFilterMode = 'never-published' | 'has-published-version' | 'modified' | 'unmodified' | 'never-published-document' | 'has-published-version-document' | 'published-without-draft' | 'published-with-draft';
export declare const parsePublicationFilter: (value: unknown) => PublicationFilterMode | undefined;
/**
 * Validates a `publicationFilter` query value for Content API `validate.query` / `sanitize.query`.
 * Attaches `details.source` and `details.param` so HTTP layer maps to 400 with correct field context.
 */
export declare const validatePublicationFilterQueryParam: (value: unknown) => void;
/**
 * Extra `id IN (subquery)` filter for publicationFilter, scoped to (documentId, locale) when i18n is enabled.
 * Document-scoped modes use `documentId` only. Returns null when the model does not use draft & publish.
 */
export declare const buildPublicationFilterWhere: (knex: any, meta: any, model: Model | undefined, mode: PublicationFilterMode, status: "draft" | "published") => Record<string, unknown> | null;
//# sourceMappingURL=publication-filter.d.ts.map