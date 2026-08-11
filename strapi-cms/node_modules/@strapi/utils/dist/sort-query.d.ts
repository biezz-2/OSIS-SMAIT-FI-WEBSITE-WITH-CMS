export type SortOrder = 'asc' | 'desc';
export interface SortParamsObject {
    [key: string]: SortOrder | SortParamsObject;
}
export type SortParams = string | string[] | SortParamsObject | SortParamsObject[];
/**
 * Splits a REST sort string into trimmed segments with a non-empty field (drops '', ',', trailing commas).
 */
export declare function getMeaningfulSortSegments(sort: string): string[];
/**
 * Whether `sort` carries a real ordering instruction. Empty or absent sort must stay undefined so
 * populated relations keep join-table connect order (GraphQL defaults nested sort to []; REST qs
 * `sort[]` with strictNullHandling parses to `[null]`).
 */
export declare function hasSort(sort?: unknown): sort is SortParams;
//# sourceMappingURL=sort-query.d.ts.map