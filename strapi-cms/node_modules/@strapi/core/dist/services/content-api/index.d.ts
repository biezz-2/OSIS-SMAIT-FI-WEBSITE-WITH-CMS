import { sanitize, validate } from '@strapi/utils';
import type { Core, Modules } from '@strapi/types';
/**
 * Create a content API container that holds logic, tools and utils. (eg: permissions, ...)
 */
declare const createContentAPI: (strapi: Core.Strapi) => {
    permissions: {
        engine: import("@strapi/permissions/dist/engine").Engine;
        providers: {
            action: {
                register(action: string, payload: Record<string, unknown>): Promise<import("@strapi/utils/dist/provider-factory").Provider<unknown>>;
                hooks: import("@strapi/utils/dist/provider-factory").ProviderHooksMap;
                delete(key: string): Promise<import("@strapi/utils/dist/provider-factory").Provider>;
                get(key: string): {
                    [x: string]: unknown;
                } | undefined;
                values(): {
                    [x: string]: unknown;
                }[];
                keys(): string[];
                has(key: string): boolean;
                size(): number;
                clear(): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
            };
            condition: {
                register(condition: import("./permissions/providers/condition").Condition): Promise<import("@strapi/utils/dist/provider-factory").Provider<unknown>>;
                hooks: import("@strapi/utils/dist/provider-factory").ProviderHooksMap;
                delete(key: string): Promise<import("@strapi/utils/dist/provider-factory").Provider>;
                get(key: string): {
                    [x: string]: unknown;
                } | undefined;
                values(): {
                    [x: string]: unknown;
                }[];
                keys(): string[];
                has(key: string): boolean;
                size(): number;
                clear(): Promise<import("@strapi/utils/dist/provider-factory").Provider<{
                    [x: string]: unknown;
                }>>;
            };
        };
        registerActions: () => Promise<void>;
        getActionsMap: () => Record<string, {
            controllers: Record<string, string[]>;
        }>;
    };
    getRoutesMap: () => Promise<Record<string, unknown>>;
    sanitize: {
        input: sanitize.SanitizeFunc;
        output: sanitize.SanitizeFunc;
        query: (query: Record<string, unknown>, schema: import("@strapi/utils/dist/types").Model, { auth, strictParams, route }?: sanitize.Options) => Promise<Record<string, unknown>>;
        filters: sanitize.SanitizeFunc;
        sort: sanitize.SanitizeFunc;
        fields: sanitize.SanitizeFunc;
        populate: sanitize.SanitizeFunc;
    };
    validate: {
        input: validate.ValidateFunc;
        query: (query: Record<string, unknown>, schema: import("@strapi/utils/dist/types").Model, { auth, strictParams, route }?: validate.Options) => Promise<void>;
        filters: validate.ValidateFunc;
        sort: validate.ValidateFunc;
        fields: validate.ValidateFunc;
        populate: validate.ValidateFunc;
    };
    addQueryParams: (options: Modules.ContentAPI.AddQueryParamsOptions) => void;
    addInputParams: (options: Modules.ContentAPI.AddInputParamsOptions) => void;
    applyExtraParamsToRoutes: (routes: Core.Route[]) => void;
};
export default createContentAPI;
//# sourceMappingURL=index.d.ts.map