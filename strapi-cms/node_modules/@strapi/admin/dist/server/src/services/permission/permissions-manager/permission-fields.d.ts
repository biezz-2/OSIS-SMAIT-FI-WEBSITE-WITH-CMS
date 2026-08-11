import type { Ability } from '@casl/ability';
export interface PermissionFieldsResult {
    permittedFields: string[];
    hasAtLeastOneRegistered: boolean;
    shouldIncludeAll: boolean;
}
/**
 * Creates a cached permission fields calculator for a given CASL ability.
 *
 * The cache stores permission field calculations per action+subjectType combination.
 * Results are only cached when rules have no entity-specific conditions, as those
 * must be computed per entity.
 *
 * @param ability - The CASL ability instance to use for permission checks
 * @returns Object with getPermissionFields function and cache
 */
export declare const createPermissionFieldsCache: (ability: Ability) => {
    getPermissionFields: (actionOverride: string, subject: any) => PermissionFieldsResult;
    clearCache: () => void;
};
//# sourceMappingURL=permission-fields.d.ts.map