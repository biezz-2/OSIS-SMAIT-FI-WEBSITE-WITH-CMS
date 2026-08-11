const createAiNamespace = (strapi)=>({
        get admin () {
            return strapi.get('ai.admin');
        },
        get mcp () {
            return strapi.get('ai.mcp');
        }
    });

export { createAiNamespace };
//# sourceMappingURL=ai.mjs.map
