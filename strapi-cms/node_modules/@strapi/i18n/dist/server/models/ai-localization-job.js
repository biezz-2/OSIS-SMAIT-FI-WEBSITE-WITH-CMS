'use strict';

const AI_LOCALIZATION_JOB_UID = 'plugin::i18n.ai-localization-job';
const aiLocalizationJob = {
    uid: AI_LOCALIZATION_JOB_UID,
    tableName: 'strapi_ai_localization_jobs',
    singularName: 'ai-localization-job',
    attributes: {
        id: {
            type: 'increments'
        },
        contentType: {
            type: 'string',
            column: {
                notNullable: true
            }
        },
        relatedDocumentId: {
            type: 'string',
            column: {
                notNullable: true
            }
        },
        sourceLocale: {
            type: 'string',
            column: {
                notNullable: true
            }
        },
        targetLocales: {
            type: 'json',
            column: {
                notNullable: true
            }
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
        updatedAt: {
            type: 'datetime',
            default: ()=>new Date()
        }
    }
};

exports.AI_LOCALIZATION_JOB_UID = AI_LOCALIZATION_JOB_UID;
exports.aiLocalizationJob = aiLocalizationJob;
//# sourceMappingURL=ai-localization-job.js.map
