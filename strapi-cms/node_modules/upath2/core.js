"use strict";
/**
 * upath2 - 跨平台路徑處理工具
 *
 * 這個模組提供了一個 `path` 的代理，將所有結果中的反斜線 (`\`) 替換為正斜線 (`/`)，
 * 從而實現跨平台的路徑處理。
 *
 * @module upath2
 * @author bluelovers
 * @since 2017/12/9
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fn = exports.upath = exports.win32 = exports.posix = exports.PathWrap = void 0;
exports._this_origin = _this_origin;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const type_1 = require("./lib/type");
const util_1 = require("./lib/util");
const path_is_network_drive_1 = require("path-is-network-drive");
const fix_1 = require("./lib/fix");
/**
 * 路徑包裝類 - 實現跨平台路徑處理的核心邏輯
 *
 * @class PathWrap
 * @implements IPath
 */
class PathWrap {
    /**
     * 構造函數
     *
     * @param {IPath} path 要包裝的路徑庫
     * @param {string} id 實例ID（'posix'、'win32' 或 'upath'）
     */
    constructor(path, id) {
        var _a;
        /** 正斜線分隔符，所有路徑都會使用這個分隔符 */
        this.sep = '/';
        /** 原始 Node.js path 模組 */
        this.node = path_1.default;
        let _static = (0, util_1.getStatic)(this);
        // 設置函數別名
        // @ts-ignore
        this.fn = (0, util_1.defaults)(this.__proto__, _static.fn, path);
        // 設置分隔符
        this.delimiter = (_a = path.delimiter) !== null && _a !== void 0 ? _a : _static.fn.delimiter;
        // 綁定所有路徑操作方法
        [
            'join',
            'normalize',
            'relative',
            'resolve',
            'parse',
            'format',
            'basename',
            'dirname',
            'extname',
            'isAbsolute',
            'toNamespacedPath',
        ]
            .forEach(prop => {
            // 綁定方法到實例
            this[prop] = this[prop].bind(this);
        });
        // 刪除ID屬性
        delete this[id];
        // 設置原始路徑庫的引用
        Object.defineProperty(this, type_1.ORIGIN_KEY, {
            enumerable: false,
            value: path,
        });
        // 設置函數別名
        this.fn[id] = this[id] = this;
        this.name = id;
    }
    /**
     * 連接多個路徑片段
     *
     * @template T 第一個路徑類型
     * @template U 後續路徑類型
     * @param {T} path 第一個路徑
     * @param {...U[]} paths 後續路徑
     * @returns {string} 連接後的路徑
     */
    join(path, ...paths) {
        // 處理特殊路徑
        // @ts-ignore
        path = (0, fix_1._fix_special)(this, path, true);
        // 連接路徑並替換分隔符
        return (0, util_1._replace_sep)(this, _this_origin(this).join(path, ...paths));
    }
    /**
     * 規範化路徑
     *
     * @template T 路徑類型
     * @param {T} path 要規範化的路徑
     * @returns {string} 規範化後的路徑
     */
    normalize(path) {
        // 處理特殊路徑
        let ret = (0, fix_1._fix_special)(this, path);
        if (ret === null || ret === void 0 ? void 0 : ret.length) {
            return ret;
        }
        // 規範化路徑並替換分隔符
        return (0, util_1._replace_sep)(this, _this_origin(this).normalize(path));
    }
    /**
     * 計算相對路徑
     *
     * @template T 源路徑類型
     * @template U 目標路徑類型
     * @param {T} from 源路徑
     * @param {U} to 目標路徑
     * @returns {string} 相對路徑
     */
    relative(from, to) {
        // 處理特殊路徑
        from = (0, fix_1._fix_special)(this, from, true);
        to = (0, fix_1._fix_special)(this, to, true);
        // 計算相對路徑並替換分隔符
        return (0, util_1._replace_sep)(this, _this_origin(this).relative(from.toString(), to.toString()));
    }
    /**
     * 解析路徑
     *
     * @template T 第一個路徑類型
     * @template U 後續路徑類型
     * @param {T} path 第一個路徑
     * @param {...U[]} paths 後續路徑
     * @returns {string} 解析後的路徑
     */
    resolve(path, ...paths) {
        // 處理特殊路徑
        // @ts-ignore
        path = (0, fix_1._fix_special)(this, path, true);
        // 解析路徑並替換分隔符
        return (0, util_1._replace_sep)(this, _this_origin(this).resolve(path, ...paths));
    }
    /**
     * 解析路徑物件
     *
     * @template T 路徑類型
     * @param {T} path 要解析的路徑
     * @returns {ParsedPath} 解析後的路徑物件
     */
    parse(path) {
        // 規範化路徑
        path = this.normalize(path);
        // 解析路徑
        let ret = _this_origin(this).parse(path);
        // 替換分隔符
        ret.root = (0, util_1._replace_sep)(this, ret.root);
        ret.dir = (0, util_1._replace_sep)(this, ret.dir);
        return ret;
    }
    /**
     * 格式化路徑物件
     *
     * @template T 路徑物件類型
     * @param {T} pathObject 要格式化的路徑物件
     * @returns {string} 格式化後的路徑
     */
    format(pathObject) {
        // 格式化路徑並替換分隔符
        return (0, util_1._replace_sep)(this, _this_origin(this).format(pathObject));
    }
    // ---------
    /**
     * 獲取路徑的最後一個部分
     *
     * @template T 路徑類型
     * @template U 擴展名類型
     * @param {T} path 路徑
     * @param {U} [ext] 要移除的擴展名
     * @returns {string} 最後一部分
     */
    basename(path, ext) {
        return _this_origin(this).basename(path, ext);
    }
    /**
     * 獲取路徑的目錄部分
     *
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {string} 目錄部分
     */
    dirname(path) {
        let r;
        // 處理網路磁碟機路徑
        if (false && this.name !== 'posix' && (0, path_is_network_drive_1.pathIsNetworkDrive)(path)) {
            if ((0, path_is_network_drive_1.matchNetworkDriveRoot)(path)) {
                r = path;
            }
            else {
                let m = (0, path_is_network_drive_1.matchNetworkDrive02)(path);
                if (m === null || m === void 0 ? void 0 : m.length) {
                    return `\\\\${m[1]}`;
                }
                r = _this_origin(this).dirname(path);
            }
        }
        else {
            r = _this_origin(this).dirname(path);
        }
        // 處理根目錄
        if (r.length > 1 && !/^\w:[/\\]$/.test(r)) {
            r = (0, util_1._strip_sep)(r);
        }
        // 替換分隔符
        return (0, util_1._replace_sep)(this, r);
    }
    /**
     * 獲取路徑的擴展名
     *
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {string} 擴展名
     */
    extname(path) {
        return _this_origin(this).extname(path);
    }
    /**
     * 檢查路徑是否為絕對路徑
     *
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {boolean} 是否為絕對路徑
     */
    isAbsolute(path) {
        return _this_origin(this).isAbsolute(path);
    }
    /**
     * 轉換為命名空間路徑
     *
     * @param {string} path 路徑
     * @returns {string} 命名空間路徑
     */
    toNamespacedPath(path) {
        return _this_origin(this).toNamespacedPath(path);
    }
}
exports.PathWrap = PathWrap;
(function (PathWrap) {
    let __proto__ = {};
    // 從類獲取原型
    for (let i in Object.getOwnPropertyDescriptors(PathWrap.prototype)) {
        __proto__[i] = PathWrap.prototype[i];
    }
    /** 函數別名 */
    PathWrap.fn = __proto__;
    // 刪除名稱屬性
    delete PathWrap.fn.name;
    // 設置函數別名
    PathWrap.fn['fn'] = PathWrap.fn;
    // @ts-ignore
    PathWrap.fn.sep = '/';
    // 設置原型函數別名
    PathWrap.prototype.fn = PathWrap.fn;
})(PathWrap || (exports.PathWrap = PathWrap = {}));
/** POSIX 平台實例 */
exports.posix = new PathWrap(path_1.default.posix, 'posix');
/** Windows 平台實例 */
exports.win32 = new PathWrap(path_1.default.win32, 'win32');
/** upath 實例 */
const _upath = new PathWrap(path_1.default, 'upath');
/** 預設實例 */
exports.upath = _upath;
// 設置類引用
exports.upath.PathWrap = PathWrap;
// 設置函數別名
exports.fn = PathWrap.fn = exports.upath.fn;
// @ts-ignore
path_1.default.upath = exports.upath;
// 設置跨平台別名
for (const [key, lib] of [
    ['win32', exports.win32],
    ['posix', exports.posix],
    ['upath', exports.upath],
    ['default', exports.upath],
    ['node', path_1.default],
]) {
    delete exports.win32.fn[key];
    delete exports.posix.fn[key];
    delete exports.upath.fn[key];
    delete exports.win32[key];
    delete exports.posix[key];
    delete exports.upath[key];
    // @ts-ignore
    exports.win32[key] = exports.posix[key] = exports.upath[key] = lib;
    //win32.__proto__[key] = posix.__proto__[key] = lib;
}
// 標記為 ES 模組
Object.defineProperty(exports.upath, "__esModule", { value: true });
// 設置預設導出
// @ts-ignore
//export default upath as PathWrap & IPath & IPathNode;
exports.default = exports.upath;
/**
 * 獲取原始路徑庫
 *
 * @param {IPath} who 要檢查的實例
 * @returns {Pick<PathWrap, keyof IPathNode>} 原始路徑庫
 */
function _this_origin(who) {
    if (who[type_1.ORIGIN_KEY]) {
        // @ts-ignore
        return who[type_1.ORIGIN_KEY];
    }
    // @ts-ignore
    else if (who === exports.upath) {
        // @ts-ignore
        return path_1.default;
    }
    else if (who === exports.win32) {
        // @ts-ignore
        return path_1.default.win32;
    }
    else if (who === exports.posix) {
        // @ts-ignore
        return path_1.default.posix;
    }
    throw new TypeError(`this not PathWrap`);
}
//# sourceMappingURL=core.js.map