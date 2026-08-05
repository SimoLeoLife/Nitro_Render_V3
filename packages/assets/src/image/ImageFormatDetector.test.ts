import { describe, expect, it } from 'vitest';
import { detectImageFormat, normalizedSourceExtension } from './ImageFormatDetector';

const ascii = (value: string): number[] => Array.from(value, character => character.charCodeAt(0));
const gifWithFrames = (frameCount: number): Uint8Array => new Uint8Array([
    ...ascii('GIF89a'),
    1, 0, 1, 0, 0, 0, 0,
    ...Array.from({ length: frameCount }, () => [ 0x2c, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 1, 0, 0 ]).flat(),
    0x3b
]);

describe('detectImageFormat', () =>
{
    it.each([
        [ 'png', new Uint8Array([ 0x89, ...ascii('PNG\r\n\x1a\n'), 0, 0, 0, 0, ...ascii('IHDR') ]), 'image/png' ],
        [ 'gif', gifWithFrames(1), 'image/gif' ],
        [ 'jpeg', new Uint8Array([ 0xff, 0xd8, 0xff, 0xe0 ]), 'image/jpeg' ],
        [ 'avif', new Uint8Array([ 0, 0, 0, 24, ...ascii('ftyp'), ...ascii('avif'), 0, 0, 0, 0, ...ascii('avif') ]), 'image/avif' ],
        [ 'svg', new TextEncoder().encode('\ufeff  \n<svg xmlns="http://www.w3.org/2000/svg"></svg>'), 'image/svg+xml' ],
        [ 'bmp', new Uint8Array([ 0x42, 0x4d, 0, 0 ]), 'image/bmp' ]
    ])('detects a static %s payload from its signature', (format, bytes, mimeType) =>
    {
        expect(detectImageFormat(bytes)).toEqual({ format, mimeType, animated: false });
    });

    it('detects APNG from the acTL chunk', () =>
    {
        const bytes = new Uint8Array([ 0x89, ...ascii('PNG\r\n\x1a\n'), 0, 0, 0, 0, ...ascii('IHDR'), ...ascii('acTL') ]);

        expect(detectImageFormat(bytes)).toEqual({ format: 'png', mimeType: 'image/png', animated: true });
    });

    it('detects GIF animation only when the payload contains multiple image frames', () =>
    {
        expect(detectImageFormat(gifWithFrames(2))).toEqual({ format: 'gif', mimeType: 'image/gif', animated: true });
    });

    it('detects animated WebP and trusts bytes over a misleading MIME and URL', () =>
    {
        const bytes = new Uint8Array([
            ...ascii('RIFF'), 20, 0, 0, 0, ...ascii('WEBP'), ...ascii('VP8X'), 0, 0, 0, 0, ...ascii('ANIM')
        ]);

        expect(detectImageFormat(bytes, 'image/png', 'https://cdn.example/image.PNG?v=1')).toEqual({
            format: 'webp',
            mimeType: 'image/webp',
            animated: true
        });
    });

    it('uses the normalized MIME type before the source extension when bytes are inconclusive', () =>
    {
        expect(detectImageFormat(new Uint8Array(), 'image/avif; charset=binary', 'wrong.jpg')).toEqual({
            format: 'avif',
            mimeType: 'image/avif',
            animated: false
        });
    });

    it('uses a normalized source extension as the last hint', () =>
    {
        expect(detectImageFormat(new Uint8Array(), '', 'https://cdn.example/image.WeBp?v=2#preview')).toEqual({
            format: 'webp',
            mimeType: 'image/webp',
            animated: false
        });
    });

    it('returns unknown when no signal identifies an image', () =>
    {
        expect(detectImageFormat(new Uint8Array([ 1, 2, 3 ]), 'application/octet-stream', '/asset.bin')).toEqual({
            format: 'unknown',
            mimeType: 'application/octet-stream',
            animated: false
        });
    });
});

describe('normalizedSourceExtension', () =>
{
    it('normalizes uppercase extensions and removes query strings and fragments', () =>
    {
        expect(normalizedSourceExtension('https://cdn.example/x.AvIf?v=2#hero')).toBe('avif');
    });

    it('supports relative paths and extensionless endpoints', () =>
    {
        expect(normalizedSourceExtension('../assets/icon.JPEG?revision=3')).toBe('jpeg');
        expect(normalizedSourceExtension('/image/42')).toBe('');
    });
});
