export interface DecodedAnimationFrame
{
    pixels: Uint8ClampedArray;
    durationMs: number;
}

export interface DecodedAnimation
{
    width: number;
    height: number;
    loopCount: number;
    frames: DecodedAnimationFrame[];
}
