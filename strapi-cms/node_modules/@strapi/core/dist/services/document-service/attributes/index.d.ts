import type { UID, Modules } from '@strapi/types';
type Data = Modules.Documents.Params.Data.Input<UID.Schema>;
declare const applyTransforms: import("lodash").CurriedFunction2<import("@strapi/types/dist/struct/schema.js").ComponentSchema | import("@strapi/types/dist/struct/schema.js").ContentTypeSchema, Data, Data>;
export { applyTransforms };
//# sourceMappingURL=index.d.ts.map