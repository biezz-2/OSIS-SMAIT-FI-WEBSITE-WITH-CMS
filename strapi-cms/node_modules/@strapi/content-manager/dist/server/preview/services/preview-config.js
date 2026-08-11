'use strict';

var strapiUtils = require('@strapi/utils');

/**
 * Read configuration for static preview
 */ const createPreviewConfigService = ({ strapi })=>{
    return {
        register () {
            if (!this.isEnabled()) {
                return;
            }
            const config = strapi.config.get('admin.preview');
            /**
       * Register the allowed origins for CSP, so the preview URL can be displayed
       */ if (config.config?.allowedOrigins) {
                const middlewares = strapi.config.get('middlewares');
                const configuredMiddlewares = strapiUtils.extendMiddlewareConfiguration(middlewares, {
                    name: 'strapi::security',
                    config: {
                        contentSecurityPolicy: {
                            directives: {
                                'frame-src': config.config.allowedOrigins
                            }
                        }
                    }
                });
                strapi.config.set('middlewares', configuredMiddlewares);
            }
        },
        isConfigured () {
            const config = strapi.config.get('admin.preview');
            return config?.enabled === false || config?.config?.handler != null;
        },
        isEnabled () {
            const config = strapi.config.get('admin.preview');
            if (!config) {
                return false;
            }
            return config?.enabled ?? true;
        },
        /**
     * Validate if the configuration is valid
     */ validate () {
            if (!this.isEnabled()) {
                return;
            }
            const handler = this.getPreviewHandler();
            // Handler must be a function
            if (typeof handler !== 'function') {
                throw new strapiUtils.errors.ValidationError('Preview configuration is invalid. Handler must be a function');
            }
        },
        /**
     * Utility to get the preview handler from the configuration
     */ getPreviewHandler () {
            const emptyHandler = ()=>{
                return undefined;
            };
            if (!this.isEnabled()) {
                return emptyHandler;
            }
            const config = strapi.config.get('admin.preview');
            return config?.config?.handler || emptyHandler;
        }
    };
};

exports.createPreviewConfigService = createPreviewConfigService;
//# sourceMappingURL=preview-config.js.map
