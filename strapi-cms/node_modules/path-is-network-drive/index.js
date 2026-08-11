"use strict";
/**
 * path-is-network-drive - 網路磁碟機路徑檢查工具
 *
 * 這個模組提供了檢查和解析網路磁碟機路徑的功能。
 *
 * @module path-is-network-drive
 * @author bluelovers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathIsNetworkDrive = pathIsNetworkDrive;
exports.matchNetworkDriveRoot = matchNetworkDriveRoot;
exports.matchNetworkDrive02 = matchNetworkDrive02;
/**
 * 檢查是否為網路磁碟機路徑
 *
 * 這個函數會檢查輸入的路徑是否為網路磁碟機路徑。
 *
 * @param {string} input 要檢查的路徑
 * @returns {boolean} 如果為網路磁碟機路徑則返回 true，否則返回 false
 */
function pathIsNetworkDrive(input) {
    // 使用正則表達式檢查是否為網路磁碟機路徑
    // 格式：\\\\server\或\\\\server\
    return /^\\\\[^/\\]/.test(input);
}
/**
 * 匹配網路磁碟機根路徑
 *
 * 這個函數會匹配網路磁碟機的根路徑，並提取伺服器名稱。
 *
 * @param {string} input 要匹配的路徑
 * @returns {RegExpMatchArray | null} 匹配結果，包含伺服器名稱
 */
function matchNetworkDriveRoot(input) {
    // 使用正則表達式匹配網路磁碟機根路徑
    // 格式：\\\\server\或\\\\server\
    return input.match(/^\\\\([^\\/]+)[\\/]?$/);
}
/**
 * 匹配網路磁碟機詳細路徑
 *
 * 這個函數會匹配網路磁碟機的詳細路徑，並提取伺服器名稱和共享名稱。
 *
 * @param {string} input 要匹配的路徑
 * @returns {RegExpMatchArray | null} 匹配結果，包含伺服器名稱和共享名稱
 */
function matchNetworkDrive02(input) {
    // 使用正則表達式匹配網路磁碟機詳細路徑
    // 格式：\\\\server\share\或\\\\server\share\
    return input.match(/^\\\\([^\\/]+)[\\/]([^\\/]+)[\\/]?$/);
}
/** 預設導出 - pathIsNetworkDrive 函數 */
exports.default = pathIsNetworkDrive;
//# sourceMappingURL=index.js.map