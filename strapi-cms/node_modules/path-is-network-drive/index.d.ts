/**
 * path-is-network-drive - 網路磁碟機路徑檢查工具
 *
 * 這個模組提供了檢查和解析網路磁碟機路徑的功能。
 *
 * @module path-is-network-drive
 * @author bluelovers
 */
/**
 * 檢查是否為網路磁碟機路徑
 *
 * 這個函數會檢查輸入的路徑是否為網路磁碟機路徑。
 *
 * @param {string} input 要檢查的路徑
 * @returns {boolean} 如果為網路磁碟機路徑則返回 true，否則返回 false
 */
export declare function pathIsNetworkDrive(input: string): boolean;
/**
 * 匹配網路磁碟機根路徑
 *
 * 這個函數會匹配網路磁碟機的根路徑，並提取伺服器名稱。
 *
 * @param {string} input 要匹配的路徑
 * @returns {RegExpMatchArray | null} 匹配結果，包含伺服器名稱
 */
export declare function matchNetworkDriveRoot(input: string): RegExpMatchArray;
/**
 * 匹配網路磁碟機詳細路徑
 *
 * 這個函數會匹配網路磁碟機的詳細路徑，並提取伺服器名稱和共享名稱。
 *
 * @param {string} input 要匹配的路徑
 * @returns {RegExpMatchArray | null} 匹配結果，包含伺服器名稱和共享名稱
 */
export declare function matchNetworkDrive02(input: string): RegExpMatchArray;
/** 預設導出 - pathIsNetworkDrive 函數 */
export default pathIsNetworkDrive;
