'use strict';

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
var _strapi = /*#__PURE__*/ _class_private_field_loose_key("_strapi");
class McpConfiguration {
    isEnabled() {
        return _class_private_field_loose_base(this, _strapi)[_strapi].config.get('server.mcp.enabled', false) === true;
    }
    isDevMode() {
        return _class_private_field_loose_base(this, _strapi)[_strapi].config.get('autoReload', false);
    }
    constructor(strapi){
        Object.defineProperty(this, _strapi, {
            writable: true,
            value: void 0
        });
        _class_private_field_loose_base(this, _strapi)[_strapi] = strapi;
        this.path = '/mcp';
        this.connectTimeoutMs = strapi.config.get('server.mcp.connectTimeoutMs', 5 * 1000); // 5 seconds
        this.requestTimeoutMs = strapi.config.get('server.mcp.requestTimeoutMs', 60 * 1000); // 60 seconds
    }
}

exports.McpConfiguration = McpConfiguration;
//# sourceMappingURL=McpConfiguration.js.map
