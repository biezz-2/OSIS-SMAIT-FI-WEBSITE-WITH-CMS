/**
 * Run tasks together but keep the same error order.
 */ const runParallelWithOrderedErrors = async (promises)=>{
    const results = await Promise.allSettled(promises);
    // Throw first error in array index order (matches sequential behavior)
    for(let i = 0; i < results.length; i += 1){
        const result = results[i];
        if (result.status === 'rejected') {
            throw result.reason;
        }
    }
    return results.map((r)=>r.value);
};

export { runParallelWithOrderedErrors };
//# sourceMappingURL=ordered-parallel.mjs.map
