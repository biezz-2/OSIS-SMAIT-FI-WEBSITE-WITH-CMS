import type { Data, UID } from '@strapi/types';
import type { JoinTable } from '@strapi/database';
interface VersionEntry {
    id: Data.ID;
    locale: string;
}
interface RelationData {
    joinTable: JoinTable;
    relations: Record<string, unknown>[];
    remap?: {
        source: boolean;
        target: boolean;
    };
}
type TargetStatus = 'draft' | 'published';
/**
 * Preserves self-referential relations during publish/discard operations.
 *
 * When publishing or discarding a draft, self-referential relations (where both sides
 * of the relation belong to the same content type) are lost because:
 *
 * 1. The old entry is deleted
 * 2. A new entry is created with relations resolved via documentId → entity ID mapping
 * 3. At mapping time, the old entity is already deleted and the new one doesn't exist yet
 * 4. The relation is silently dropped
 *
 * This utility:
 * 1. Captures self-referential join table rows before deletion
 * 2. Remaps old entity IDs to new entity IDs after creation
 * 3. Inserts the remapped relations
 */
/**
 * Loads self-referential relations from source entries before they are deleted/recreated.
 */
declare const load: (uid: UID.ContentType, sourceEntries: VersionEntry[], targetStatus: TargetStatus) => Promise<RelationData[]>;
/**
 * Syncs self-referential relations by remapping old entry IDs to new entry IDs
 * and inserting the remapped relations into the join table.
 */
declare const sync: (sourceEntries: VersionEntry[], targetEntries: VersionEntry[], relationData: RelationData[]) => Promise<void>;
export { load, sync };
//# sourceMappingURL=self-referential-relations.d.ts.map