import wrapWithRateLimit from './rate-limiter.mjs';
import createSender from './sender.mjs';
import createMiddleware from './middleware.mjs';
import isTruthy from './is-truthy.mjs';
import { MCP_LIMITED_TELEMETRY_EVENTS } from '../mcp/metrics/metrics.mjs';

const LIMITED_EVENTS = [
    'didSaveMediaWithAlternativeText',
    'didSaveMediaWithCaption',
    'didDisableResponsiveDimensions',
    'didEnableResponsiveDimensions',
    'didInitializePluginUpload',
    ...Object.values(MCP_LIMITED_TELEMETRY_EVENTS)
];
const createTelemetryInstance = (strapi)=>{
    const uuid = strapi.config.get('uuid');
    const telemetryDisabled = strapi.config.get('packageJsonStrapi.telemetryDisabled');
    const isDisabled = !uuid || isTruthy(process.env.STRAPI_TELEMETRY_DISABLED) || isTruthy(telemetryDisabled);
    // Skip the sender (and its tsUtils consumer) entirely when telemetry is off
    const sender = isDisabled ? null : createSender(strapi);
    const sendEvent = sender ? wrapWithRateLimit(sender, {
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
                strapi.server.use(createMiddleware({
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

export { createTelemetryInstance as default };
//# sourceMappingURL=index.mjs.map
