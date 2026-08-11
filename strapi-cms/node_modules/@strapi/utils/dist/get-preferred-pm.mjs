let cached;
/** Loads preferred-pm v5 via dynamic import (CJS-safe) and caches the named export. */ async function getPreferredPM() {
    cached ?? (cached = import('preferred-pm').then((m)=>m.preferredPM));
    return cached;
}

export { getPreferredPM };
//# sourceMappingURL=get-preferred-pm.mjs.map
