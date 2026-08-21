import { TextureSource } from 'pixi.js';

export type DprScaleMode = 'nearest' | 'linear';

export const GetDesiredScaleMode = (): DprScaleMode => 'nearest';

export const GetDesiredResolution = (): number => Math.max(1, Math.ceil(window.devicePixelRatio));

export const StartDprRenderingModeWatcher = (): void =>
{
    if(typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    TextureSource.defaultOptions.scaleMode = 'nearest';

    const watch = (): void =>
    {
        const media = window.matchMedia(`(resolution: ${ window.devicePixelRatio }dppx)`);

        const onChange = (): void =>
        {
            media.removeEventListener('change', onChange);

            window.dispatchEvent(new Event('resize'));

            watch();
        };

        media.addEventListener('change', onChange);
    };

    watch();
};
