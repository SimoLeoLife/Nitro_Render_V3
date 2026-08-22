import { IRoomGeometry, IRoomObjectController } from '@nitrots/api';
import { describe, expect, it, vi } from 'vitest';
import { RoomVisualization } from './RoomVisualization';

type RoomVisualizationInternals = {
    updateGeometry: (...args: unknown[]) => boolean;
    updateThickness: (...args: unknown[]) => boolean;
    updateHole: (...args: unknown[]) => boolean;
    initializeRoomPlanes: (...args: unknown[]) => void;
    updateMasks: (...args: unknown[]) => boolean;
    updatePlaneTexturesAndVisibilities: (...args: unknown[]) => boolean;
    updatePlanes: (...args: unknown[]) => boolean;
};

const createVisualization = () =>
{
    const visualization = new RoomVisualization();
    const internals = visualization as unknown as RoomVisualizationInternals;

    visualization.object = {
        model: { updateCounter: 7 }
    } as unknown as IRoomObjectController;

    vi.spyOn(internals, 'updateGeometry').mockReturnValue(false);
    vi.spyOn(internals, 'updateThickness').mockReturnValue(false);
    vi.spyOn(internals, 'updateHole').mockReturnValue(false);
    vi.spyOn(internals, 'initializeRoomPlanes').mockImplementation(() => undefined);
    vi.spyOn(internals, 'updateMasks').mockReturnValue(false);
    vi.spyOn(internals, 'updatePlaneTexturesAndVisibilities').mockReturnValue(false);
    vi.spyOn(internals, 'updatePlanes').mockReturnValue(false);

    return { visualization, internals };
};

describe('RoomVisualization dirty counter', () =>
{
    it('keeps the sprite counter stable for a no-op animation tick', () =>
    {
        const { visualization } = createVisualization();
        const initialCounter = visualization.updateSpriteCounter;

        visualization.update({} as IRoomGeometry, 100, true, false);

        expect(visualization.updateSpriteCounter).toBe(initialCounter);
    });

    it('advances the sprite counter when a room plane actually changes', () =>
    {
        const { visualization, internals } = createVisualization();
        const initialCounter = visualization.updateSpriteCounter;

        vi.mocked(internals.updatePlanes).mockReturnValue(true);
        visualization.update({} as IRoomGeometry, 100, true, false);

        expect(visualization.updateSpriteCounter).toBe(initialCounter + 1);
    });
});
