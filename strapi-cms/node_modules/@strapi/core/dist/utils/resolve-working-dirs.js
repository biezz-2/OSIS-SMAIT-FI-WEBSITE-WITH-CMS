'use strict';

var path = require('node:path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var path__default = /*#__PURE__*/_interopDefault(path);

/**
 * Resolve the working directories based on the instance options.
 *
 * Behavior:
 * - `appDir` is the directory where Strapi will write every file (schemas, generated APIs, controllers or services)
 * - `distDir` is the directory where Strapi will read configurations, schemas and any compiled code
 *
 * Default values:
 * - If `appDir` is `undefined`, it'll be set to `process.cwd()`
 * - If `distDir` is `undefined`, it'll be set to `appDir`
 */ const resolveWorkingDirectories = (opts)=>{
    const cwd = process.cwd();
    const appDir = opts.appDir ? path__default.default.resolve(cwd, opts.appDir) : cwd;
    const distDir = opts.distDir ? path__default.default.resolve(cwd, opts.distDir) : appDir;
    return {
        appDir,
        distDir
    };
};

exports.resolveWorkingDirectories = resolveWorkingDirectories;
//# sourceMappingURL=resolve-working-dirs.js.map
