'use strict';

var path = require('path');
var _ = require('lodash');
var fse = require('fs-extra');
var strapiUtils = require('@strapi/utils');
var glob = require('glob');
var filepathToPropPath = require('./filepath-to-prop-path.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var path__default = /*#__PURE__*/_interopDefault(path);
var ___default = /*#__PURE__*/_interopDefault(_);
var fse__default = /*#__PURE__*/_interopDefault(fse);

/**
 * Returns an Object build from a list of files matching a glob pattern in a directory
 * It builds a tree structure resembling the folder structure in dir
 */ const loadFiles = async (dir, pattern, // eslint-disable-next-line @typescript-eslint/no-unused-vars
{ requireFn = strapiUtils.importDefault, shouldUseFileNameAsKey = (_)=>true, globArgs = {} } = {})=>{
    const root = {};
    const files = await glob.glob(pattern, {
        cwd: dir,
        ...globArgs
    });
    for (const file of files){
        const absolutePath = path__default.default.resolve(dir, file);
        // load module
        delete require.cache[absolutePath];
        let mod;
        if (path__default.default.extname(absolutePath) === '.json') {
            mod = await fse__default.default.readJson(absolutePath);
        } else {
            mod = requireFn(absolutePath);
        }
        Object.defineProperty(mod, '__filename__', {
            enumerable: true,
            configurable: false,
            writable: false,
            value: path__default.default.basename(file)
        });
        const propPath = filepathToPropPath.filePathToPropPath(file, shouldUseFileNameAsKey(file));
        if (propPath.length === 0) ___default.default.merge(root, mod);
        ___default.default.merge(root, ___default.default.setWith({}, propPath, mod, Object));
    }
    return root;
};

exports.loadFiles = loadFiles;
//# sourceMappingURL=load-files.js.map
