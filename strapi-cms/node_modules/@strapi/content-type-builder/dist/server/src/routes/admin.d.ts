declare const _default: {
    type: string;
    routes: ({
        method: string;
        path: string;
        handler: string;
        config: {
            policies: {
                name: string;
                config: {
                    actions: string[];
                };
            }[];
            middlewares?: undefined;
        };
    } | {
        method: string;
        path: string;
        handler: string;
        config: {
            policies: {
                name: string;
                config: {
                    actions: string[];
                };
            }[];
            middlewares: ((ctx: import("koa").Context, next: import("koa").Next) => Promise<void>)[];
        };
    })[];
};
export default _default;
//# sourceMappingURL=admin.d.ts.map