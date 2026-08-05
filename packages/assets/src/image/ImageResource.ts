import { Texture } from 'pixi.js';
import { ImageFormat } from './ImageFormat';

export interface LoadedImageResource
{
    texture: Texture;
    format: ImageFormat;
    animated: boolean;
    dispose(): void;
}

export interface DecodedRgbaImage
{
    width: number;
    height: number;
    data: Uint8Array | Uint8ClampedArray;
}
