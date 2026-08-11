import type { Core, Modules, Schema, UID } from '@strapi/types';
/**
 * Merges unsupported field types (media, boolean, enumeration, relation)
 * from a source document into the target data object.
 *
 * Uses traverseEntity to walk the source document and extract only unsupported fields,
 * then deep-merges the AI-translated target data on top so translated values take priority.
 */
declare const mergeUnsupportedFields: (targetData: Record<string, any>, sourceDoc: Record<string, any> | null, schema: Schema.Schema, getModel: (uid: UID.Schema) => Schema.Schema | undefined) => Promise<Record<string, any>>;
declare const createAILocalizationsService: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    isEnabled(): Promise<boolean>;
    /**
     * Checks if there are localizations that need to be generated for the given document,
     * and if so, calls the AI service and saves the results to the database.
     * Works for both single and collection types, on create and update.
     */
    generateDocumentLocalizations({ model, document, }: {
        model: UID.ContentType;
        document: Modules.Documents.AnyDocument;
    }): Promise<void>;
    setupMiddleware(): void;
};
export { createAILocalizationsService, mergeUnsupportedFields };
//# sourceMappingURL=ai-localizations.d.ts.map