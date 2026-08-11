import { existsSync } from 'fs';
import { resolve } from 'path';
import koaFavicon from 'koa-favicon';

const defaults = {
    path: 'favicon.png',
    maxAge: 86400000
};
const favicon = (config, { strapi })=>{
    const { maxAge, path: faviconPathConfig } = {
        ...defaults,
        ...config
    };
    const { root: appRoot } = strapi.dirs.app;
    let faviconPath = faviconPathConfig;
    if (!existsSync(resolve(appRoot, faviconPathConfig))) {
        if (existsSync(resolve(appRoot, defaults.path))) {
            faviconPath = defaults.path;
        } else if (existsSync(resolve(appRoot, 'favicon.ico'))) {
            faviconPath = 'favicon.ico';
        }
    }
    return koaFavicon(resolve(appRoot, faviconPath), {
        maxAge
    });
};

export { favicon };
//# sourceMappingURL=favicon.mjs.map
