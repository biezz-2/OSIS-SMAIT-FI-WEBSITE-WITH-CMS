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
import { ParsedPath } from 'path';
import { IPathNode, IPath, IParse, IPathType, ORIGIN_KEY, IPathPlatform, PlatformPath } from './lib/type';
import * as types from './lib/type';
export type { IPathNode, IPath, IParse, IPathType };
/**
 * 路徑包裝類 - 實現跨平台路徑處理的核心邏輯
 *
 * @class PathWrap
 * @implements IPath
 */
export declare class PathWrap implements IPath {
    /** 正斜線分隔符，所有路徑都會使用這個分隔符 */
    sep: "/";
    /** 平台名稱（'posix'、'win32' 或 'upath'） */
    name: string | IPathPlatform;
    /** 路徑分隔符（':' 或 ';'） */
    delimiter: PlatformPath['delimiter'];
    /** Windows 平台路徑處理實例 */
    win32: IPath;
    /** POSIX 平台路徑處理實例 */
    posix: IPath;
    /** 原始 Node.js path 模組 */
    node: PlatformPath;
    /** upath 實例引用 */
    upath: PathWrap;
    /** 預設實例引用 */
    default: PathWrap;
    /** 函數別名 */
    fn: IPath;
    /** 原始路徑庫的符號引用 */
    [ORIGIN_KEY]?: IPathType;
    /**
     * 構造函數
     *
     * @param {IPath} path 要包裝的路徑庫
     * @param {string} id 實例ID（'posix'、'win32' 或 'upath'）
     */
    constructor(path: any, id: string);
    /**
     * 連接多個路徑片段
     *
     * @template T 第一個路徑類型
     * @template U 後續路徑類型
     * @param {T} path 第一個路徑
     * @param {...U[]} paths 後續路徑
     * @returns {string} 連接後的路徑
     */
    join<T = string, U = string>(path: T, ...paths: U[]): string;
    /**
     * 規範化路徑
     *
     * @template T 路徑類型
     * @param {T} path 要規範化的路徑
     * @returns {string} 規範化後的路徑
     */
    normalize<T extends string = string>(path: T): string;
    /**
     * 計算相對路徑
     *
     * @template T 源路徑類型
     * @template U 目標路徑類型
     * @param {T} from 源路徑
     * @param {U} to 目標路徑
     * @returns {string} 相對路徑
     */
    relative<T extends string = string, U extends string = string>(from: T, to: U): string;
    /**
     * 解析路徑
     *
     * @template T 第一個路徑類型
     * @template U 後續路徑類型
     * @param {T} path 第一個路徑
     * @param {...U[]} paths 後續路徑
     * @returns {string} 解析後的路徑
     */
    resolve<T = string, U = string>(path: T, ...paths: U[]): string;
    /**
     * 解析路徑物件
     *
     * @template T 路徑類型
     * @param {T} path 要解析的路徑
     * @returns {ParsedPath} 解析後的路徑物件
     */
    parse<T extends string = string>(path: T): ParsedPath;
    /**
     * 格式化路徑物件
     *
     * @template T 路徑物件類型
     * @param {T} pathObject 要格式化的路徑物件
     * @returns {string} 格式化後的路徑
     */
    format<T = IParse>(pathObject: T): string;
    /**
     * 獲取路徑的最後一個部分
     *
     * @template T 路徑類型
     * @template U 擴展名類型
     * @param {T} path 路徑
     * @param {U} [ext] 要移除的擴展名
     * @returns {string} 最後一部分
     */
    basename<T extends string = string, U extends string = string>(path: T, ext?: U): string;
    /**
     * 獲取路徑的目錄部分
     *
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {string} 目錄部分
     */
    dirname<T extends string = string>(path: T): string;
    /**
     * 獲取路徑的擴展名
     *
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {string} 擴展名
     */
    extname<T extends string = string>(path: T): string;
    /**
     * 檢查路徑是否為絕對路徑
     *
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {boolean} 是否為絕對路徑
     */
    isAbsolute<T extends string = string>(path: T): boolean;
    /**
     * 轉換為命名空間路徑
     *
     * @param {string} path 路徑
     * @returns {string} 命名空間路徑
     */
    toNamespacedPath(path: string): any;
}
export declare namespace PathWrap {
    /** 函數別名 */
    let fn: IPath;
    type IPath = types.IPath;
    type IPathNode = types.IPathNode;
    type IParse = types.IParse;
}
/** POSIX 平台實例 */
export declare const posix: IPath;
/** Windows 平台實例 */
export declare const win32: IPath;
export type IUPath = PathWrap & {
    default: IUPath;
    upath: IUPath;
    PathWrap: typeof PathWrap;
};
/** 預設實例 */
export declare const upath: IUPath;
export declare const fn: IPath;
export default upath;
/**
 * 獲取原始路徑庫
 *
 * @param {IPath} who 要檢查的實例
 * @returns {Pick<PathWrap, keyof IPathNode>} 原始路徑庫
 */
export declare function _this_origin(who: IPath): Pick<PathWrap, keyof IPathNode>;
