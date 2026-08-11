interface UseAILocalizationJobsPollingOptions {
    documentId?: string;
    model?: string;
    collectionType?: string;
}
export declare const useAILocalizationJobsPolling: ({ documentId, model, collectionType, }: UseAILocalizationJobsPollingOptions) => {
    status: "processing" | "completed" | "failed" | undefined;
};
export {};
