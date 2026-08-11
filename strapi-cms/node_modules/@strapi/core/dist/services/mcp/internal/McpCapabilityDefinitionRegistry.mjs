function _class_private_field_loose_base(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
        throw new TypeError("attempted to use private field on non-instance");
    }
    return receiver;
}
var id = 0;
function _class_private_field_loose_key(name) {
    return "__private_" + id++ + "_" + name;
}
var _definitions = /*#__PURE__*/ _class_private_field_loose_key("_definitions");
class McpCapabilityDefinitionRegistry {
    get size() {
        return _class_private_field_loose_base(this, _definitions)[_definitions].size;
    }
    define(definition) {
        const existing = _class_private_field_loose_base(this, _definitions)[_definitions].get(definition.name);
        if (existing !== undefined) {
            throw new Error(`[MCP] ${this.capability} with name "${definition.name}" is already registered. Names must be unique.`);
        }
        if (definition.devModeOnly !== true) {
            if (definition.auth === undefined || definition.auth.policies.length === 0 || definition.auth.policies.some((p)=>p.action === '')) {
                throw new Error(`[MCP] ${this.capability} with name "${definition.name}" must declare auth policies or be devModeOnly.`);
            }
        }
        _class_private_field_loose_base(this, _definitions)[_definitions].set(definition.name, definition);
    }
    get(name) {
        return _class_private_field_loose_base(this, _definitions)[_definitions].get(name);
    }
    delete(name) {
        return _class_private_field_loose_base(this, _definitions)[_definitions].delete(name);
    }
    getAll() {
        return Array.from(_class_private_field_loose_base(this, _definitions)[_definitions].values());
    }
    forEach(callback) {
        _class_private_field_loose_base(this, _definitions)[_definitions].forEach(callback);
    }
    constructor(capability){
        Object.defineProperty(this, _definitions, {
            writable: true,
            value: void 0
        });
        _class_private_field_loose_base(this, _definitions)[_definitions] = new Map();
        this.capability = capability;
    }
}

export { McpCapabilityDefinitionRegistry };
//# sourceMappingURL=McpCapabilityDefinitionRegistry.mjs.map
