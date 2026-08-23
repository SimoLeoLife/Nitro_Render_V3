import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { AvatarImage } from './AvatarImage';

describe('AvatarImage native cropped output', () => {
    it('extracts the body-part union at AIR resolution and always releases transient containers', () => {
        const source = readFileSync(resolve(process.cwd(), 'packages/avatar/src/AvatarImage.ts'), 'utf8');
        const methodStart = source.indexOf('public processAsCroppedImageUrl');
        const methodEnd = source.indexOf('public processAsContainer', methodStart);
        const method = source.slice(methodStart, methodEnd);

        expect(methodStart).toBeGreaterThan(-1);
        expect(method).toContain('this.buildAvatarContainer(avatarCanvas, setType)');
        expect(method).toContain('TextureUtils.generateCanvas({ target: container, resolution: 1 })');
        expect(method).toContain('AvatarImage.cropCanvasToOpaqueBounds(canvas)');
        expect(method).toContain('finally');
        expect(method).toContain('child.removeChildren()');
        expect(method).toContain('container.destroy({ children: true })');
        expect(method).toContain('this.disposeTransientBodyParts()');
    });

    it('removes transparent positioning space from the extracted canvas', () => {
        const width = 6;
        const height = 5;
        const pixels = new Uint8ClampedArray(width * height * 4);

        for(let y = 1; y <= 3; y++)
        {
            for(let x = 2; x <= 4; x++) pixels[((y * width) + x) * 4 + 3] = 255;
        }

        const croppedImage = { data: new Uint8ClampedArray(3 * 3 * 4), width: 3, height: 3 };
        const putImageData = vi.fn();
        const getImageData = vi.fn((x: number, y: number, requestedWidth: number, requestedHeight: number) =>
        {
            if(x === 0 && y === 0 && requestedWidth === width && requestedHeight === height) return { data: pixels, width, height };

            expect([ x, y, requestedWidth, requestedHeight ]).toEqual([ 2, 1, 3, 3 ]);

            return croppedImage;
        });
        const context = { getImageData, putImageData };
        const canvas = {
            width,
            height,
            getContext: vi.fn(() => context)
        };

        (AvatarImage as unknown as { cropCanvasToOpaqueBounds: (target: typeof canvas) => void }).cropCanvasToOpaqueBounds(canvas);

        expect(canvas).toMatchObject({ width: 3, height: 3 });
        expect(putImageData).toHaveBeenCalledWith(croppedImage, 0, 0);
    });
});
