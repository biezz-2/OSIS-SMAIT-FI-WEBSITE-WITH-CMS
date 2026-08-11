'use strict';

var Router = require('@koa/router');
var routing = require('./routing.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Router__default = /*#__PURE__*/_interopDefault(Router);

const createAPI = (strapi, opts = {})=>{
    const { prefix, type } = opts;
    const api = new Router__default.default({
        prefix
    });
    const routeManager = routing.createRouteManager(strapi, {
        type
    });
    return {
        listRoutes () {
            return [
                ...api.stack
            ];
        },
        use (fn) {
            api.use(fn);
            return this;
        },
        routes (routes) {
            routeManager.addRoutes(routes, api);
            return this;
        },
        mount (router) {
            router.use(api.routes(), api.allowedMethods());
            return this;
        }
    };
};

exports.createAPI = createAPI;
//# sourceMappingURL=api.js.map
