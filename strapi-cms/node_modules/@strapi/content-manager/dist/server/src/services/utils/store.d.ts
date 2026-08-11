declare const _default: {
    getAllConfigurations: () => Promise<any[]>;
    findByKey: (key: any) => Promise<any[]>;
    getModelConfiguration: (key: any) => Promise<{
        settings: {};
        metadatas: {};
        layouts: {
            list: never[];
            edit: never[];
        };
    }>;
    getModelConfigurations: (keys: string[]) => Promise<Record<string, any>>;
    setModelConfiguration: (key: string, value: any) => Promise<void>;
    deleteKey: (key: any) => Promise<any>;
    keys: {
        CONFIGURATION: string;
    };
};
export default _default;
//# sourceMappingURL=store.d.ts.map