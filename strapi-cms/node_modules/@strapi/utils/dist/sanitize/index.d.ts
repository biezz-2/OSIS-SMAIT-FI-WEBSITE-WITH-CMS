import { CurriedFunction1 } from 'lodash';
import { type RouteLike } from '../content-api-route-params';
import * as visitors from './visitors';
import * as sanitizers from './sanitizers';
import type { Model, Data } from '../types';
export interface Options {
    auth?: unknown;
    /**
     * If true, removes fields that are not declared in the schema (input) or keeps only allowed query param keys (query).
     * Defaults to false for backward compatibility.
     * TODO: In Strapi 6, strictParams will default to true (and may be removed as an option)
     */
    strictParams?: boolean;
    /**
     * When set, extra query/input params are derived from the route's request schema (and validated/sanitized with Zod).
     * When absent, no extra params are allowed in strict mode.
     */
    route?: RouteLike;
}
export interface Sanitizer {
    (schema: Model): CurriedFunction1<Data, Promise<Data>>;
}
export interface SanitizeFunc {
    (data: unknown, schema: Model, options?: Options): Promise<unknown>;
}
export type SanitizeQueryParamHandler = (value: unknown, schema: Model, options?: Options) => Promise<unknown>;
export type SanitizeBodyParamHandler = (value: unknown, schema: Model, options?: Options) => Promise<unknown>;
export interface APIOptions {
    sanitizers?: Sanitizers;
    getModel: (model: string) => Model;
}
export interface Sanitizers {
    input?: Sanitizer[];
    output?: Sanitizer[];
}
declare const createAPISanitizers: (opts: APIOptions) => {
    input: SanitizeFunc;
    output: SanitizeFunc;
    query: (query: Record<string, unknown>, schema: Model, { auth, strictParams, route }?: Options) => Promise<Record<string, unknown>>;
    filters: SanitizeFunc;
    sort: SanitizeFunc;
    fields: SanitizeFunc;
    populate: SanitizeFunc;
};
export { createAPISanitizers, sanitizers, visitors };
export type APISanitiers = ReturnType<typeof createAPISanitizers>;
//# sourceMappingURL=index.d.ts.map