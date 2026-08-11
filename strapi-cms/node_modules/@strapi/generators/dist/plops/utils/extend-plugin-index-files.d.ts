type AppendType = 'content-type' | 'index' | 'routes';
interface AppendConfig {
    type: AppendType;
    singularName: string;
}
export declare const appendToFile: (template: string, config: AppendConfig) => string;
export {};
//# sourceMappingURL=extend-plugin-index-files.d.ts.map