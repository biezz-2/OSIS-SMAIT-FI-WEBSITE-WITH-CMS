'use strict';

var strapiUtils = require('@strapi/utils');

const getPublicationFilterCondition = (uid, mode, status)=>{
    const model = strapi.getModel(uid);
    if (!model || !strapiUtils.contentTypes.hasDraftAndPublish(model)) {
        return null;
    }
    const knex = strapi.db.connection;
    const meta = strapi.db.metadata.get(uid);
    return strapiUtils.buildPublicationFilterWhere(knex, meta, model, mode, status);
};

Object.defineProperty(exports, "parsePublicationFilter", {
  enumerable: true,
  get: function () { return strapiUtils.parsePublicationFilter; }
});
exports.getPublicationFilterCondition = getPublicationFilterCondition;
//# sourceMappingURL=publication-filter.js.map
