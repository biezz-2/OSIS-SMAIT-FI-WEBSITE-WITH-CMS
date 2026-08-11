/**
 * Migration overview
 * ===================
 * 1. Create bare draft rows for every published entry, cloning scalar fields and join-column
 *    foreign keys (no components, dynamic zones, or join-table relations yet).
 *    We do this with a single INSERT … SELECT per content type to avoid touching the document service for every single v4 entry.
 *
 * 2. Rewire all relations so the newly created drafts behave exactly like calling `documentService.discardDraft()`
 *    on every published entry:
 *      - Join-table relations (self, manyToMany, etc.) are copied in bulk.
 *      - Foreign keys (joinColumn relations) are updated so draft rows point to draft targets.
 *      - Component relations are copied while respecting the discard logic: each draft gets its own component instance,
 *        and the component’s relations (including nested components) are remapped to draft targets.
 *
 * 3. Components are duplicated at the database layer (new component rows + join-table rows). We deliberately clone
 *    instead of sharing component IDs so that draft edits don’t mutate published data.
 *
 * Why we do it this way
 * ----------------------
 * • Efficiency: calling the document service per entry would issue several queries per relation/component. The SQL
 *   batches mirror the service’s behavior but execute in O(content types × batches), so the migration scales to
 *   millions of entries.

 * • Memory safety: any caches that track per-record information (component parent lookups, clone maps) are scoped to
 *   a single batch of 1,000 entries. Schema-level caches (component metadata, join table names) remain global because
 *   they’re tiny and reused.
 */
import type { Database, Migration } from '@strapi/database';
type DocumentVersion = {
    documentId: string;
    locale: string;
};
type Knex = Parameters<Migration['up']>[0];
/**
 * Load a batch of versions to discard.
 *
 * Versions with only a draft version will be ignored.
 * Only versions with a published version (which always have a draft version) will be discarded.
 */
export declare function getBatchToDiscard({ db, trx, uid, defaultBatchSize, }: {
    db: Database;
    trx: Knex;
    uid: string;
    defaultBatchSize?: number;
}): AsyncGenerator<DocumentVersion[], void, unknown>;
export declare const discardDocumentDrafts: Migration;
export {};
//# sourceMappingURL=5.0.0-discard-drafts.d.ts.map