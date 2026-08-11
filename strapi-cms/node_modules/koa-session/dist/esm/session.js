import { inspect } from 'node:util';
/**
 * Session model
 */
export class Session {
    #sessCtx;
    #ctx;
    #externalKey;
    isNew = false;
    _requireSave = false;
    // session expire time, will be set from sessionData
    _expire;
    constructor(sessionContext, sessionData, externalKey) {
        this.#sessCtx = sessionContext;
        this.#ctx = sessionContext.ctx;
        this.#externalKey = externalKey;
        if (!sessionData) {
            this.isNew = true;
        }
        else {
            for (const k in sessionData) {
                // restore maxAge from store
                if (k === '_maxAge') {
                    this.#ctx.sessionOptions.maxAge = sessionData._maxAge;
                }
                else if (k === '_session') {
                    // set maxAge to 'session' if it's a session lifetime
                    this.#ctx.sessionOptions.maxAge = 'session';
                }
                else {
                    Reflect.set(this, k, sessionData[k]);
                }
            }
        }
    }
    /**
     * JSON representation of the session.
     */
    toJSON() {
        const obj = {};
        for (const key in this) {
            if (key === 'isNew')
                continue;
            // skip private stuff
            if (key[0] === '_')
                continue;
            const value = this[key];
            // skip functions
            if (typeof value === 'function')
                continue;
            obj[key] = value;
        }
        return obj;
    }
    /**
     * alias to `toJSON`
     */
    [inspect.custom]() {
        return this.toJSON();
    }
    /**
     * Return how many values there are in the session object.
     * Used to see if it's "populated".
     */
    get length() {
        return Object.keys(this.toJSON()).length;
    }
    /**
     * populated flag, which is just a boolean alias of .length.
     */
    get populated() {
        return !!this.length;
    }
    /**
     * get session maxAge
     */
    get maxAge() {
        return this.#ctx.sessionOptions.maxAge;
    }
    /**
     * set session maxAge
     */
    set maxAge(val) {
        this.#ctx.sessionOptions.maxAge = val;
        // maxAge changed, must save to cookie and store
        this._requireSave = true;
    }
    /**
     * get session external key
     * only exist if opts.store present
     */
    get externalKey() {
        return this.#externalKey;
    }
    /**
     * save this session no matter whether it is populated
     *
     * @param {Function} [callback] the optional function to call after saving the session
     */
    save(callback) {
        return this.commit({ save: true }, callback);
    }
    /**
     * regenerate this session
     *
     * @param  {Function} [callback] the optional function to call after regenerating the session
     */
    regenerate(callback) {
        return this.commit({ regenerate: true }, callback);
    }
    /**
     * commit this session's headers if autoCommit is set to false
     */
    manuallyCommit() {
        return this.commit();
    }
    commit(options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        const promise = this.#sessCtx.commit(options);
        if (callback) {
            promise.then(() => callback(), callback);
        }
        else {
            return promise;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFLcEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sT0FBTztJQUNsQixRQUFRLENBQWlCO0lBQ3pCLElBQUksQ0FBTTtJQUNWLFlBQVksQ0FBVTtJQUN0QixLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2QsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUNyQixvREFBb0Q7SUFDcEQsT0FBTyxDQUFVO0lBRWpCLFlBQVksY0FBOEIsRUFBRSxXQUFxQyxFQUFFLFdBQW9CO1FBQ3JHLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDcEIsQ0FBQzthQUFNLENBQUM7WUFDTixLQUFLLE1BQU0sQ0FBQyxJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUM1Qiw0QkFBNEI7Z0JBQzVCLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztnQkFDeEQsQ0FBQztxQkFBTSxJQUFJLENBQUMsS0FBSyxVQUFVLEVBQUUsQ0FBQztvQkFDNUIscURBQXFEO29CQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO2dCQUM5QyxDQUFDO3FCQUFNLENBQUM7b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFdB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