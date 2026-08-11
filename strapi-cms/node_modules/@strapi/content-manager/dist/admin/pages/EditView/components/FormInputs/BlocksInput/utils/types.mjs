// Wrap Object.entries to get the correct types
const getEntries = (object)=>Object.entries(object);
// Wrap Object.keys to get the correct types
const getKeys = (object)=>Object.keys(object);
function isNonNullable(value) {
    return value !== null && value !== undefined;
}

export { getEntries, getKeys, isNonNullable };
//# sourceMappingURL=types.mjs.map
