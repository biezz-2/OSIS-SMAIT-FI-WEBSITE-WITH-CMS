import * as React from 'react';
interface AssetPreviewProps extends React.HTMLAttributes<HTMLElement> {
    mime: string;
    name: string;
    url: string;
}
export declare const AssetPreview: React.ForwardRefExoticComponent<AssetPreviewProps & React.RefAttributes<HTMLAudioElement | HTMLVideoElement | HTMLImageElement>>;
export {};
