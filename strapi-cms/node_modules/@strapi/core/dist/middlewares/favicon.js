'use strict';

var fs = require('fs');
var path = require('path');
var koaFavicon = require('koa-favicon');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var koaFavicon__default = /*#__PURE__*/_interopDefault(koaFavicon);

const defaults = {
    path: 'favicon.png',
    maxAge: 86400000
};
const favicon = (config, { strapi })=>{
    const { maxAge, path: faviconPathConfig } = {
        ...defaults,
        ...config
    };
    const { root: appRoot } = strapi.dirs.app;
    let faviconPath = faviconPathConfig;
    if (!fs.existsSync(path.resolve(appRoot, faviconPathConfig))) {
        if (fs.existsSync(path.resolve(appRoot, defaults.path))) {
            faviconPath = defaults.path;
        } else if (fs.existsSync(path.resolve(appRoot, 'favicon.ico'))) {
            faviconPath = 'favicon.ico';
        }
    }
    return koaFavicon__default.default(path.resolve(appRoot, faviconPath), {
        maxAge
    });
};

exports.favicon = favicon;
//# sourceMappingURL=favicon.js.map
