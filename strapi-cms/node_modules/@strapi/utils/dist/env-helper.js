'use strict';

var _ = require('lodash');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var ___default = /*#__PURE__*/_interopDefault(_);

function envFn(key, defaultValue) {
    return ___default.default.has(process.env, key) ? process.env[key] : defaultValue;
}
function getKey(key) {
    return process.env[key] ?? '';
}
function int(key, defaultValue) {
    if (!___default.default.has(process.env, key)) {
        return defaultValue;
    }
    return parseInt(getKey(key), 10);
}
function float(key, defaultValue) {
    if (!___default.default.has(process.env, key)) {
        return defaultValue;
    }
    return parseFloat(getKey(key));
}
function bool(key, defaultValue) {
    if (!___default.default.has(process.env, key)) {
        return defaultValue;
    }
    return getKey(key) === 'true';
}
function json(key, defaultValue) {
    if (!___default.default.has(process.env, key)) {
        return defaultValue;
    }
    try {
        return JSON.parse(getKey(key));
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Invalid json environment variable ${key}: ${error.message}`);
        }
        throw error;
    }
}
function array(key, defaultValue) {
    if (!___default.default.has(process.env, key)) {
        return defaultValue;
    }
    let value = getKey(key);
    if (value.startsWith('[') && value.endsWith(']')) {
        value = value.substring(1, value.length - 1);
    }
    return value.split(',').map((v)=>{
        return ___default.default.trim(___default.default.trim(v, ' '), '"');
    });
}
function date(key, defaultValue) {
    if (!___default.default.has(process.env, key)) {
        return defaultValue;
    }
    return new Date(getKey(key));
}
function oneOf(key, expectedValues, defaultValue) {
    if (!expectedValues) {
        throw new Error(`env.oneOf requires expectedValues`);
    }
    if (defaultValue && !expectedValues.includes(defaultValue)) {
        throw new Error(`env.oneOf requires defaultValue to be included in expectedValues`);
    }
    const rawValue = env(key, defaultValue);
    if (rawValue !== undefined && expectedValues.includes(rawValue)) {
        return rawValue;
    }
    return defaultValue;
}
const utils = {
    int,
    float,
    bool,
    json,
    array,
    date,
    oneOf
};
const env = Object.assign(envFn, utils);

module.exports = env;
//# sourceMappingURL=env-helper.js.map
