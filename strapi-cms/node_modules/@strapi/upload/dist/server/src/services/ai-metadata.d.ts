import type { Core } from '@strapi/types';
import { File } from '../types';
declare const createAIMetadataService: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    isEnabled(): Promise<boolean>;
    countImagesWithoutMetadata(): Promise<{
        imagesWithoutMetadataCount: number;
        totalImages: number;
    }>;
    /**
     * Update files with AI-generated metadata
     * Shared logic used by both upload flow and retroactive processing
     */
    updateFilesWithAIMetadata(files: File[], metadataResults: Array<{
        altText: string;
        caption: string;
    } | null>, user: {
        id: string | number;
    }): Promise<void>;
    /**
     * Process existing files with job tracking for progress updates
     */
    processExistingFiles(jobId: number, user: {
        id: string | number;
    }): Promise<void>;
    /**
     * Processes provided files for AI metadata generation
     */
    processFiles(files: File[]): Promise<Array<{
        altText: string;
        caption: string;
    } | null>>;
};
export { createAIMetadataService };
//# sourceMappingURL=ai-metadata.d.ts.map