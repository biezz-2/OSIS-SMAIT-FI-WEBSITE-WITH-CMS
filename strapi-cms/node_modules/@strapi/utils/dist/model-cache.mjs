/**
 * Model cache to prevent redundant getModel() calls during populate traversal.
 *
 * Models don't change at runtime (changes require server restart), so caching
 * is safe. Current scoping (per-request) provides isolation and predictable
 * memory behavior.
 */ /**
 * Creates cache for getModel() calls.
 *
 * @param getModelFn - The underlying getModel function to cache
 * @returns An object with cached getModel function and clear method
 */ const createModelCache = (getModelFn)=>{
    const cache = new Map();
    return {
        getModel (uid) {
            const cached = cache.get(uid);
            if (cached) {
                return cached;
            }
            const model = getModelFn(uid);
            cache.set(uid, model);
            return model;
        },
        clear () {
            cache.clear();
        }
    };
};

export { createModelCache };
//# sourceMappingURL=model-cache.mjs.map
