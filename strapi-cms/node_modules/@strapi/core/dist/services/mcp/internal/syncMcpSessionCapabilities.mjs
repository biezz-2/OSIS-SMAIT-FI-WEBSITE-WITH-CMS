const canUseAuthorizedCapability = ({ ability, auth })=>auth.policies.some(({ action, subject })=>subject !== undefined ? ability.can(action, subject) : ability.can(action));
const canUseMcpCapability = ({ ability, definition, isDevMode })=>{
    if (definition.devModeOnly === true) {
        return isDevMode === true;
    }
    if (definition.auth === undefined) {
        return false;
    }
    // Session capability availability is a coarse allowlist. Field/entity conditions must be
    // enforced by capability handlers with request-specific context.
    return canUseAuthorizedCapability({
        ability,
        auth: definition.auth
    });
};
const syncMcpSessionCapabilities = ({ registries, definitions, ability, isDevMode })=>{
    const summary = {
        enabled: [],
        disabled: []
    };
    definitions.tools.forEach((definition)=>{
        const allowed = canUseMcpCapability({
            ability,
            definition,
            isDevMode
        });
        const status = registries.tools.status(definition.name);
        if (status === 'disabled' && allowed === true) {
            registries.tools.enable(definition.name);
            summary.enabled.push(definition.name);
        }
        if (status === 'enabled' && allowed === false) {
            registries.tools.disable(definition.name);
            summary.disabled.push(definition.name);
        }
    });
    definitions.prompts.forEach((definition)=>{
        const allowed = canUseMcpCapability({
            ability,
            definition,
            isDevMode
        });
        const status = registries.prompts.status(definition.name);
        if (status === 'disabled' && allowed === true) {
            registries.prompts.enable(definition.name);
            summary.enabled.push(definition.name);
        }
        if (status === 'enabled' && allowed === false) {
            registries.prompts.disable(definition.name);
            summary.disabled.push(definition.name);
        }
    });
    definitions.resources.forEach((definition)=>{
        const allowed = canUseMcpCapability({
            ability,
            definition,
            isDevMode
        });
        const status = registries.resources.status(definition.name);
        if (status === 'disabled' && allowed === true) {
            registries.resources.enable(definition.name);
            summary.enabled.push(definition.name);
        }
        if (status === 'enabled' && allowed === false) {
            registries.resources.disable(definition.name);
            summary.disabled.push(definition.name);
        }
    });
    return summary;
};

export { canUseMcpCapability, syncMcpSessionCapabilities };
//# sourceMappingURL=syncMcpSessionCapabilities.mjs.map
