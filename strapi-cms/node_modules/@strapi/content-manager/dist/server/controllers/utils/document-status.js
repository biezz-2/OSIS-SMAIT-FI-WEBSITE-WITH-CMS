'use strict';

/**
 * Index items by documentId for lookup
 *
 * @param items - Array of items with documentId property
 * @returns Map of documentId -> items array
 */ const indexByDocumentId = (items)=>{
    const map = new Map();
    for (const item of items){
        const key = item.documentId;
        if (!key) {
            continue;
        }
        const existing = map.get(key);
        if (existing) {
            existing.push(item);
        } else {
            map.set(key, [
                item
            ]);
        }
    }
    return map;
};

exports.indexByDocumentId = indexByDocumentId;
//# sourceMappingURL=document-status.js.map
