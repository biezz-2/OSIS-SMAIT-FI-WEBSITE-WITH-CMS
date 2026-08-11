import type { Core } from '@strapi/types';
import { InputFile } from '../types';
/**
 * Builds FormData from an array of input files by fetching each image
 */
export declare function buildFormDataFromFiles(files: InputFile[], serverAbsoluteUrl: string, logger: Core.Strapi['log']): Promise<FormData>;
//# sourceMappingURL=images.d.ts.map