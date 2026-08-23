import { describe, expect, it } from 'vitest';
import { AvatarAssetDownloadManager } from './AvatarAssetDownloadManager';

const createManager = (libraries: { id: string; parts: { type: string; id: number }[] }[]) => {
    const manager = new AvatarAssetDownloadManager(null, null);
    const figureMap = new Map<string, { libraryName: string }[]>();

    for(const library of libraries)
    {
        for(const part of library.parts)
        {
            const key = `${ part.type }:${ part.id }`;
            const mappedLibraries = figureMap.get(key) ?? [];

            mappedLibraries.push({ libraryName: library.id });
            figureMap.set(key, mappedLibraries);
        }
    }

    (manager as unknown as { _figureMap: Map<string, { libraryName: string }[]> })._figureMap = figureMap;

    return manager;
};

describe('AvatarAssetDownloadManager.isNftPartSet', () => {
    it('ignores foundational parts shared by standard and NFT libraries', () => {
        const manager = createManager([
            { id: 'hh_human_face', parts: [{ type: 'hd', id: 1 }] },
            { id: 'face_U_nft_example', parts: [{ type: 'hd', id: 1 }, { type: 'ey', id: 9001 }] }
        ]);

        expect(manager.isNftPartSet({ parts: [{ type: 'hd', id: 1 }] })).toBe(false);
        expect(
            manager.isNftPartSet({
                parts: [
                    { type: 'hd', id: 1 },
                    { type: 'ey', id: 9001 }
                ]
            })
        ).toBe(true);
    });

    it('does not classify a standard-only part as NFT', () => {
        const manager = createManager([{ id: 'hair_U_standard', parts: [{ type: 'hr', id: 12 }] }]);

        expect(manager.isNftPartSet({ parts: [{ type: 'hr', id: 12 }] })).toBe(false);
    });
});
