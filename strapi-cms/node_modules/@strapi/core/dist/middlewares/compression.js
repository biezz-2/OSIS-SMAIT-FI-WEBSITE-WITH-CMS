'use strict';

var compress = require('koa-compress');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var compress__default = /*#__PURE__*/_interopDefault(compress);

const compression = (config)=>compress__default.default(config);

exports.compression = compression;
//# sourceMappingURL=compression.js.map
