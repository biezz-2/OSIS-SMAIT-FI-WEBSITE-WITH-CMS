import type { Core } from '@strapi/types';
declare module 'koa' {
    interface BaseResponse {
        _explicitStatus: boolean;
    }
}
declare const errorMiddleware: Core.MiddlewareFactory;
export { errorMiddleware as errors };
//# sourceMappingURL=errors.d.ts.map