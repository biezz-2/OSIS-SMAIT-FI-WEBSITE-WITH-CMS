'use strict';

var provider = require('./provider.js');
var ai$1 = require('../services/ai.js');

var ai = provider.defineProvider({
    init (strapi) {
        strapi.add('ai', (s)=>ai$1.createAiNamespace(s));
    }
});

module.exports = ai;
//# sourceMappingURL=ai.js.map
