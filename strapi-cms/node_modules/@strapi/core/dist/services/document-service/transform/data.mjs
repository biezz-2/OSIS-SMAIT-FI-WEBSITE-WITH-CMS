import { createIdMap } from './id-map.mjs';
import { extractDataIds } from './relations/extract/data-ids.mjs';
import { transformDataIdsVisitor } from './relations/transform/data-ids.mjs';
import { setDefaultLocaleToRelations } from './relations/transform/default-locale.mjs';

const getRequestState = ()=>strapi.requestContext?.get?.()?.state;
const clearTransformDataRequestCache = ()=>{
    getRequestState()?.__documentServiceIdMap?.clear();
};
/**
 * Transforms input data, containing relation document ids, to entity ids.
 */ const transformData = async (data, opts)=>{
    const shouldUseRequestCache = opts.useRequestCache !== false;
    // Store cache on request state so repeated calls in one request can reuse it
    const requestState = shouldUseRequestCache ? getRequestState() : undefined;
    if (requestState && !requestState.__documentServiceIdMap) {
        requestState.__documentServiceIdMap = createIdMap({
            strapi
        });
    }
    const idMap = requestState?.__documentServiceIdMap ?? createIdMap({
        strapi
    });
    // Assign default locales
    const transformedData = await setDefaultLocaleToRelations(data, opts.uid);
    // Extract any relation ids from the input
    await extractDataIds(idMap, transformedData, opts);
    // Load any relation the extract methods found
    await idMap.load();
    // Transform any relation ids to entity ids
    return transformDataIdsVisitor(idMap, transformedData, opts);
};

export { clearTransformDataRequestCache, transformData };
//# sourceMappingURL=data.mjs.map
