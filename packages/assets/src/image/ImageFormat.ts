export type ImageFormat = 'png' | 'jpeg' | 'gif' | 'webp' | 'avif' | 'svg' | 'bmp' | 'unknown';

export interface DetectedImageFormat
{
    format: ImageFormat;
    mimeType: string;
    animated: boolean;
}
