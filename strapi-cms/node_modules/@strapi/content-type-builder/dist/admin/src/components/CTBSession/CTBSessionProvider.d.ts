import { type ReactNode } from 'react';
interface CTBSessionProviderProps {
    children: ReactNode;
}
/**
 * Generates a unique session identifier for CTB tracking
 * Uses crypto.randomUUID() for guaranteed uniqueness and readability
 *
 * @returns Session ID in format: ctb-{uuid}
 */
export declare const generateSessionId: () => string | undefined;
/**
 * Provider for CTB session tracking context.
 *
 * This provider should wrap components that need to track CTB events with session IDs.
 * It manages the session ID lifecycle and provides methods to regenerate it when needed.
 *
 * Usage:
 * ```tsx
 * <CTBSessionProvider>
 *       {children}
 * </CTBSessionProvider>
 * ```
 */
export declare const CTBSessionProvider: ({ children }: CTBSessionProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
