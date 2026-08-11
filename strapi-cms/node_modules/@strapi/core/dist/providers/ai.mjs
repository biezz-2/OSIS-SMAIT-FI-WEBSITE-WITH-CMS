import { defineProvider } from './provider.mjs';
import { createAiNamespace } from '../services/ai.mjs';

var ai = defineProvider({
    init (strapi) {
        strapi.add('ai', (s)=>createAiNamespace(s));
    }
});

export { ai as default };
//# sourceMappingURL=ai.mjs.map
