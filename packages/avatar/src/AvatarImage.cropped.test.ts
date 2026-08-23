import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('AvatarImage native cropped output', () => {
    it('extracts the body-part union at AIR resolution and always releases transient containers', () => {
        const source = readFileSync(resolve(process.cwd(), 'packages/avatar/src/AvatarImage.ts'), 'utf8');
        const methodStart = source.indexOf('public processAsCroppedImageUrl');
        const methodEnd = source.indexOf('public processAsContainer', methodStart);
        const method = source.slice(methodStart, methodEnd);

        expect(methodStart).toBeGreaterThan(-1);
        expect(method).toContain('this.buildAvatarContainer(avatarCanvas, setType)');
        expect(method).toContain('TextureUtils.generateCanvas({ target: container, resolution: 1 })');
        expect(method).toContain('finally');
        expect(method).toContain('child.removeChildren()');
        expect(method).toContain('container.destroy({ children: true })');
        expect(method).toContain('this.disposeTransientBodyParts()');
    });
});
