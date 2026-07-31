import { describe, expect, it } from 'vitest';
import { assetImageFallbackUrl, isAssetJsonUrl } from './AssetJsonUrl';

describe('asset JSON URLs', () =>
{
    it('recognizes only JSON and JSONC asset data', () =>
    {
        expect(isAssetJsonUrl('https://hotel.test/chair.json')).toBe(true);
        expect(isAssetJsonUrl('https://hotel.test/chair.jsonc')).toBe(true);
        expect(isAssetJsonUrl('https://hotel.test/chair.jsonc?v=1')).toBe(true);
        expect(isAssetJsonUrl('https://hotel.test/chair.json5')).toBe(false);
    });

    it('derives the PNG fallback from a JSONC URL', () =>
    {
        expect(assetImageFallbackUrl('https://hotel.test/chair.jsonc')).toBe('https://hotel.test/chair.png');
        expect(assetImageFallbackUrl('https://hotel.test/chair.json', 'custom')).toBe('https://hotel.test/custom.png');
    });
});
