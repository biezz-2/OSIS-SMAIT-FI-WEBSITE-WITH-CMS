import type { Core } from '@strapi/types';
declare const createAILocalizationJobsController: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Get a job for a singleType using the contentType
     * There is only 1 job per contentType
     */
    getJobForSingleType(ctx: any): Promise<any>;
    /**
     * Get a job for a collectionType using the documentId
     * There is only 1 job per documentId
     */
    getJobForCollectionType(ctx: any): Promise<any>;
};
export default createAILocalizationJobsController;
//# sourceMappingURL=ai-localization-jobs.d.ts.map