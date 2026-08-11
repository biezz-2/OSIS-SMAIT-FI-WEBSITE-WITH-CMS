/**
 * Hook to access the current CTB session context.
 *
 * @throws Error if used outside of CTBSessionProvider
 * @returns The CTB session context containing sessionId and regenerateSessionId
 *
 * @example
 * ```tsx
 * const { sessionId, regenerateSessionId } = useCTBSession();
 * ```
 */
export declare const useCTBSession: () => import("./sessionContext").CTBSessionContextValue;
