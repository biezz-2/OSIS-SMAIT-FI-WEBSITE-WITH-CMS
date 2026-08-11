import type { UID } from '@strapi/types';
import { parsePublicationFilter, type PublicationFilterMode } from '@strapi/utils';
export { parsePublicationFilter };
export type { PublicationFilterMode };
export declare const getPublicationFilterCondition: (uid: UID.Schema, mode: PublicationFilterMode, status: "draft" | "published") => Record<string, unknown> | null;
//# sourceMappingURL=publication-filter.d.ts.map