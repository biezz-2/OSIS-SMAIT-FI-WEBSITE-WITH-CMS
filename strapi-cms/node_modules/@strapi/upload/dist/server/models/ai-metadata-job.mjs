const AI_METADATA_JOB_UID = 'plugin::upload.ai-metadata-job';
const aiMetadataJob = {
    uid: AI_METADATA_JOB_UID,
    tableName: 'strapi_ai_metadata_jobs',
    singularName: 'ai-metadata-job',
    attributes: {
        id: {
            type: 'increments'
        },
        status: {
            type: 'enumeration',
            enum: [
                'processing',
                'completed',
                'failed'
            ],
            column: {
                notNullable: true
            }
        },
        createdAt: {
            type: 'datetime',
            default: ()=>new Date()
        },
        completedAt: {
            type: 'datetime',
            default: null
        }
    }
};

export { AI_METADATA_JOB_UID, aiMetadataJob };
//# sourceMappingURL=ai-metadata-job.mjs.map
