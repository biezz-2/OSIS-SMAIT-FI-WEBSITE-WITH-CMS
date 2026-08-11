interface Options {
    appDir?: string;
    ignoreDiagnostics?: boolean;
}
export default function compile(options?: Options): Promise<{
    appDir: string;
    distDir: string | undefined;
}>;
export {};
//# sourceMappingURL=compile.d.ts.map