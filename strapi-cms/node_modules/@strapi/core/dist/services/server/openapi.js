'use strict';

var path = require('path');
var fse = require('fs-extra');
var openapi = require('@strapi/openapi');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var path__default = /*#__PURE__*/_interopDefault(path);
var fse__default = /*#__PURE__*/_interopDefault(fse);
var openapi__namespace = /*#__PURE__*/_interopNamespace(openapi);

const SUPPORTED_ACCESS = {
    'content-api': [
        'disabled',
        'public'
    ],
    admin: [
        'disabled',
        'authenticated'
    ]
};
const DEFAULTS = {
    routePath: '/openapi.json',
    access: 'disabled',
    cacheEnabled: true,
    cacheMaxAgeMs: 60000,
    cacheRelativeFilePaths: {
        'content-api': '.strapi/openapi/content-api.json',
        admin: '.strapi/openapi/admin.json'
    }
};
const normalizePath = (value)=>{
    if (!value) {
        return DEFAULTS.routePath;
    }
    return value.startsWith('/') ? value : `/${value}`;
};
const joinPaths = (basePath, routePath)=>{
    const normalizedBasePath = normalizePath(basePath || '/');
    const normalizedRoutePath = normalizePath(routePath || DEFAULTS.routePath);
    const trimmedBasePath = normalizedBasePath === '/' ? '' : normalizedBasePath.replace(/\/+$/, '');
    return `${trimmedBasePath}${normalizedRoutePath}` || '/';
};
const stripBasePrefix = (routePath, basePath)=>{
    const normalizedBasePath = normalizePath(basePath || '/');
    const normalizedRoutePath = normalizePath(routePath || DEFAULTS.routePath);
    if (normalizedBasePath === '/') {
        return normalizedRoutePath;
    }
    if (normalizedRoutePath === normalizedBasePath) {
        return '/';
    }
    if (normalizedRoutePath.startsWith(`${normalizedBasePath}/`)) {
        const strippedPath = normalizedRoutePath.slice(normalizedBasePath.length);
        return normalizePath(strippedPath);
    }
    return normalizedRoutePath;
};
const resolveEndpointConfig = (strapi, rawConfig, type)=>{
    const apiPrefix = strapi.config.get('api.rest.prefix', '/api');
    const adminPath = strapi.config.get('admin.path', '/admin');
    const basePath = type === 'content-api' ? apiPrefix : adminPath;
    const configuredPath = rawConfig?.route?.path ?? DEFAULTS.routePath;
    const routePath = stripBasePrefix(configuredPath, basePath);
    const routerPrefix = type === 'admin' ? normalizePath(basePath) : undefined;
    const fullPath = type === 'content-api' ? joinPaths(normalizePath(apiPrefix), routePath) : joinPaths(routerPrefix, routePath);
    const access = rawConfig?.access ?? DEFAULTS.access;
    const supportedAccess = SUPPORTED_ACCESS[type];
    if (!supportedAccess.includes(access)) {
        throw new Error(`Invalid OpenAPI access "${access}" for "${type}". Expected one of: ${supportedAccess.join(', ')}`);
    }
    const cacheEnabled = rawConfig?.cache?.enabled ?? DEFAULTS.cacheEnabled;
    const cacheMaxAgeMs = rawConfig?.cache?.maxAgeMs ?? DEFAULTS.cacheMaxAgeMs;
    const configuredCachePath = rawConfig?.cache?.filePath ?? DEFAULTS.cacheRelativeFilePaths[type];
    const absoluteCachePath = path__default.default.isAbsolute(configuredCachePath) ? configuredCachePath : path__default.default.resolve(strapi.dirs.app.root, configuredCachePath);
    return {
        type,
        access,
        routePath,
        routerPrefix,
        fullPath,
        cacheEnabled,
        cacheMaxAgeMs,
        absoluteCachePath
    };
};
/**
 * Build the route `config` (auth + policies) for an endpoint.
 *
 * - `admin`: requires an authenticated admin via the `admin::isAuthenticatedAdmin`
 *   policy.
 *   Granular per-permission RBAC is intentionally left for a later iteration.
 * - `content-api`: only supports public access for now, which disables auth so
 *   anyone can read the spec.
 */ const buildRouteConfig = (config)=>{
    if (config.type === 'admin') {
        return {
            policies: [
                'admin::isAuthenticatedAdmin'
            ]
        };
    }
    return {
        auth: false
    };
};
const resolveOpenAPIConfig = (strapi)=>{
    const rawConfig = strapi.config.get('server.openapi', {});
    return [
        resolveEndpointConfig(strapi, rawConfig['content-api'], 'content-api'),
        resolveEndpointConfig(strapi, rawConfig.admin, 'admin')
    ].filter((config)=>config.access !== 'disabled');
};
const readCache = async (cachePath, maxAgeMs)=>{
    if (maxAgeMs < 0) {
        return null;
    }
    try {
        const stat = await fse__default.default.stat(cachePath);
        const ageMs = Date.now() - stat.mtimeMs;
        if (ageMs > maxAgeMs) {
            return null;
        }
        return await fse__default.default.readJson(cachePath);
    } catch  {
        return null;
    }
};
const writeCache = async (cachePath, document)=>{
    await fse__default.default.outputJson(cachePath, document, {
        spaces: 2
    });
};
const generateDocument = (strapi, type)=>{
    return openapi__namespace.generate(strapi, {
        type
    }).document;
};
const registerOpenAPIRoute = (strapi)=>{
    const configs = resolveOpenAPIConfig(strapi);
    if (!configs.length) {
        return;
    }
    const fullPathSet = new Set();
    for (const config of configs){
        if (fullPathSet.has(config.fullPath)) {
            throw new Error(`Duplicate OpenAPI endpoint path detected: "${config.fullPath}"`);
        }
        fullPathSet.add(config.fullPath);
    }
    const routers = configs.map((config)=>{
        const handler = async (ctx)=>{
            try {
                if (config.cacheEnabled) {
                    const cachedDocument = await readCache(config.absoluteCachePath, config.cacheMaxAgeMs);
                    if (cachedDocument) {
                        ctx.set('Content-Type', 'application/json');
                        ctx.body = cachedDocument;
                        return;
                    }
                }
                const document = generateDocument(strapi, config.type);
                if (config.cacheEnabled) {
                    await writeCache(config.absoluteCachePath, document);
                }
                ctx.set('Content-Type', 'application/json');
                ctx.body = document;
            } catch (error) {
                strapi.log.error(error);
                ctx.internalServerError('Failed to generate OpenAPI document');
            }
        };
        return {
            type: config.type,
            ...config.routerPrefix ? {
                prefix: config.routerPrefix
            } : {},
            routes: [
                {
                    method: 'GET',
                    path: config.routePath,
                    handler,
                    info: {
                        type: config.type
                    },
                    config: buildRouteConfig(config)
                }
            ]
        };
    });
    routers.forEach((router)=>strapi.server.routes(router));
};

exports.registerOpenAPIRoute = registerOpenAPIRoute;
//# sourceMappingURL=openapi.js.map
