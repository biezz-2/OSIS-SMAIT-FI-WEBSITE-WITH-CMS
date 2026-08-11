declare function createDefaultLayouts(schema: any): Promise<{
    list: any;
    edit: any;
}>;
/** Synchronisation functions */
declare function syncLayouts(configuration: any, schema: any): Promise<{
    list: any;
    edit: any;
}> | {
    list: any;
    edit: any;
};
export { createDefaultLayouts, syncLayouts };
//# sourceMappingURL=layouts.d.ts.map