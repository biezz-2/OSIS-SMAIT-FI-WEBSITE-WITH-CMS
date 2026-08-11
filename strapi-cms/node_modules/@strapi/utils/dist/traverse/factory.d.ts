import { AnyAttribute, Attribute, ComponentAttribute, DynamicZoneAttribute, Model, RelationalAttribute } from '../types';
export interface Path {
    raw: string | null;
    attribute: string | null;
}
export interface Parent {
    attribute?: Attribute;
    key: string | null;
    path: Path;
    schema: Model;
}
export interface TraverseOptions {
    schema: Model;
    path?: Path;
    parent?: Parent;
    getModel(uid: string): Model;
}
export interface VisitorOptions {
    data: unknown;
    value: unknown;
    schema: Model;
    key: string;
    attribute?: AnyAttribute;
    path: Path;
    parent?: Parent;
    getModel(uid: string): Model;
}
export type Traverse = (visitor: Visitor, options: TraverseOptions, data: unknown) => Promise<unknown>;
export interface Visitor {
    (visitorOptions: VisitorOptions, opts: Pick<TransformUtils, 'set' | 'remove'>): void;
}
interface Interceptor<T = unknown> {
    predicate(data: unknown): data is T;
    handler(visitor: Visitor, options: TraverseOptions, data: T, recurseOptions: {
        recurse: Traverse;
    }): void;
}
interface ParseUtils<T> {
    transform(data: T): unknown;
    remove(key: string, data: T): unknown;
    set(key: string, value: unknown, data: T): unknown;
    keys(data: T): string[];
    get(key: string, data: T): unknown;
}
interface Parser<T = unknown> {
    predicate(data: unknown): data is T;
    parser(data: T): ParseUtils<T>;
}
interface Ignore {
    (ctx: Context): boolean;
}
interface AttributeHandler<AttributeType = Attribute> {
    predicate(ctx: Context<AttributeType>): boolean;
    handler(ctx: Context<AttributeType>, opts: Pick<TransformUtils, 'set' | 'recurse'>): void;
}
interface CommonHandler<AttributeType = Attribute> {
    predicate(ctx: Context<AttributeType>): boolean;
    handler(ctx: Context<AttributeType>, opts: Pick<TransformUtils, 'set' | 'recurse'>): void;
}
export interface TransformUtils {
    remove(key: string): void;
    set(key: string, value: unknown): void;
    recurse: Traverse;
}
interface Context<AttributeType = Attribute> {
    key: string;
    value: unknown;
    attribute: AttributeType;
    schema: Model;
    path: Path;
    data: unknown;
    visitor: Visitor;
    parent?: Parent;
    getModel(uid: string): Model;
}
declare const _default: () => {
    traverse: Traverse;
    intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T_1>(predicate: Parser<T_1>["predicate"], parser: Parser<T_1>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): {
        traverse: Traverse;
        intercept<T_1>(predicate: Interceptor<T_1>["predicate"], handler: Interceptor<T_1>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    ignore(predicate: Ignore): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
    onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): {
        traverse: Traverse;
        intercept<T>(predicate: Interceptor<T>["predicate"], handler: Interceptor<T>["handler"]): /*elided*/ any;
        parse<T>(predicate: Parser<T>["predicate"], parser: Parser<T>["parser"]): /*elided*/ any;
        ignore(predicate: Ignore): /*elided*/ any;
        on(predicate: CommonHandler["predicate"], handler: CommonHandler["handler"]): /*elided*/ any;
        onAttribute(predicate: AttributeHandler["predicate"], handler: AttributeHandler["handler"]): /*elided*/ any;
        onRelation(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onMedia(handler: AttributeHandler<RelationalAttribute>["handler"]): /*elided*/ any;
        onComponent(handler: AttributeHandler<ComponentAttribute>["handler"]): /*elided*/ any;
        onDynamicZone(handler: AttributeHandler<DynamicZoneAttribute>["handler"]): /*elided*/ any;
    };
};
export default _default;
//# sourceMappingURL=factory.d.ts.map