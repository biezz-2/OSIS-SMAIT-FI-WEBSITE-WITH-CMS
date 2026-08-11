const deepPopulateCache = new Map();
// We want to build a populate object based on the schema
const getDeepPopulate = (uid, opts = {})=>{
    const cacheKey = `${uid}::${JSON.stringify(opts)}`;
    const cached = deepPopulateCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    const model = strapi.getModel(uid);
    const attributes = Object.entries(model.attributes);
    const result = attributes.reduce((acc, [attributeName, attribute])=>{
        switch(attribute.type){
            case 'relation':
                {
                    if ('unstable_virtual' in attribute && attribute.unstable_virtual) {
                        break;
                    }
                    // Include all relations except the onces not managed by the DB layer.
                    acc[attributeName] = {
                        select: opts.relationalFields
                    };
                    break;
                }
            case 'media':
                {
                    // We populate all media fields for completeness of webhook responses
                    // see https://github.com/strapi/strapi/issues/21546
                    acc[attributeName] = {
                        select: [
                            '*'
                        ]
                    };
                    break;
                }
            case 'component':
                {
                    const populate = getDeepPopulate(attribute.component, opts);
                    acc[attributeName] = {
                        populate
                    };
                    break;
                }
            case 'dynamiczone':
                {
                    // Use fragments to populate the dynamic zone components
                    const populatedComponents = (attribute.components || []).reduce((acc, componentUID)=>{
                        acc[componentUID] = {
                            populate: getDeepPopulate(componentUID, opts)
                        };
                        return acc;
                    }, {});
                    acc[attributeName] = {
                        on: populatedComponents
                    };
                    break;
                }
        }
        return acc;
    }, {});
    deepPopulateCache.set(cacheKey, result);
    return result;
};

export { getDeepPopulate };
//# sourceMappingURL=populate.mjs.map
