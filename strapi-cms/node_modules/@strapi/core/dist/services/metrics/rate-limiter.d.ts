import type { Sender } from './sender';
interface Options {
    limitedEvents?: string[];
}
type TailParams<T extends (...args: any[]) => any> = Parameters<T> extends [unknown, ...infer U] ? U : never;
declare const _default: (sender: Sender, { limitedEvents }?: Options) => (event: string, ...args: TailParams<Sender>) => Promise<boolean>;
export default _default;
//# sourceMappingURL=rate-limiter.d.ts.map