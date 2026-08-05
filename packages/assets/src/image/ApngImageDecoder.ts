import parseAPNG, { APNG } from 'apng-js';
import { createCanvasAnimatedResource } from './CanvasAnimatedTexture';
import { DecodedAnimation } from './DecodedAnimation';
import { assertSafeImage } from './ImageLimits';
import { LoadedImageResource } from './ImageResource';

export interface ApngImageDecoderDependencies
{
    parse(buffer: ArrayBuffer): Error | APNG;
    createContext(width: number, height: number): CanvasRenderingContext2D;
    createAnimatedResource(animation: DecodedAnimation, format: 'png'): LoadedImageResource;
}

export const decodeApngImage = async (
    bytes: Uint8Array,
    dependencies: ApngImageDecoderDependencies = DEFAULT_DEPENDENCIES
): Promise<LoadedImageResource> =>
{
    const parsed = dependencies.parse(Uint8Array.from(bytes).buffer);

    if(parsed instanceof Error) throw parsed;

    assertSafeImage({ width: parsed.width, height: parsed.height, frameCount: parsed.frames.length });

    await parsed.createImages();

    const context = dependencies.createContext(parsed.width, parsed.height);
    const player = await parsed.getPlayer(context, false);
    const frames: DecodedAnimation['frames'] = [];

    try
    {
        for(let index = 0; index < parsed.frames.length; index++)
        {
            if(index > 0) player.renderNextFrame();

            const imageData = context.getImageData(0, 0, parsed.width, parsed.height);
            const pixels = new Uint8ClampedArray(imageData.data.byteLength);

            pixels.set(imageData.data);
            frames.push({ pixels, durationMs: parsed.frames[index].delay });
        }
    }
    finally
    {
        player.stop();
    }

    return dependencies.createAnimatedResource({
        width: parsed.width,
        height: parsed.height,
        loopCount: parsed.numPlays,
        frames
    }, 'png');
};

const createContext = (width: number, height: number): CanvasRenderingContext2D =>
{
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if(!context) throw new Error('Could not create a 2D canvas context for APNG decoding');

    return context;
};

const DEFAULT_DEPENDENCIES: ApngImageDecoderDependencies = {
    parse: parseAPNG,
    createContext,
    createAnimatedResource: createCanvasAnimatedResource
};
