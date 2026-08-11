'use strict';

var aiLocalizationJob = require('../models/ai-localization-job.js');

const createAILocalizationJobsService = ({ strapi })=>({
        /**
   * Create a new AI localizations job or update an existing one for a document
   * Ensures only one job exists per document
   */ async upsertJobForDocument ({ documentId, contentType, sourceLocale, targetLocales, status = 'processing' }) {
            // Check if job already exists for this document
            const existingJob = await this.getJobByDocument(contentType, documentId);
            if (existingJob) {
                strapi.log.info(`[AI Localizations Job] Updated existing job for document ${documentId} with status: ${status}`);
                // Update existing job with new data and status
                return strapi.db.query(aiLocalizationJob.AI_LOCALIZATION_JOB_UID).update({
                    where: {
                        id: existingJob.id
                    },
                    data: {
                        contentType,
                        sourceLocale,
                        targetLocales,
                        status,
                        updatedAt: new Date()
                    }
                });
            }
            strapi.log.info(`[AI Localizations Job] Created new job for document ${documentId} with status: ${status}`);
            // Create new AI localizations job
            return strapi.db.query(aiLocalizationJob.AI_LOCALIZATION_JOB_UID).create({
                data: {
                    contentType,
                    relatedDocumentId: documentId,
                    sourceLocale,
                    targetLocales,
                    status,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        },
        /**
   * Get job by document ID
   */ async getJobByDocument (contentType, documentId) {
            return strapi.db.query(aiLocalizationJob.AI_LOCALIZATION_JOB_UID).findOne({
                where: {
                    relatedDocumentId: documentId,
                    contentType
                }
            });
        },
        /**
   * Get job by content type
   */ async getJobByContentType (contentType) {
            return strapi.db.query(aiLocalizationJob.AI_LOCALIZATION_JOB_UID).findOne({
                where: {
                    contentType
                }
            });
        }
    });

exports.createAILocalizationJobsService = createAILocalizationJobsService;
//# sourceMappingURL=ai-localization-jobs.js.map
