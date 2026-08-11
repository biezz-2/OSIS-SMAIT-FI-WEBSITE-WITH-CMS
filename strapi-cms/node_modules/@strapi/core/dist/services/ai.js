'use strict';

const createAiNamespace = (strapi)=>({
        get admin () {
            return strapi.get('ai.admin');
        },
        get mcp () {
            return strapi.get('ai.mcp');
        }
    });

exports.createAiNamespace = createAiNamespace;
//# sourceMappingURL=ai.js.map
