import type { Model, Kind, Attribute, RelationalAttribute, ComponentAttribute, DynamicZoneAttribute, WithRequired } from './types';
declare const constants: {
    ID_ATTRIBUTE: string;
    DOC_ID_ATTRIBUTE: string;
    PUBLISHED_AT_ATTRIBUTE: string;
    FIRST_PUBLISHED_AT_ATTRIBUTE: string;
    CREATED_BY_ATTRIBUTE: string;
    UPDATED_BY_ATTRIBUTE: string;
    CREATED_AT_ATTRIBUTE: string;
    UPDATED_AT_ATTRIBUTE: string;
    SINGLE_TYPE: string;
    COLLECTION_TYPE: string;
};
/** ID-like fields accepted at root level and on relations/media/components (validate/sanitize traversal). */
declare const ID_FIELDS: string[];
/** Keys accepted on morphTo relation payloads (e.g. __type). */
declare const MORPH_TO_KEYS: string[];
/** Keys accepted on dynamic zone component payloads (e.g. __component). */
declare const DYNAMIC_ZONE_KEYS: string[];
/** Relation operation keys (connect, disconnect, set, options). */
declare const RELATION_OPERATION_KEYS: string[];
/**
 * Reserved attribute names that cannot be used by user-defined content-type fields.
 * Entries ending with `*` are treated as prefix matchers (e.g. `strapi*` blocks `strapi_foo`).
 */
declare const RESERVED_ATTRIBUTE_NAMES: string[];
/**
 * Reserved attribute names that only conflict when draftAndPublish is enabled.
 * `status` is the v5 Document Service / REST query parameter for draft/published filtering.
 */
declare const RESERVED_ATTRIBUTE_NAMES_DRAFT_PUBLISH: string[];
/** Reserved model (collection) names that cannot be used by user-defined content-types. */
declare const RESERVED_MODEL_NAMES: string[];
interface IsReservedAttributeNameOptions {
    /** When true, draft-and-publish-specific names (e.g. `status`) are also reserved. Defaults to true. */
    draftAndPublish?: boolean;
}
declare const isReservedAttributeName: (name: string, { draftAndPublish }?: IsReservedAttributeNameOptions) => boolean;
declare const isReservedModelName: (name: string) => boolean;
declare const getReservedAttributeNames: ({ draftAndPublish, }?: IsReservedAttributeNameOptions) => string[];
declare const getReservedModelNames: () => string[];
declare const findDraftAndPublishReservedAttributeNames: (attributeNames: Iterable<string>) => string[];
declare const getDraftAndPublishReservedAttributeWarning: (uid: string, attributeName: string) => string;
declare const getDraftAndPublishEnableBlockedMessage: (attributeNames: string[]) => string;
declare const getTimestamps: (model: Model) => string[];
declare const getCreatorFields: (model: Model) => string[];
declare const getNonWritableAttributes: (model: Model) => string[];
declare const getWritableAttributes: (model: Model) => string[];
declare const isWritableAttribute: (model: Model, attributeName: string) => boolean;
declare const getNonVisibleAttributes: (model: Model) => string[];
declare const getVisibleAttributes: (model: Model) => string[];
declare const isVisibleAttribute: (model: Model, attributeName: string) => boolean;
declare const getOptions: (model: Model) => {
    draftAndPublish: boolean;
} | ({
    draftAndPublish: boolean;
} & {
    populateCreatorFields?: boolean;
    draftAndPublish?: boolean;
});
declare const hasDraftAndPublish: (model: Model) => boolean;
declare const hasFirstPublishedAtField: (model: Model) => any;
declare const isDraft: <T extends object>(data: T, model: Model) => boolean;
declare const isSchema: (data: unknown) => data is Model;
declare const isComponentSchema: (data: unknown) => data is Model & {
    modelType: "component";
};
declare const isContentTypeSchema: (data: unknown) => data is Model & {
    modelType: "contentType";
};
declare const isSingleType: ({ kind }: {
    kind?: string | undefined;
}) => boolean;
declare const isCollectionType: ({ kind }: {
    kind?: string | undefined;
}) => boolean;
declare const isKind: (kind: Kind) => (model: Model) => boolean;
declare const getPrivateAttributes: (model: Model) => string[];
declare const isPrivateAttribute: (model: Model, attributeName: string) => boolean;
declare const isScalarAttribute: (attribute?: Attribute) => boolean | undefined;
declare const getDoesAttributeRequireValidation: (attribute: Attribute) => any;
declare const isMediaAttribute: (attribute?: Attribute) => boolean;
declare const isRelationalAttribute: (attribute?: Attribute) => attribute is RelationalAttribute;
declare const hasRelationReordering: (attribute?: Attribute) => boolean;
declare const isComponentAttribute: (attribute?: Attribute) => attribute is ComponentAttribute | DynamicZoneAttribute;
declare const isDynamicZoneAttribute: (attribute?: Attribute) => attribute is DynamicZoneAttribute;
declare const isMorphToRelationalAttribute: (attribute?: Attribute) => boolean;
declare const getComponentAttributes: (schema: Model) => string[];
declare const getMediaAttributes: (schema: Model) => string[];
declare const getScalarAttributes: (schema: Model) => string[];
declare const getRelationalAttributes: (schema: Model) => string[];
/**
 * Checks if an attribute is of type `type`
 * @param {object} attribute
 * @param {string} type
 */
declare const isTypedAttribute: (attribute: Attribute, type: string) => boolean;
/**
 *  Returns a route prefix for a contentType
 * @param {object} contentType
 * @returns {string}
 */
declare const getContentTypeRoutePrefix: (contentType: WithRequired<Model, "info">) => string;
export { isSchema, isContentTypeSchema, isComponentSchema, isScalarAttribute, isMediaAttribute, isRelationalAttribute, hasRelationReordering, isComponentAttribute, isDynamicZoneAttribute, isMorphToRelationalAttribute, isTypedAttribute, getPrivateAttributes, isPrivateAttribute, constants, ID_FIELDS, MORPH_TO_KEYS, DYNAMIC_ZONE_KEYS, RELATION_OPERATION_KEYS, RESERVED_ATTRIBUTE_NAMES, RESERVED_ATTRIBUTE_NAMES_DRAFT_PUBLISH, RESERVED_MODEL_NAMES, isReservedAttributeName, isReservedModelName, getReservedAttributeNames, getReservedModelNames, findDraftAndPublishReservedAttributeNames, getDraftAndPublishReservedAttributeWarning, getDraftAndPublishEnableBlockedMessage, getNonWritableAttributes, getComponentAttributes, getMediaAttributes, getScalarAttributes, getRelationalAttributes, getWritableAttributes, isWritableAttribute, getNonVisibleAttributes, getVisibleAttributes, getTimestamps, getCreatorFields, isVisibleAttribute, getOptions, isDraft, hasDraftAndPublish, hasFirstPublishedAtField, isSingleType, isCollectionType, isKind, getContentTypeRoutePrefix, getDoesAttributeRequireValidation, };
//# sourceMappingURL=content-types.d.ts.map