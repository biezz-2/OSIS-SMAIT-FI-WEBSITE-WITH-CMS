import * as qs from 'qs';
import type { Core } from '@strapi/types';
import { type StrapiOptions } from './Strapi';
import type { ContextDelegatedResponseErrorMethods, ContextDelegatedResponseSuccessMethods } from './services/server/koa-methods';
export { default as compileStrapi } from './compile';
export * as factories from './factories';
export * as ai from './ai';
export declare const createStrapi: (options?: Partial<StrapiOptions>) => Core.Strapi;
declare module 'koa' {
    type ParsedQuery = ReturnType<typeof qs.parse>;
    interface BaseRequest {
        _querycache?: ParsedQuery;
        get query(): ParsedQuery;
        set query(obj: any);
    }
    interface BaseContext {
        _querycache?: ParsedQuery;
        get query(): ParsedQuery;
        set query(obj: any);
    }
    interface DefaultContextDelegatedResponse extends ContextDelegatedResponseErrorMethods, ContextDelegatedResponseSuccessMethods {
    }
}
//# sourceMappingURL=index.d.ts.map