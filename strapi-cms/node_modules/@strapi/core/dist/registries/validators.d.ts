import { PropertyName } from 'lodash';
type Validator = unknown;
declare const validatorsRegistry: () => {
    get(path: PropertyName): Validator[];
    add(path: PropertyName, validator: Validator): /*elided*/ any;
    set(path: PropertyName, value?: never[]): /*elided*/ any;
    has(path: PropertyName): boolean;
};
export default validatorsRegistry;
//# sourceMappingURL=validators.d.ts.map