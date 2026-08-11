import type { Core, Modules } from '@strapi/types';
interface StrapiFetchOptions {
    logs?: boolean;
}
export declare const createStrapiFetch: (strapi: Core.Strapi, options?: StrapiFetchOptions) => Fetch;
export type Fetch = Modules.Fetch.Fetch;
export {};
//# sourceMappingURL=fetch.d.ts.map