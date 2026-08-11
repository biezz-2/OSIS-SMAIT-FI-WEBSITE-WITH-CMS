import type { Core } from '@strapi/types';
declare const createAdminAPI: (strapi: Core.Strapi) => {
    listRoutes(): import("@koa/router").Layer[];
    use(fn: import("@koa/router").Middleware): /*elided*/ any;
    routes(routes: Core.Router | Core.Route[]): /*elided*/ any;
    mount(router: import("@koa/router")): /*elided*/ any;
};
export { createAdminAPI };
//# sourceMappingURL=admin-api.d.ts.map