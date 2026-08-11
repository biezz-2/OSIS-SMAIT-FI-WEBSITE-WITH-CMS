'use strict';

var crypto = require('crypto');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var crypto__default = /*#__PURE__*/_interopDefault(crypto);

/**
 * Generate an admin user hash
 */ const generateAdminUserHash = (strapi)=>{
    const ctx = strapi?.requestContext?.get();
    if (!ctx?.state?.user?.email) {
        return '';
    }
    return crypto__default.default.createHash('sha256').update(ctx.state.user.email).digest('hex');
};

exports.generateAdminUserHash = generateAdminUserHash;
//# sourceMappingURL=admin-user-hash.js.map
