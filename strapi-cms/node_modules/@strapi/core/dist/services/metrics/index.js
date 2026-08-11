'use strict';

var rateLimiter = require('./rate-limiter.js');
var sender = require('./sender.js');
var middleware = require('./middleware.js');
var isTruthy = require('./is-truthy.js');
var metrics = require('../mcp/metrics/metrics.js');

const LIMITED_EVENTS = [
    'didSaveMediaWithAlternativeText',
    'didSaveMediaWithCaption',
    'didDisableResponsiveDimensions',
    'didEnableResponsiveDimensions',
    'didInitializePluginUpload',
    ...Object.values(metrics.MCP_LIMITED_TELEMETRY_EVENTS)
];
const createTelemetryInstance = (strapi)=>{
    const uuid = strapi.config.get('uuid');
    const telemetryDisabled = strapi.config.get('packageJsonStrapi.telemetryDisabled');
    const isDisabled = !uuid || isTruthy(process.env.STRAPI_TELEMETRY_DISABLED) || isTruthy(telemetryDisabled);
    // Skip the sender (and its tsUtils consumer) entirely when telemetry is off
    const sender$1 = isDisabled ? null : sender(strapi);
    const sendEvent = sender$1 ? rateLimiter(sender$1, {
        limitedEvents: LIMITED_EVENTS
    }) : null;
    return {
        get isDisabled () {
            return isDisabled;
        },
        register () {
            if (!isDisabled && sendEvent) {
                strapi.cron.add({
                    sendPingEvent: {
                        task: ()=>sendEvent('ping'),
                        options: '0 0 12 * * *'
                    }
                });
                strapi.server.use(middleware({
                    sendEvent,
                    strapi
                }));
            }
        },
        bootstrap () {},
        async send (event, payload = {}) {
            if (isDisabled || !sendEvent) return true;
            return sendEvent(event, payload);
        },
        destroy () {
        // Clean up resources if needed
        }
    };
};

module.exports = createTelemetryInstance;
//# sourceMappingURL=index.js.map
