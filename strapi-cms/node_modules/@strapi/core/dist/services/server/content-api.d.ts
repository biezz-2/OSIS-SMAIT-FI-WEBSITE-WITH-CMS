import type { Core } from '@strapi/types';
declare const createContentAPI: (strapi: Core.Strapi) => {
    listRoutes(): import("@koa/router").Layer[];
    use(fn: import("@koa/router").Middleware): /*elided*/ any;
    routes(routes: Core.Router | Core.Route[]): /*elided*/ any;
    mount(router: import("@koa/router")): /*elided*/ any;
};
export { createContentAPI };
//# sourceMappingURL=content-api.d.ts.map