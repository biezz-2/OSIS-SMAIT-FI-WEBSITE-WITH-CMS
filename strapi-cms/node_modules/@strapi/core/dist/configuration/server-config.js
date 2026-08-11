'use strict';

/**
 * Log once at startup when deprecated server config keys are present.
 * These keys are not read; warnings point users to the supported alternatives.
 */ const warnDeprecatedServerConfig = (config, log)=>{
    if (config.get('server.globalProxy')) {
        log.warn('server.globalProxy is deprecated and ignored. Use server.proxy.global in config/server instead.');
    }
    if (config.get('server.admin.autoOpen') !== undefined) {
        log.warn('server.admin.autoOpen is deprecated and ignored. Use admin.autoOpen in config/admin instead.');
    }
};

exports.warnDeprecatedServerConfig = warnDeprecatedServerConfig;
//# sourceMappingURL=server-config.js.map
