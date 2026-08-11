'use strict';

var contentTypes = require('../../content-types.js');
var utils = require('../utils.js');

const throwUnrecognizedFields = ({ key, attribute, path, schema, parent, allowedExtraRootKeys }, // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Visitor type requires second param
_visitorUtils)=>{
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
        return utils.throwInvalidKey({
            key,
            path: path.attribute
        });
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
    // if we couldn't find any reason for it to be here, throw
    utils.throwInvalidKey({
        key,
        path: path.attribute
    });
};

module.exports = throwUnrecognizedFields;
//# sourceMappingURL=throw-unrecognized-fields.js.map
