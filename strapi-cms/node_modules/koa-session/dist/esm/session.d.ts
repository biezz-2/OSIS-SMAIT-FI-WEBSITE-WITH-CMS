import { inspect } from 'node:util';
import type { ContextSession } from './context.js';
type Callback = (err?: Error) => void;
/**
 * Session model
 */
export declare class Session {
    #private;
    isNew: boolean;
    _requireSave: boolean;
    _expire?: number;
    constructor(sessionContext: ContextSession, sessionData?: Record<string, unknown>, externalKey?: string);
    /**
     * JSON representation of the session.
     */
    toJSON(): Record<string, unknown>;
    /**
     * alias to `toJSON`
     */
    [inspect.custom](): Record<string, unknown>;
    /**
     * Return how many values there are in the session object.
     * Used to see if it's "populated".
     */
    get length(): number;
    /**
     * populated flag, which is just a boolean alias of .length.
     */
    get populated(): boolean;
    /**
     * get session maxAge
     */
    get maxAge(): number;
    /**
     * set session maxAge
     */
    set maxAge(val: number);
    /**
     * get session external key
     * only exist if opts.store present
     */
    get externalKey(): string | undefined;
    /**
     * save this session no matter whether it is populated
     *
     * @param {Function} [callback] the optional function to call after saving the session
     */
    save(callback?: Callback): Promise<void> | undefined;
    /**
     * regenerate this session
     *
     * @param  {Function} [callback] the optional function to call after regenerating the session
     */
    regenerate(callback?: Callback): Promise<void> | undefined;
    /**
     * commit this session's headers if autoCommit is set to false
     */
    manuallyCommit(): Promise<void> | undefined;
    commit(options?: any, callback?: Callback): Promise<void> | undefined;
}
export {};
