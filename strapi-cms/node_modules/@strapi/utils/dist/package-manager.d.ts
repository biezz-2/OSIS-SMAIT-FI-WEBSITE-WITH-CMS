import execa from 'execa';
import type { Options as ProcessOptions } from 'execa';
declare const SUPPORTED_PACKAGE_MANAGERS: readonly ["npm", "yarn", "pnpm"];
type SupportedPackageManagerName = (typeof SUPPORTED_PACKAGE_MANAGERS)[number];
export declare const getPreferred: (pkgPath: string) => Promise<SupportedPackageManagerName>;
export declare const installDependencies: (path: string, packageManager: SupportedPackageManagerName, options?: ProcessOptions<string>) => execa.ExecaChildProcess<string>;
export {};
//# sourceMappingURL=package-manager.d.ts.map