import type { Model } from './types';
/**
 * Model cache to prevent redundant getModel() calls during populate traversal.
 *
 * Models don't change at runtime (changes require server restart), so caching
 * is safe. Current scoping (per-request) provides isolation and predictable
 * memory behavior.
 */
/**
 * Creates cache for getModel() calls.
 *
 * @param getModelFn - The underlying getModel function to cache
 * @returns An object with cached getModel function and clear method
 */
export declare const createModelCache: (getModelFn: (uid: any) => Model) => {
    getModel(uid: any): Model;
    clear(): void;
};
//# sourceMappingURL=model-cache.d.ts.map