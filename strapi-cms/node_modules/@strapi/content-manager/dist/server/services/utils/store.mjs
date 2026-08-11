import _ from 'lodash';

const keys = {
    CONFIGURATION: 'configuration'
};
const STORE_KEY_PREFIX = 'plugin_content_manager_';
const getStore = ()=>strapi.store({
        type: 'plugin',
        name: 'content_manager'
    });
/** Model configuration */ const EMPTY_CONFIG = {
    settings: {},
    metadatas: {},
    layouts: {
        list: [],
        edit: []
    }
};
const configurationKey = (key)=>`${keys.CONFIGURATION}_${key}`;
const getModelConfiguration = async (key)=>{
    const config = await getStore().get({
        key: configurationKey(key)
    });
    return _.merge({}, EMPTY_CONFIG, config);
};
/**
 * Batch load multiple model configurations in a single query.
 *
 * @param keys - Array of configuration keys (e.g., ['components::sections.hero', ...])
 * @returns Map of key -> configuration object
 */ const getModelConfigurations = async (keys)=>{
    if (keys.length === 0) {
        return {};
    }
    const configKeys = keys.map((k)=>`${STORE_KEY_PREFIX}${configurationKey(k)}`);
    const results = await strapi.db.query('strapi::core-store').findMany({
        where: {
            key: {
                $in: configKeys
            }
        }
    });
    const configMap = {};
    for (const result of results){
        const originalKey = result.key.replace(`${STORE_KEY_PREFIX}configuration_`, '');
        try {
            const value = typeof result.value === 'string' ? JSON.parse(result.value) : result.value;
            configMap[originalKey] = _.merge({}, EMPTY_CONFIG, value);
        } catch  {
            strapi.log.warn(`Malformed JSON in core-store key "${result.key}", using default config`);
        }
    }
    // Default missing keys to empty config
    for (const key of keys){
        if (!configMap[key]) {
            configMap[key] = _.merge({}, EMPTY_CONFIG);
        }
    }
    return configMap;
};
const setModelConfiguration = async (key, value)=>{
    const storedConfig = await getStore().get({
        key: configurationKey(key)
    }) || {};
    const currentConfig = {
        ...storedConfig
    };
    Object.keys(value).forEach((key)=>{
        if (value[key] !== null && value[key] !== undefined) {
            _.set(currentConfig, key, value[key]);
        }
    });
    if (!_.isEqual(currentConfig, storedConfig)) {
        return getStore().set({
            key: configurationKey(key),
            value: currentConfig
        });
    }
};
const deleteKey = (key)=>{
    return strapi.db.query('strapi::core-store').delete({
        where: {
            key: `${STORE_KEY_PREFIX}configuration_${key}`
        }
    });
};
const findByKey = async (key)=>{
    const results = await strapi.db.query('strapi::core-store').findMany({
        where: {
            key: {
                $startsWith: key
            }
        }
    });
    return results.map(({ key, value })=>{
        try {
            return JSON.parse(value);
        } catch  {
            strapi.log.warn(`Malformed JSON in core-store key "${key}", skipping entry`);
            return null;
        }
    }).filter((v)=>v !== null);
};
const getAllConfigurations = ()=>findByKey(`${STORE_KEY_PREFIX}configuration`);
var storeUtils = {
    getAllConfigurations,
    findByKey,
    getModelConfiguration,
    getModelConfigurations,
    setModelConfiguration,
    deleteKey,
    keys
};

export { storeUtils as default };
//# sourceMappingURL=store.mjs.map
