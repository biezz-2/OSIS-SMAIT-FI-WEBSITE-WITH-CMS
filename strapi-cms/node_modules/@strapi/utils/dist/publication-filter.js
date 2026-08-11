'use strict';

var errors = require('./errors.js');
var contentTypes = require('./content-types.js');

const ALLOWED = [
    'never-published',
    'has-published-version',
    'modified',
    'unmodified',
    'never-published-document',
    'has-published-version-document',
    'published-without-draft',
    'published-with-draft'
];
const parsePublicationFilter = (value)=>{
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value === 'string' && ALLOWED.includes(value)) {
        return value;
    }
    throw new errors.ValidationError(`Invalid value for 'publicationFilter'. Expected one of: ${ALLOWED.join(', ')}.`);
};
/**
 * Validates a `publicationFilter` query value for Content API `validate.query` / `sanitize.query`.
 * Attaches `details.source` and `details.param` so HTTP layer maps to 400 with correct field context.
 */ const validatePublicationFilterQueryParam = (value)=>{
    if (value === undefined || value === null) {
        return;
    }
    try {
        parsePublicationFilter(value);
    } catch (e) {
        if (e instanceof errors.ValidationError) {
            const prev = e.details;
            e.details = {
                ...prev && typeof prev === 'object' ? prev : {},
                source: 'query',
                param: 'publicationFilter'
            };
        }
        throw e;
    }
};
const columnName = (meta, attr)=>{
    const a = meta?.attributes?.[attr];
    if (!a) {
        throw new errors.ApplicationError(`Cannot build publicationFilter SQL: attribute '${attr}' is missing from metadata for table '${meta?.tableName ?? '<unknown>'}'.`);
    }
    if (!('columnName' in a) || !a.columnName) {
        throw new errors.ApplicationError(`Cannot build publicationFilter SQL: attribute '${attr}' on table '${meta?.tableName ?? '<unknown>'}' has no resolved columnName.`);
    }
    return a.columnName;
};
const emptyIdSelection = (knex, table, idCol)=>knex(table).select(`${table}.${idCol}`).whereRaw('0 = 1');
/**
 * Extra `id IN (subquery)` filter for publicationFilter, scoped to (documentId, locale) when i18n is enabled.
 * Document-scoped modes use `documentId` only. Returns null when the model does not use draft & publish.
 */ const buildPublicationFilterWhere = (knex, meta, model, mode, status)=>{
    if (!model || !contentTypes.hasDraftAndPublish(model)) {
        return null;
    }
    const table = meta.tableName;
    const idCol = columnName(meta, 'id');
    const docCol = columnName(meta, 'documentId');
    const pubCol = columnName(meta, 'publishedAt');
    const updatedCol = columnName(meta, 'updatedAt');
    const hasLocale = Boolean(meta.attributes.locale);
    const localeCol = hasLocale ? columnName(meta, 'locale') : null;
    const pairOn = (aliasA, aliasB)=>{
        const parts = [
            `${aliasA}.${docCol} = ${aliasB}.${docCol}`
        ];
        if (localeCol) {
            parts.push(`(${aliasA}.${localeCol} = ${aliasB}.${localeCol} OR (${aliasA}.${localeCol} IS NULL AND ${aliasB}.${localeCol} IS NULL))`);
        }
        return parts.join(' AND ');
    };
    const documentOn = (aliasA, aliasB)=>`${aliasA}.${docCol} = ${aliasB}.${docCol}`;
    const idIn = (sub)=>({
            id: {
                $in: sub
            }
        });
    switch(mode){
        case 'never-published':
            {
                if (status === 'published') {
                    return idIn(emptyIdSelection(knex, table, idCol));
                }
                const sub = knex(`${table} as d`).select(`d.${idCol}`).whereNull(`d.${pubCol}`).whereNotExists(function excludePublishedVersion() {
                    this.select(knex.raw('1')).from(`${table} as p`).whereRaw(pairOn('p', 'd')).whereNotNull(`p.${pubCol}`);
                });
                return idIn(sub);
            }
        case 'has-published-version':
            {
                if (status === 'draft') {
                    const sub = knex(`${table} as d`).select(`d.${idCol}`).whereNull(`d.${pubCol}`).whereExists(function includePublishedVersion() {
                        this.select(knex.raw('1')).from(`${table} as p`).whereRaw(pairOn('p', 'd')).whereNotNull(`p.${pubCol}`);
                    });
                    return idIn(sub);
                }
                const sub = knex(`${table} as p`).select(`p.${idCol}`).whereNotNull(`p.${pubCol}`).whereExists(function includeDraftVersion() {
                    this.select(knex.raw('1')).from(`${table} as d`).whereRaw(pairOn('d', 'p')).whereNull(`d.${pubCol}`);
                });
                return idIn(sub);
            }
        case 'modified':
            {
                if (status === 'draft') {
                    const sub = knex(`${table} as d`).select(`d.${idCol}`).whereNull(`d.${pubCol}`).whereExists(function includeModifiedPublishedVersion() {
                        this.select(knex.raw('1')).from(`${table} as p`).whereRaw(pairOn('p', 'd')).whereNotNull(`p.${pubCol}`).whereRaw(`d.${updatedCol} > p.${updatedCol}`);
                    });
                    return idIn(sub);
                }
                const sub = knex(`${table} as p`).select(`p.${idCol}`).whereNotNull(`p.${pubCol}`).whereExists(function includeModifiedDraftVersion() {
                    this.select(knex.raw('1')).from(`${table} as d`).whereRaw(pairOn('d', 'p')).whereNull(`d.${pubCol}`).whereRaw(`d.${updatedCol} > p.${updatedCol}`);
                });
                return idIn(sub);
            }
        case 'unmodified':
            {
                if (status === 'draft') {
                    const sub = knex(`${table} as d`).select(`d.${idCol}`).whereNull(`d.${pubCol}`).whereExists(function includeUnmodifiedPublishedVersion() {
                        this.select(knex.raw('1')).from(`${table} as p`).whereRaw(pairOn('p', 'd')).whereNotNull(`p.${pubCol}`).whereRaw(`d.${updatedCol} <= p.${updatedCol}`);
                    });
                    return idIn(sub);
                }
                const sub = knex(`${table} as p`).select(`p.${idCol}`).whereNotNull(`p.${pubCol}`).whereExists(function includeUnmodifiedDraftVersion() {
                    this.select(knex.raw('1')).from(`${table} as d`).whereRaw(pairOn('d', 'p')).whereNull(`d.${pubCol}`).whereRaw(`d.${updatedCol} <= p.${updatedCol}`);
                });
                return idIn(sub);
            }
        case 'never-published-document':
            {
                if (status === 'published') {
                    return idIn(emptyIdSelection(knex, table, idCol));
                }
                const sub = knex(`${table} as d`).select(`d.${idCol}`).whereNull(`d.${pubCol}`).whereNotExists(function excludePublishedDocument() {
                    this.select(knex.raw('1')).from(`${table} as p`).whereRaw(documentOn('p', 'd')).whereNotNull(`p.${pubCol}`);
                });
                return idIn(sub);
            }
        case 'has-published-version-document':
            {
                if (status === 'draft') {
                    const sub = knex(`${table} as d`).select(`d.${idCol}`).whereNull(`d.${pubCol}`).whereExists(function includePublishedDocument() {
                        this.select(knex.raw('1')).from(`${table} as p`).whereRaw(documentOn('p', 'd')).whereNotNull(`p.${pubCol}`);
                    });
                    return idIn(sub);
                }
                const sub = knex(`${table} as p`).select(`p.${idCol}`).whereNotNull(`p.${pubCol}`).whereExists(function includeDraftDocument() {
                    this.select(knex.raw('1')).from(`${table} as d`).whereRaw(documentOn('d', 'p')).whereNull(`d.${pubCol}`);
                });
                return idIn(sub);
            }
        case 'published-without-draft':
            {
                if (status === 'draft') {
                    return idIn(emptyIdSelection(knex, table, idCol));
                }
                const sub = knex(`${table} as p`).select(`p.${idCol}`).whereNotNull(`p.${pubCol}`).whereNotExists(function excludeDraftVersion() {
                    this.select(knex.raw('1')).from(`${table} as d`).whereRaw(pairOn('d', 'p')).whereNull(`d.${pubCol}`);
                });
                return idIn(sub);
            }
        case 'published-with-draft':
            {
                if (status === 'draft') {
                    return idIn(emptyIdSelection(knex, table, idCol));
                }
                const sub = knex(`${table} as p`).select(`p.${idCol}`).whereNotNull(`p.${pubCol}`).whereExists(function includeDraftVersion() {
                    this.select(knex.raw('1')).from(`${table} as d`).whereRaw(pairOn('d', 'p')).whereNull(`d.${pubCol}`);
                });
                return idIn(sub);
            }
        default:
            {
                return null;
            }
    }
};

exports.buildPublicationFilterWhere = buildPublicationFilterWhere;
exports.parsePublicationFilter = parsePublicationFilter;
exports.validatePublicationFilterQueryParam = validatePublicationFilterQueryParam;
//# sourceMappingURL=publication-filter.js.map
