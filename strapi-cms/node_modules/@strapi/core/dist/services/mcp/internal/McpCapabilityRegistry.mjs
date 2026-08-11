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
var _definitions = /*#__PURE__*/ _class_private_field_loose_key("_definitions"), _registered = /*#__PURE__*/ _class_private_field_loose_key("_registered");
class McpCapabilityRegistryBase {
    register(registerFn) {
        _class_private_field_loose_base(this, _definitions)[_definitions].forEach((definition)=>{
            // Defence: register() must be called at most once per registry instance (double-bind protection).
            const existing = _class_private_field_loose_base(this, _registered)[_registered].get(definition.name);
            if (existing !== undefined) {
                throw new Error(`[MCP] ${_class_private_field_loose_base(this, _definitions)[_definitions].capability} with name "${definition.name}" is already registered. Names must be unique.`);
            }
            const registered = registerFn(definition);
            // Disable the capability until explicitly enabled depending on devModeOnly and authorization
            registered.disable();
            _class_private_field_loose_base(this, _registered)[_registered].set(definition.name, registered);
        });
    }
    list(ctx) {
        const { filter } = ctx ?? {};
        return _class_private_field_loose_base(this, _definitions)[_definitions].getAll().reduce((acc, curr)=>{
            const status = this.status(curr.name);
            if (filter?.status !== undefined && !filter.status.includes(status)) {
                return acc;
            }
            acc.push({
                name: curr.name,
                status,
                devModeOnly: !!curr.devModeOnly,
                auth: curr.auth
            });
            return acc;
        }, []);
    }
    status(name) {
        const registered = _class_private_field_loose_base(this, _registered)[_registered].get(name);
        if (registered !== undefined) {
            return registered.enabled === true ? 'enabled' : 'disabled';
        }
        const definition = _class_private_field_loose_base(this, _definitions)[_definitions].get(name);
        if (definition !== undefined) {
            return 'defined';
        }
        return 'undefined';
    }
    /** @internal Used by syncMcpSessionCapabilities; not part of the public registry API. */ enable(name) {
        const registered = _class_private_field_loose_base(this, _registered)[_registered].get(name);
        if (!registered) {
            throw new Error(`[MCP] ${_class_private_field_loose_base(this, _definitions)[_definitions].capability} with name "${name}" is not registered.`);
        }
        registered.enable();
    }
    /** @internal Used by syncMcpSessionCapabilities; not part of the public registry API. */ enableAll() {
        for (const registered of _class_private_field_loose_base(this, _registered)[_registered].values()){
            registered.enable();
        }
    }
    /** @internal Used by syncMcpSessionCapabilities; not part of the public registry API. */ disable(name) {
        const registered = _class_private_field_loose_base(this, _registered)[_registered].get(name);
        if (!registered) {
            throw new Error(`[MCP] ${_class_private_field_loose_base(this, _definitions)[_definitions].capability} with name "${name}" is not registered.`);
        }
        registered.disable();
    }
    /** @internal Used by syncMcpSessionCapabilities; not part of the public registry API. */ disableAll() {
        for (const registered of _class_private_field_loose_base(this, _registered)[_registered].values()){
            registered.disable();
        }
    }
    /** @internal Used by syncMcpSessionCapabilities; not part of the public registry API. */ remove(name) {
        const registered = _class_private_field_loose_base(this, _registered)[_registered].get(name);
        if (!registered) {
            throw new Error(`[MCP] ${_class_private_field_loose_base(this, _definitions)[_definitions].capability} with name "${name}" is not registered.`);
        }
        registered.remove();
        _class_private_field_loose_base(this, _registered)[_registered].delete(name);
    }
    /** @internal Used by syncMcpSessionCapabilities; not part of the public registry API. */ removeAll() {
        for (const registered of _class_private_field_loose_base(this, _registered)[_registered].values()){
            registered.remove();
        }
        _class_private_field_loose_base(this, _registered)[_registered].clear();
    }
    constructor(definitions){
        Object.defineProperty(this, _definitions, {
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, _registered, {
            writable: true,
            value: void 0
        });
        _class_private_field_loose_base(this, _registered)[_registered] = new Map();
        _class_private_field_loose_base(this, _definitions)[_definitions] = definitions;
    }
}

export { McpCapabilityRegistryBase };
//# sourceMappingURL=McpCapabilityRegistry.mjs.map
