'use strict';

var strapiAdmin = require('@strapi/admin/strapi-admin');

const contentManagerApi = strapiAdmin.adminApi.enhanceEndpoints({
    addTagTypes: [
        'ComponentConfiguration',
        'ContentTypesConfiguration',
        'ContentTypeSettings',
        'Document',
        'InitialData',
        'HistoryVersion',
        'Relations',
        'UidAvailability',
        'RecentDocumentList',
        'GuidedTourMeta',
        'CountDocuments',
        'UpcomingReleasesList',
        'AILocalizationJobs'
    ]
});

exports.contentManagerApi = contentManagerApi;
//# sourceMappingURL=api.js.map
