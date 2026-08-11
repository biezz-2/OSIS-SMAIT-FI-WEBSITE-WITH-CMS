export type Env = typeof envFn & typeof utils;
declare function envFn(key: string): string | undefined;
declare function envFn(key: string, defaultValue: string): string;
declare function envFn<T>(key: string, defaultValue: T): (string & Record<never, never>) | T;
declare function int(key: string, defaultValue: number): number;
declare function int(key: string, defaultValue?: number | undefined): number | undefined;
declare function float(key: string, defaultValue: number): number;
declare function float(key: string, defaultValue?: number | undefined): number | undefined;
declare function bool(key: string, defaultValue: boolean): boolean;
declare function bool(key: string, defaultValue?: boolean | undefined): boolean | undefined;
declare function json<T extends object>(key: string, defaultValue: T): T;
declare function json<T extends object>(key: string, defaultValue?: T | undefined): T | undefined;
declare function array(key: string, defaultValue: string[]): string[];
declare function array(key: string, defaultValue?: string[] | undefined): string[] | undefined;
declare function date(key: string, defaultValue: Date): Date;
declare function date(key: string, defaultValue?: Date | undefined): Date | undefined;
/**
 * Gets a value from env that matches oneOf provided values
 * @param {string} key
 * @param {string[]} expectedValues
 * @param {string|undefined} defaultValue
 * @returns {string|undefined}
 */
declare function oneOf<T extends string, TDefault extends T = T>(key: string, expectedValues: T[], defaultValue: TDefault): T;
declare function oneOf<T extends string, TDefault extends T = T>(key: string, expectedValues: T[], defaultValue?: TDefault | undefined): T | undefined;
declare const utils: {
    int: typeof int;
    float: typeof float;
    bool: typeof bool;
    json: typeof json;
    array: typeof array;
    date: typeof date;
    oneOf: typeof oneOf;
};
declare const env: Env;
export default env;
//# sourceMappingURL=env-helper.d.ts.map