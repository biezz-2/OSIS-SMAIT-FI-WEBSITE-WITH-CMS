declare const _default: {
    /**
     * Decode the base64 cookie value to an object
     * @private
     */
    decode(base64String: string): Record<string, unknown>;
    /**
     * Encode an object into a base64-encoded JSON string
     */
    encode(data: Record<string, unknown>): string;
    hash(data: Record<string, unknown>): number;
    CookieDateEpoch: string;
};
export default _default;
