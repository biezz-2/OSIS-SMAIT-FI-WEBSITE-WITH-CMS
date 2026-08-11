/**
 * @lazy-node/types-path - 路徑處理類型定義模組
 *
 * 這個模組提供了完整的路徑處理相關類型定義，支援多種平台和路徑處理庫。
 *
 * @module @lazy-node/types-path
 * @author bluelovers
 */
import { ITSTypeAndStringLiteral } from 'ts-type';
import pathPlatformNodeOrigin, { ParsedPath } from "path";
/**
 * Node.js 原生 path 模組的類型定義
 *
 * @description 這等同於 `import('path')` 的類型定義
 * @type {typeof pathPlatformNodeOrigin}
 */
export type IPlatformPathNodeOrigin = typeof pathPlatformNodeOrigin;
/**
 * 平台特定的路徑類型名稱列舉
 *
 * @description 遵循 Node.js path 模組的平台分類 (win32 | posix)
 * @enum {string}
 */
export declare const enum EnumPathPlatformOrigin {
    /** Windows 平台路徑處理 */
    'win32' = "win32",
    /** POSIX 兼容平台路徑處理 */
    'posix' = "posix"
}
/**
 * 擴展的平台類型列舉
 *
 * @description 提供額外的路徑處理庫類型
 * @enum {string}
 */
export declare const enum EnumPathPlatformExtra {
    /** upath2 模組 */
    'upath' = "upath",
    /** Node.js 原生 path 模組 */
    'node' = "node"
}
/**
 * 平台特定的檔案分隔符列舉
 *
 * @description 不同平台使用的路徑分隔符
 * @enum {string}
 */
export declare const enum EnumPathSep {
    /** Windows 使用反斜線 */
    'win32' = "\\",
    /** POSIX 使用正斜線 */
    'posix' = "/",
    /** 反斜線別名 */
    'backslash' = "\\",
    /** 正斜線別名 */
    'forwardslash' = "/",
    /** 正斜線別名 */
    'slash' = "/"
}
/**
 * 平台特定的路徑分隔符列舉
 *
 * @description 用於 PATH 環境變數等的分隔符
 * @enum {string}
 */
export declare const enum EnumPathDelimiter {
    /** Windows 使用分號 */
    'win32' = ";",
    /** POSIX 使用冒號 */
    'posix' = ":"
}
/**
 * 平台特定的路徑類型
 *
 * @description 結合原生平台類型和擴展平台類型
 * @type {ITSTypeAndStringLiteral<EnumPathPlatformOrigin>}
 */
export type IPathPlatformOrigin = ITSTypeAndStringLiteral<EnumPathPlatformOrigin>;
/**
 * 完整的路徑平台類型
 *
 * @description 包含原生平台類型和擴展平台類型
 * @type {IPathPlatformOrigin | ITSTypeAndStringLiteral<EnumPathPlatformExtra>}
 */
export type IPathPlatform = IPathPlatformOrigin | ITSTypeAndStringLiteral<EnumPathPlatformExtra>;
/**
 * 平台特定的檔案分隔符類型
 *
 * @description 支援字串字面量類型的路徑分隔符
 * @type {ITSTypeAndStringLiteral<EnumPathSep>}
 */
export type IPathSep = ITSTypeAndStringLiteral<EnumPathSep>;
/**
 * 平台特定的路徑分隔符類型
 *
 * @description 支援字串字面量類型的路徑分隔符
 * @type {ITSTypeAndStringLiteral<EnumPathDelimiter>}
 */
export type IPathDelimiter = ITSTypeAndStringLiteral<EnumPathDelimiter>;
/**
 * upath2 模組的內部鍵名
 *
 * @description 用於標識路徑處理模組的來源
 * @constant {symbol}
 */
export declare const ORIGIN_KEY: unique symbol;
/**
 * 路徑解析結果介面
 *
 * @description 擴展 Node.js ParsedPath 介面，支援部分屬性
 * @interface IParse
 * @extends {Partial<ParsedPath>}
 */
export interface IParse extends Partial<ParsedPath> {
}
/**
 * 路徑處理類型聯合
 *
 * @description 支援 Node.js 原生 path、自定義 IPath 和 IPathNode
 * @type {IPlatformPathNodeOrigin | IPath | IPathNode}
 */
export type IPathType = IPlatformPathNodeOrigin | IPath | IPathNode;
/**
 * Node.js 原生 path 模組介面
 *
 * @description 挑選 Node.js path 模組的核心方法
 * @interface IPathNode
 * @extends {Pick<IPlatformPathNodeOrigin, 'toNamespacedPath' | 'delimiter' | 'sep' | 'isAbsolute' | 'extname' | 'dirname' | 'format' | 'parse' | 'resolve' | 'relative' | 'normalize' | 'join' | 'basename'>}
 */
export interface IPathNode extends Pick<IPlatformPathNodeOrigin, 'toNamespacedPath' | 'delimiter' | 'sep' | 'isAbsolute' | 'extname' | 'dirname' | 'format' | 'parse' | 'resolve' | 'relative' | 'normalize' | 'join' | 'basename'> {
    /** Windows 平台特定實現 */
    win32?: IPathNode;
    /** POSIX 平台特定實現 */
    posix?: IPathNode;
}
/**
 * 擴展路徑處理介面
 *
 * @description 提供更靈活的路徑處理介面，支援多種平台和實現
 * @interface IPath
 * @extends {Omit<IPathNode, IPathPlatformOrigin | 'default'>}
 */
export interface IPath extends Omit<IPathNode, IPathPlatformOrigin | 'default'> {
    /** 路徑處理器名稱 */
    name?: string | IPathPlatform;
    /** Windows 平台特定實現 */
    win32?: IPath;
    /** POSIX 平台特定實現 */
    posix?: IPath;
    /** upath2 實現 */
    upath?: IPath;
    /**
     * 連接多個路徑片段
     * @template T 第一個路徑類型
     * @template U 其他路徑類型
     * @param {T} path 第一個路徑
     * @param {...U[]} paths 其他路徑片段
     * @returns {string} 連接後的路徑
     */
    join<T = string, U = string>(path: T, ...paths: U[]): string;
    /**
     * 規範化路徑
     * @template T 路徑類型
     * @param {T} path 要規範化的路徑
     * @returns {string} 規範化後的路徑
     */
    normalize<T extends string = string>(path: T): string;
    /**
     * 計算相對路徑
     * @template T 起始路徑類型
     * @template U 目標路徑類型
     * @param {T} from 起始路徑
     * @param {U} to 目標路徑
     * @returns {string} 相對路徑
     */
    relative<T extends string = string, U extends string = string>(from: T, to: U): string;
    /**
     * 解析絕對路徑
     * @template T 第一個路徑類型
     * @template U 其他路徑類型
     * @param {T} path 第一個路徑
     * @param {...U[]} paths 其他路徑片段
     * @returns {string} 絕對路徑
     */
    resolve<T = string, U = string>(path: T, ...paths: U[]): string;
    /**
     * 解析路徑
     * @template T 路徑類型
     * @param {T} path 要解析的路徑
     * @returns {ParsedPath} 解析結果
     */
    parse<T extends string = string>(path: T): ParsedPath;
    /**
     * 格式化路徑物件
     * @template T 路徑物件類型
     * @param {T} pathObject 路徑物件
     * @returns {string} 格式化後的路徑
     */
    format<T = IParse>(pathObject: T): string;
    /**
     * 獲取檔案名稱
     * @template T 路徑類型
     * @template U 副檔名類型
     * @param {T} path 路徑
     * @param {U} [ext] 要移除的副檔名
     * @returns {string} 檔案名稱
     */
    basename<T extends string = string, U extends string = string>(path: T, ext?: U): string;
    /**
     * 獲取目錄路徑
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {string} 目錄路徑
     */
    dirname<T extends string = string>(path: T): string;
    /**
     * 獲取副檔名
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {string} 副檔名
     */
    extname<T extends string = string>(path: T): string;
    /**
     * 檢查是否為絕對路徑
     * @template T 路徑類型
     * @param {T} path 路徑
     * @returns {boolean} 是否為絕對路徑
     */
    isAbsolute<T extends string = string>(path: T): boolean;
    /** 函數式介面 */
    fn?: IPath;
    /** 預設實現 */
    default?: IPath;
    /** 來源標識 */
    [ORIGIN_KEY]?: IPathType;
}
/**
 * 全域路徑分隔符正規表示式
 *
 * @description 用於匹配所有平台的路徑分隔符
 * @constant {RegExp}
 */
export declare const rePathSepSlashAll: RegExp;
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
export declare function makeRePathSepSlash(options?: {
    sep?: IPathSep;
    all?: boolean;
    global?: boolean;
    match?: boolean;
    matchFull?: boolean;
    repeat?: number;
}): RegExp;
