import { CurriedFunction1 } from 'lodash';
import { type RouteLike } from '../content-api-route-params';
import * as visitors from './visitors';
import * as validators from './validators';
import { Model, Data } from '../types';
export interface Options {
    auth?: unknown;
    /**
     * If true, validateQuery throws when the query has any top-level key not in the allowed list.
     * Defaults to false for backward compatibility.
     */
    strictParams?: boolean;
    /**
     * When set, extra query/input params are derived from the route's request schema (and validated with Zod).
     * When absent, no extra params are allowed in strict mode.
     */
    route?: RouteLike;
}
export interface Validator {
    (schema: Model): CurriedFunction1<Data, Promise<Data>>;
}
export interface ValidateFunc {
    (data: unknown, schema: Model, options?: Options): Promise<void>;
}
export type ValidateQueryParamHandler = (value: unknown, schema: Model, options?: Options) => Promise<void>;
export type ValidateBodyParamHandler = (value: unknown, schema: Model, options?: Options) => Promise<void>;
interface APIOptions {
    validators?: Validators;
    getModel: (model: string) => Model;
}
export interface Validators {
    input?: Validator[];
}
declare const createAPIValidators: (opts: APIOptions) => {
    input: ValidateFunc;
    query: (query: Record<string, unknown>, schema: Model, { auth, strictParams, route }?: Options) => Promise<void>;
    filters: ValidateFunc;
    sort: ValidateFunc;
    fields: ValidateFunc;
    populate: ValidateFunc;
};
export { createAPIValidators, validators, visitors };
export type APIValidators = ReturnType<typeof createAPIValidators>;
//# sourceMappingURL=index.d.ts.map