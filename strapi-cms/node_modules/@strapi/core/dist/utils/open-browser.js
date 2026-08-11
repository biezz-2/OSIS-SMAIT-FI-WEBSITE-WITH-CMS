'use strict';

var open = require('open');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var open__default = /*#__PURE__*/_interopDefault(open);

const openBrowser = async (config)=>{
    const url = config.get('admin.absoluteUrl');
    return open__default.default(url);
};

exports.openBrowser = openBrowser;
//# sourceMappingURL=open-browser.js.map
