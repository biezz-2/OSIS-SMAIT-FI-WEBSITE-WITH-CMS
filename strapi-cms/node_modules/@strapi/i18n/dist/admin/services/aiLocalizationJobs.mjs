import { i18nApi } from './api.mjs';

// Import the same constant used by the documents service for consistency
const SINGLE_TYPES = 'single-types';
const aiLocalizationJobsApi = i18nApi.injectEndpoints({
    endpoints: (builder)=>({
            getAILocalizationJobsByDocument: builder.query({
                query: ({ documentId, collectionType, model })=>({
                        url: collectionType === SINGLE_TYPES ? `/i18n/ai-localization-jobs/single-types/${model}` : `/i18n/ai-localization-jobs/collection-types/${model}/${documentId}`,
                        method: 'GET'
                    }),
                providesTags: (result, error, { documentId, model, collectionType })=>[
                        {
                            type: 'AILocalizationJobs',
                            id: collectionType !== SINGLE_TYPES ? `${model}_${documentId}` : model
                        }
                    ]
            })
        })
});
const { useGetAILocalizationJobsByDocumentQuery } = aiLocalizationJobsApi;

export { useGetAILocalizationJobsByDocumentQuery };
//# sourceMappingURL=aiLocalizationJobs.mjs.map
