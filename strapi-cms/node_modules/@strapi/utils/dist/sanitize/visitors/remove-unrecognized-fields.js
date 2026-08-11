'use strict';

var contentTypes = require('../../content-types.js');

const removeUnrecognizedFields = ({ key, attribute, path, schema, parent, allowedExtraRootKeys }, { remove })=>{
    // We only look at properties that are not attributes
    if (attribute) {
        return;
    }
    // At root level (path.attribute === null), only accept id-like fields
    if (path.attribute === null) {
        if (contentTypes.ID_FIELDS.includes(key)) {
            return;
        }
        if (allowedExtraRootKeys?.includes(key)) {
            return;
        }
        remove(key);
        return;
    }
    // allow special morphTo keys
    if (contentTypes.isMorphToRelationalAttribute(parent?.attribute) && contentTypes.MORPH_TO_KEYS.includes(key)) {
        return;
    }
    // allow special dz keys
    if (contentTypes.isComponentSchema(schema) && contentTypes.isDynamicZoneAttribute(parent?.attribute) && contentTypes.DYNAMIC_ZONE_KEYS.includes(key)) {
        return;
    }
    // allow relation operation keys (connect, disconnect, set, options) for relations and media
    if ((contentTypes.isRelationalAttribute(parent?.attribute) || contentTypes.isMediaAttribute(parent?.attribute)) && contentTypes.RELATION_OPERATION_KEYS.includes(key)) {
        return;
    }
    // allow id fields for relations, media, and components
    const canUseID = contentTypes.isRelationalAttribute(parent?.attribute) || contentTypes.isMediaAttribute(parent?.attribute) || contentTypes.isComponentAttribute(parent?.attribute);
    if (canUseID && contentTypes.ID_FIELDS.includes(key)) {
        return;
    }
    // if we couldn't find any reason for it to be here, remove it
    remove(key);
};

module.exports = removeUnrecognizedFields;
//# sourceMappingURL=remove-unrecognized-fields.js.map
