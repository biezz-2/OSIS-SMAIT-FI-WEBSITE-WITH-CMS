declare function createDefaultConfiguration(schema: any): Promise<{
    settings: any;
    metadatas: any;
    layouts: {
        list: any;
        edit: any;
    };
}>;
declare function syncConfiguration(conf: any, schema: any): Promise<{
    settings: any;
    layouts: {
        list: any;
        edit: any;
    } | {
        list: any;
        edit: any;
    };
    metadatas: any;
}>;
export { createDefaultConfiguration, syncConfiguration };
//# sourceMappingURL=index.d.ts.map