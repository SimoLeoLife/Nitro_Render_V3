export const IMAGE_LIMITS = {
    maxDimension: 8192,
    maxFrames: 500,
    maxDecodedBytes: 256 * 1024 * 1024,
    minFrameDurationMs: 10
} as const;

export interface ImageDimensions
{
    width: number;
    height: number;
    frameCount?: number;
}

export const assertSafeImage = ({ width, height, frameCount = 1 }: ImageDimensions): void =>
{
    if(!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0)
        throw new Error(`Image dimensions must be positive integers (received ${ width }x${ height })`);

    if(width > IMAGE_LIMITS.maxDimension || height > IMAGE_LIMITS.maxDimension)
        throw new Error(`Image dimensions exceed the ${ IMAGE_LIMITS.maxDimension } pixel limit (${ width }x${ height })`);

    if(!Number.isInteger(frameCount) || frameCount <= 0)
        throw new Error(`Image frame count must be a positive integer (received ${ frameCount })`);

    if(frameCount > IMAGE_LIMITS.maxFrames)
        throw new Error(`Image frame count exceeds the ${ IMAGE_LIMITS.maxFrames } frame limit (${ frameCount })`);

    const decodedBytes = width * height * 4 * frameCount;

    if(decodedBytes > IMAGE_LIMITS.maxDecodedBytes)
        throw new Error(`Decoded RGBA image data exceeds the 256 MiB limit (${ decodedBytes } bytes)`);
};
