'use strict';

var strapiAdmin = require('@strapi/admin/strapi-admin');

const i18nApi = strapiAdmin.adminApi.enhanceEndpoints({
    addTagTypes: [
        'Locale',
        'KeyStatistics',
        'Settings',
        'AILocalizationJobs'
    ]
});

exports.i18nApi = i18nApi;
//# sourceMappingURL=api.js.map
