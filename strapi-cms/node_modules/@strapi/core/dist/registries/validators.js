'use strict';

var _ = require('lodash');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var ___default = /*#__PURE__*/_interopDefault(_);

const validatorsRegistry = ()=>{
    const validators = {};
    return {
        get (path) {
            return ___default.default.get(validators, path, []);
        },
        add (path, validator) {
            this.get(path).push(validator);
            return this;
        },
        set (path, value = []) {
            ___default.default.set(validators, path, value);
            return this;
        },
        has (path) {
            return ___default.default.has(validators, path);
        }
    };
};

module.exports = validatorsRegistry;
//# sourceMappingURL=validators.js.map
