import execa from 'execa';
import { getPreferredPM } from './get-preferred-pm.mjs';

const SUPPORTED_PACKAGE_MANAGERS = [
    'npm',
    'yarn',
    'pnpm'
];
const DEFAULT_PACKAGE_MANAGER = 'npm';
const getPreferred = async (pkgPath)=>{
    const preferredPM = await getPreferredPM();
    const pm = await preferredPM(pkgPath);
    if (pm == null) {
        throw new Error(`Couldn't find a package manager in your project.`);
    }
    const isPackageManagerSupported = SUPPORTED_PACKAGE_MANAGERS.includes(pm.name);
    if (!isPackageManagerSupported) {
        process.emitWarning(`We detected your package manager (${pm.name} v${pm.version}), but it's not officially supported by Strapi yet. Defaulting to npm instead.`);
        return DEFAULT_PACKAGE_MANAGER;
    }
    return pm.name;
};
const installDependencies = (path, packageManager, options = {})=>{
    return execa(packageManager, [
        'install'
    ], {
        ...options,
        cwd: path,
        stdin: 'ignore'
    });
};

export { getPreferred, installDependencies };
//# sourceMappingURL=package-manager.mjs.map
