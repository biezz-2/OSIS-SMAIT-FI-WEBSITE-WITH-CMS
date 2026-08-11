import type { Element, Node } from 'slate';
type Block<T extends Element['type']> = Extract<Node, {
    type: T;
}>;
declare const getEntries: <T extends object>(object: T) => [keyof T, T[keyof T]][];
declare const getKeys: <T extends object>(object: T) => (keyof T)[];
declare function isNonNullable<T>(value: T): value is NonNullable<T>;
export { type Block, getEntries, getKeys, isNonNullable };
