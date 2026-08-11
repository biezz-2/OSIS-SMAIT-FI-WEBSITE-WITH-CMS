'use strict';

var koaIp = require('koa-ip');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var koaIp__default = /*#__PURE__*/_interopDefault(koaIp);

const ip = (config)=>koaIp__default.default(config);

exports.ip = ip;
//# sourceMappingURL=ip.js.map
