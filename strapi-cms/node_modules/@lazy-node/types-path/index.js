"use strict";
/**
 * @lazy-node/types-path - 路徑處理類型定義模組
 *
 * 這個模組提供了完整的路徑處理相關類型定義，支援多種平台和路徑處理庫。
 *
 * @module @lazy-node/types-path
 * @author bluelovers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rePathSepSlashAll = exports.ORIGIN_KEY = exports.EnumPathDelimiter = exports.EnumPathSep = exports.EnumPathPlatformExtra = exports.EnumPathPlatformOrigin = void 0;
exports.makeRePathSepSlash = makeRePathSepSlash;
/**
 * 平台特定的路徑類型名稱列舉
 *
 * @description 遵循 Node.js path 模組的平台分類 (win32 | posix)
 * @enum {string}
 */
var EnumPathPlatformOrigin;
(function (EnumPathPlatformOrigin) {
    /** Windows 平台路徑處理 */
    EnumPathPlatformOrigin["win32"] = "win32";
    /** POSIX 兼容平台路徑處理 */
    EnumPathPlatformOrigin["posix"] = "posix";
})(EnumPathPlatformOrigin || (exports.EnumPathPlatformOrigin = EnumPathPlatformOrigin = {}));
/**
 * 擴展的平台類型列舉
 *
 * @description 提供額外的路徑處理庫類型
 * @enum {string}
 */
var EnumPathPlatformExtra;
(function (EnumPathPlatformExtra) {
    /** upath2 模組 */
    EnumPathPlatformExtra["upath"] = "upath";
    /** Node.js 原生 path 模組 */
    EnumPathPlatformExtra["node"] = "node";
})(EnumPathPlatformExtra || (exports.EnumPathPlatformExtra = EnumPathPlatformExtra = {}));
/**
 * 平台特定的檔案分隔符列舉
 *
 * @description 不同平台使用的路徑分隔符
 * @enum {string}
 */
var EnumPathSep;
(function (EnumPathSep) {
    /** Windows 使用反斜線 */
    EnumPathSep["win32"] = "\\";
    /** POSIX 使用正斜線 */
    EnumPathSep["posix"] = "/";
    /** 反斜線別名 */
    EnumPathSep["backslash"] = "\\";
    /** 正斜線別名 */
    EnumPathSep["forwardslash"] = "/";
    /** 正斜線別名 */
    EnumPathSep["slash"] = "/";
})(EnumPathSep || (exports.EnumPathSep = EnumPathSep = {}));
/**
 * 平台特定的路徑分隔符列舉
 *
 * @description 用於 PATH 環境變數等的分隔符
 * @enum {string}
 */
var EnumPathDelimiter;
(function (EnumPathDelimiter) {
    /** Windows 使用分號 */
    EnumPathDelimiter["win32"] = ";";
    /** POSIX 使用冒號 */
    EnumPathDelimiter["posix"] = ":";
})(EnumPathDelimiter || (exports.EnumPathDelimiter = EnumPathDelimiter = {}));
/**
 * upath2 模組的內部鍵名
 *
 * @description 用於標識路徑處理模組的來源
 * @constant {symbol}
 */
exports.ORIGIN_KEY = Symbol.for('_origin');
/**
 * 全域路徑分隔符正規表示式
 *
 * @description 用於匹配所有平台的路徑分隔符
 * @constant {RegExp}
 */
exports.rePathSepSlashAll = makeRePathSepSlash();
/**
 * 建立路徑分隔符合規表示式
 *
 * @description 根據選項建立用於匹配路徑分隔符的正規表示式
 * @param {Object} [options] 選項物件
 * @param {IPathSep} [options.sep] 指定分隔符
 * @param {boolean} [options.all] 是否匹配所有分隔符
 * @param {boolean} [options.global] 是否全域匹配
 * @param {boolean} [options.match] 是否使用捕獲群組
 * @param {boolean} [options.matchFull] 是否完整匹配
 * @param {number} [options.repeat] 重複次數
 * @returns {RegExp} 正規表示式
 */
function makeRePathSepSlash(options = {}) {
    // 根據選項決定正規表示式來源
    let source = (options.sep && !options.all)
        ? (options.sep === "\\" /* EnumPathSep.win32 */ ? `\\\\` : "/" /* EnumPathSep.posix */)
        : '[/\\\\]';
    // 處理重複次數
    if (options.repeat) {
        source = `${source}${options.repeat > 0 ? `{${options.repeat}}` : '+'}`;
    }
    // 處理捕獲群組
    if (options.match) {
        source = `(${source})`;
    }
    // 處理完整匹配
    if (options.matchFull) {
        source = `^${source}$`;
    }
    // 建立正規表示式
    return new RegExp(source, !options.global ? '' : 'g');
}
//# sourceMappingURL=index.js.map