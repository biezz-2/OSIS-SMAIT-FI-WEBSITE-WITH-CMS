/**
 * AI Metadata Job types shared between admin and server
 */
export interface AIMetadataJob {
    id: number;
    status: 'processing' | 'completed' | 'failed';
    createdAt: Date;
    completedAt?: Date;
}
/**
 * GET /upload/actions/generate-ai-metadata/latest
 *
 * Return the latest AI metadata job
 */
export declare namespace GetLatestAIMetadataJob {
    interface Request {
        query?: {};
    }
    interface Response {
        data: AIMetadataJob | null;
    }
}
/**
 * POST /upload/actions/generate-ai-metadata
 *
 * Start a new AI metadata generation job
 */
export declare namespace StartAIMetadataJob {
    interface Request {
        body?: {};
    }
    interface Response {
        data: {
            jobId: number;
            status: string;
        };
    }
}
/**
 * GET /upload/actions/generate-ai-metadata/count
 *
 * Return count of images without metadata
 */
export declare namespace GetAIMetadataCount {
    interface Request {
        query?: {};
    }
    interface Response {
        data: {
            count: number;
        };
    }
}
