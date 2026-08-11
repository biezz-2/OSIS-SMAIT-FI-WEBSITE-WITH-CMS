import { contentTypes, buildPublicationFilterWhere } from '@strapi/utils';
export { parsePublicationFilter } from '@strapi/utils';

const getPublicationFilterCondition = (uid, mode, status)=>{
    const model = strapi.getModel(uid);
    if (!model || !contentTypes.hasDraftAndPublish(model)) {
        return null;
    }
    const knex = strapi.db.connection;
    const meta = strapi.db.metadata.get(uid);
    return buildPublicationFilterWhere(knex, meta, model, mode, status);
};

export { getPublicationFilterCondition };
//# sourceMappingURL=publication-filter.mjs.map
