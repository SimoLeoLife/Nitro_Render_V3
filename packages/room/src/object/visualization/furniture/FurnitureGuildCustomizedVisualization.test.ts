import { IRoomObjectController, RoomObjectVariable } from '@nitrots/api';
import { describe, expect, it, vi } from 'vitest';
import { FurnitureGuildCustomizedVisualization } from './FurnitureGuildCustomizedVisualization';

vi.mock('@nitrots/utils', () => ({
    ChooserSelectionFilter: class {},
    TextureUtils: {}
}));

vi.mock('../../../utils', () => ({
    RoomGeometry: class {}
}));

class TestGuildVisualization extends FurnitureGuildCustomizedVisualization
{
    public updateFromModel(scale: number): boolean
    {
        return this.updateModel(scale);
    }

    protected getLayerTag(scale: number, direction: number, layerId: number): string
    {
        return FurnitureGuildCustomizedVisualization.BADGE;
    }
}

describe('FurnitureGuildCustomizedVisualization', () =>
{
    it('switches badge assets when the guild badge changes', () =>
    {
        let updateCounter = 1;
        let badgeAssetName = 'badge_first';
        const model = {
            get updateCounter(): number
            {
                return updateCounter;
            },
            getValue: <T>(key: string): T =>
            {
                if(key === RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_ASSET_NAME) return badgeAssetName as T;

                return undefined;
            }
        };
        const visualization = new TestGuildVisualization();

        visualization.object = { model } as unknown as IRoomObjectController;
        visualization.updateFromModel(64);

        expect(visualization.getSpriteAssetName(64, 0)).toBe('badge_first');
        expect(visualization.getSpriteAssetName(32, 0)).toBe('badge_first_32');

        badgeAssetName = 'badge_second';
        updateCounter++;
        visualization.updateFromModel(64);

        expect(visualization.getSpriteAssetName(64, 0)).toBe('badge_second');
        expect(visualization.getSpriteAssetName(32, 0)).toBe('badge_second_32');
    });
});
