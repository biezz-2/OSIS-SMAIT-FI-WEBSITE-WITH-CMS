import { Relation } from './types';
/**
 * "Relates to one" fields hold a single entry. If a caller passes more
 * than one, keep the last. Runs on the user-provided payload only — never
 * on the internal draft/published expansion that happens later.
 */
export declare const normalizeXToOneRelationValue: (attribute: any, value: Relation) => Relation;
//# sourceMappingURL=xto-one.d.ts.map