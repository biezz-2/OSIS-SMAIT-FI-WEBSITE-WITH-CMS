import '@strapi/types';
import config from './config.mjs';
import bootstrap from './bootstrap.mjs';
import services from './services/index.mjs';
import exportObject from './controllers/index.mjs';
import routes from './routes/index.mjs';
import register from './register.mjs';
import * as index$1 from './middlewares/index.mjs';

// eslint-disable-next-line import/no-extraneous-dependencies
var index = (()=>({
        config,
        bootstrap,
        register,
        services,
        controllers: exportObject,
        routes,
        middlewares: index$1
    }));

export { index as default };
//# sourceMappingURL=index.mjs.map
