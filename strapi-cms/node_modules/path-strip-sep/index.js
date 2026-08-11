"use strict";
/**
 * path-strip-sep - 路徑分隔符移除工具
 *
 * 這個模組提供了移除路徑尾部分隔符的功能。
 *
 * @module path-strip-sep
 * @author bluelovers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathStripSep = pathStripSep;
/**
 * 移除路徑尾部分隔符
 *
 * 這個函數會移除路徑尾部的分隔符，包括正斜線、反斜線和冒號。
 *
 * @param {string} input 要處理的路徑
 * @returns {string} 移除尾部分隔符後的路徑
 */
function pathStripSep(input) {
    return input
        // 移除尾部分隔符（排除冒號）
        .replace(/([^/\\:])[/\\]+$/, '$1')
        // 移除開頭的雙分隔符
        .replace(/(^[/\\])[/\\]{2,}$/, '$1');
}
/** 預設導出 - pathStripSep 函數 */
exports.default = pathStripSep;
//# sourceMappingURL=index.js.map