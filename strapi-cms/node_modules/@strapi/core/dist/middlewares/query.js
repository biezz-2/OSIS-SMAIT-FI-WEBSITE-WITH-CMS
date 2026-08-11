'use strict';

var qs = require('qs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var qs__default = /*#__PURE__*/_interopDefault(qs);

const defaults = {
    strictNullHandling: true,
    arrayLimit: 100,
    depth: 20
};
/**
 * Body parser hook
 */ const addQsParser = (app, settings)=>{
    Object.defineProperty(app.request, 'query', {
        configurable: false,
        enumerable: true,
        /*
     * Get parsed query-string.
     */ get () {
            const qstr = this.querystring;
            this._querycache = this._querycache || {};
            const cache = this._querycache;
            if (!cache[qstr]) {
                cache[qstr] = qs__default.default.parse(qstr, settings);
            }
            return cache[qstr];
        },
        /*
     * Set query-string as an object.
     */ set (obj) {
            this.querystring = qs__default.default.stringify(obj);
        }
    });
    return app;
};
const query = (config, { strapi })=>{
    addQsParser(strapi.server.app, {
        ...defaults,
        ...config
    });
};

exports.query = query;
//# sourceMappingURL=query.js.map
