'use strict';

var _ = require('lodash');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var ___default = /*#__PURE__*/_interopDefault(_);

const isPlainObject = (value)=>___default.default.isPlainObject(value);
/**
 * Splits a REST sort string into trimmed segments with a non-empty field (drops '', ',', trailing commas).
 */ function getMeaningfulSortSegments(sort) {
    return sort.split(',').map((segment)=>segment.trim()).filter((segment)=>{
        if (segment.length === 0) {
            return false;
        }
        const [field] = segment.split(':');
        return field.trim().length > 0;
    });
}
/**
 * Whether a nested sort object ({ field: 'asc' } or { relation: { name: 'desc' } }) specifies
 * at least one field to sort on. Empty objects and keys with blank orders are treated as no sort.
 */ function hasMeaningfulSortObject(sort) {
    return Object.keys(sort).some((key)=>{
        const order = sort[key];
        if (typeof order === 'string') {
            return order.length > 0;
        }
        if (isPlainObject(order)) {
            return hasMeaningfulSortObject(order);
        }
        return false;
    });
}
/** Whether a REST-style sort string contains at least one meaningful segment. */ function hasMeaningfulStringSort(sort) {
    return getMeaningfulSortSegments(sort).length > 0;
}
/**
 * Whether `sort` carries a real ordering instruction. Empty or absent sort must stay undefined so
 * populated relations keep join-table connect order (GraphQL defaults nested sort to []; REST qs
 * `sort[]` with strictNullHandling parses to `[null]`).
 */ function hasSort(sort) {
    if (sort === undefined || sort === null) {
        return false;
    }
    if (typeof sort === 'string') {
        return hasMeaningfulStringSort(sort);
    }
    if (Array.isArray(sort)) {
        if (sort.length === 0) {
            return false;
        }
        return sort.some((item)=>{
            if (typeof item === 'string') {
                return hasMeaningfulStringSort(item);
            }
            if (isPlainObject(item)) {
                return hasMeaningfulSortObject(item);
            }
            return false;
        });
    }
    if (isPlainObject(sort)) {
        return hasMeaningfulSortObject(sort);
    }
    return false;
}

exports.getMeaningfulSortSegments = getMeaningfulSortSegments;
exports.hasSort = hasSort;
//# sourceMappingURL=sort-query.js.map
