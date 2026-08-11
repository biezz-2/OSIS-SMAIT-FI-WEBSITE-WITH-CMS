import { PropertyName } from 'lodash';
type Sanitizer = (value: unknown) => unknown;
declare const sanitizersRegistry: () => {
    get(path: PropertyName): Sanitizer[];
    add(path: PropertyName, sanitizer: Sanitizer): /*elided*/ any;
    set(path: PropertyName, value?: never[]): /*elided*/ any;
    has(path: PropertyName): boolean;
};
export default sanitizersRegistry;
//# sourceMappingURL=sanitizers.d.ts.map