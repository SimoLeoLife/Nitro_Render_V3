import { createCanvasAnimatedResource } from './CanvasAnimatedTexture';
import { DecodedAnimation } from './DecodedAnimation';
import { assertSafeImage } from './ImageLimits';
import { LoadedImageResource } from './ImageResource';

export interface DecodedWebPFrame
{
    width: number;
    height: number;
    duration: number;
    data: Uint8Array;
}

export interface WebPImageDecoderDependencies
{
    decodeNative?: (bytes: Uint8Array) => Promise<DecodedWebPFrame[] | null>;
    decodeWasm(bytes: Uint8Array, hasAlpha: boolean): Promise<DecodedWebPFrame[] | null>;
    createAnimatedResource(animation: DecodedAnimation, format: 'webp'): LoadedImageResource;
}

export const decodeAnimatedWebPImage = async (
    bytes: Uint8Array,
    dependencies: WebPImageDecoderDependencies = DEFAULT_DEPENDENCIES
): Promise<LoadedImageResource> =>
{
    let decodedFrames: DecodedWebPFrame[] | null = null;

    if(dependencies.decodeNative)
    {
        try
        {
            decodedFrames = await dependencies.decodeNative(bytes);
        }
        catch
        {
            decodedFrames = null;
        }
    }

    if(!decodedFrames?.length) decodedFrames = await dependencies.decodeWasm(bytes, true);
    if(!decodedFrames?.length) throw new Error('The animated WebP decoder returned no frames');

    const width = decodedFrames[0].width;
    const height = decodedFrames[0].height;

    assertSafeImage({ width, height, frameCount: decodedFrames.length });

    const frames = decodedFrames.map((frame, index) =>
    {
        if(frame.width !== width || frame.height !== height)
            throw new Error(`Animated WebP frame ${ index } dimensions do not match the animation canvas`);

        const pixels = new Uint8ClampedArray(frame.data.byteLength);

        pixels.set(frame.data);

        return { pixels, durationMs: frame.duration };
    });

    return dependencies.createAnimatedResource({
        width,
        height,
        loopCount: readWebPLoopCount(bytes),
        frames
    }, 'webp');
};

export const readWebPLoopCount = (bytes: Uint8Array): number =>
{
    if(!asciiAt(bytes, 0, 'RIFF') || !asciiAt(bytes, 8, 'WEBP')) return 0;

    let offset = 12;

    while(offset + 8 <= bytes.length)
    {
        const chunkSize = readUint32(bytes, offset + 4);
        const dataOffset = offset + 8;

        if(asciiAt(bytes, offset, 'ANIM') && chunkSize >= 6 && dataOffset + 6 <= bytes.length)
            return bytes[dataOffset + 4] | (bytes[dataOffset + 5] << 8);

        offset = dataOffset + chunkSize + (chunkSize & 1);
    }

    return 0;
};

const decodeWebPWithWasm = async (bytes: Uint8Array, hasAlpha: boolean): Promise<DecodedWebPFrame[] | null> =>
{
    const { decodeAnimation } = await import('wasm-webp');

    return decodeAnimation(Uint8Array.from(bytes), hasAlpha);
};

const decodeWebPWithImageDecoder = async (bytes: Uint8Array): Promise<DecodedWebPFrame[] | null> =>
{
    const ImageDecoderConstructor = (globalThis as unknown as { ImageDecoder?: BrowserImageDecoderConstructor }).ImageDecoder;

    if(!ImageDecoderConstructor || !await ImageDecoderConstructor.isTypeSupported('image/webp')) return null;

    const decoder = new ImageDecoderConstructor({ data: Uint8Array.from(bytes), type: 'image/webp' });

    try
    {
        await decoder.tracks.ready;

        const frameCount = decoder.tracks.selectedTrack?.frameCount ?? 0;

        if(frameCount <= 1) return null;

        const frames: DecodedWebPFrame[] = [];

        for(let frameIndex = 0; frameIndex < frameCount; frameIndex++)
        {
            const result = await decoder.decode({ frameIndex });
            const frame = result.image;
            const width = frame.displayWidth || frame.codedWidth;
            const height = frame.displayHeight || frame.codedHeight;
            const canvas = document.createElement('canvas');

            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext('2d');

            if(!context)
            {
                frame.close();
                throw new Error('Could not create a 2D canvas context for native WebP decoding');
            }

            context.drawImage(frame as unknown as CanvasImageSource, 0, 0);

            const imageData = context.getImageData(0, 0, width, height);
            const data = new Uint8Array(imageData.data.byteLength);

            data.set(imageData.data);
            frames.push({ width, height, duration: Math.max(0, (frame.duration ?? 0) / 1000), data });
            frame.close();
        }

        return frames;
    }
    finally
    {
        decoder.close();
    }
};

interface BrowserImageDecoderConstructor
{
    isTypeSupported(type: string): Promise<boolean>;
    new(options: { data: Uint8Array; type: string }): BrowserImageDecoder;
}

interface BrowserImageDecoder
{
    tracks: {
        ready: Promise<void>;
        selectedTrack?: { frameCount: number };
    };
    decode(options: { frameIndex: number }): Promise<{ image: BrowserVideoFrame }>;
    close(): void;
}

interface BrowserVideoFrame
{
    displayWidth: number;
    displayHeight: number;
    codedWidth: number;
    codedHeight: number;
    duration: number | null;
    close(): void;
}

const asciiAt = (bytes: Uint8Array, offset: number, value: string): boolean =>
{
    if(offset < 0 || offset + value.length > bytes.length) return false;

    for(let index = 0; index < value.length; index++)
    {
        if(bytes[offset + index] !== value.charCodeAt(index)) return false;
    }

    return true;
};

const readUint32 = (bytes: Uint8Array, offset: number): number =>
{
    if(offset < 0 || offset + 4 > bytes.length) return 0;

    return (bytes[offset]
        | (bytes[offset + 1] << 8)
        | (bytes[offset + 2] << 16)
        | (bytes[offset + 3] << 24)) >>> 0;
};

const DEFAULT_DEPENDENCIES: WebPImageDecoderDependencies = {
    decodeNative: decodeWebPWithImageDecoder,
    decodeWasm: decodeWebPWithWasm,
    createAnimatedResource: createCanvasAnimatedResource
};
