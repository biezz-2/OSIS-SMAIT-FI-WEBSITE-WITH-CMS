/**
 * Wraps a promise with a timeout to prevent hanging operations.
 * The internal timer is always cleared once the race settles, preventing
 * ref'd timer handles from keeping the event loop alive after the operation completes.
 */ const withTimeout = (promise, timeoutMs, operation)=>{
    let timeoutId;
    const timeoutPromise = new Promise((_, reject)=>{
        timeoutId = setTimeout(()=>{
            reject(new Error(`Operation '${operation}' timed out after ${timeoutMs}ms`));
        }, timeoutMs);
    });
    return Promise.race([
        promise,
        timeoutPromise
    ]).finally(()=>{
        clearTimeout(timeoutId);
    });
};

export { withTimeout };
//# sourceMappingURL=withTimeout.mjs.map
