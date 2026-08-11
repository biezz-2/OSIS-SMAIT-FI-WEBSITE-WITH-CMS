import type { File as FileDefinition, RawFile, FocalPoint } from '../../../../../shared/contracts/files';
interface Asset extends Omit<FileDefinition, 'folder'> {
    isLocal?: boolean;
    rawFile?: RawFile;
    folder?: FileDefinition['folder'] & {
        id: number;
    };
}
interface PreviewBoxProps {
    asset: Asset;
    canUpdate: boolean;
    canCopyLink: boolean;
    canDownload: boolean;
    replacementFile?: File;
    onDelete: (asset?: Asset | null) => void;
    onCropFinish: () => void;
    onCropStart: () => void;
    onCropCancel: () => void;
    trackedLocation?: string;
    formFocalPoint?: FocalPoint | null;
    onFocalPointStart: () => void;
    onFocalPointFinish: (focalPoint: FocalPoint) => void;
    onFocalPointCancel: () => void;
}
export declare const PreviewBox: ({ asset, canUpdate, canCopyLink, canDownload, onDelete, onCropFinish, onCropStart, onCropCancel, replacementFile, trackedLocation, formFocalPoint, onFocalPointStart, onFocalPointFinish, onFocalPointCancel, }: PreviewBoxProps) => import("react/jsx-runtime").JSX.Element;
export {};
