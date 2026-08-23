import { IRoomGeometry } from '@nitrots/api';
import { describe, expect, it, vi } from 'vitest';
import { RoomPlane } from './RoomPlane';

const createReadyPlane = (type: number = RoomPlane.TYPE_FLOOR) =>
{
    const plane = Object.create(RoomPlane.prototype) as RoomPlane;

    Object.assign(plane, {
        _disposed: false,
        _geometryUpdateId: 4,
        _isAnimated: false,
        _type: type,
        _lastAnimationUpdate: 0,
        _canBeVisible: true,
        _isVisible: true,
        _maskChanged: false,
        _planeTexture: {
            width: 10,
            height: 10,
            source: { label: '' }
        },
        _width: 10,
        _height: 10,
        _uniqueId: 1,
        _windowMasks: [],
        _animationLayers: [],
        _landscapeBackgroundTexture: null,
        _landscapeForegroundTexture: null,
        _landscapeBackgroundColor: null
    });

    return plane;
};

describe('RoomPlane dirty result', () =>
{
    it('returns false when a visible static plane has not changed', () =>
    {
        const plane = createReadyPlane();

        expect(plane.update({ updateId: 4 } as IRoomGeometry, 100, false)).toBe(false);
    });

    it('returns true when an animated landscape advances', () =>
    {
        const plane = createReadyPlane(RoomPlane.TYPE_LANDSCAPE);
        const internals = plane as unknown as Record<string, unknown>;

        Object.assign(internals, {
            _isAnimated: true,
            _landscapeBackgroundColor: 0,
            renderBackgroundColor: vi.fn()
        });

        expect(plane.update({ updateId: 4 } as IRoomGeometry, 500, false)).toBe(true);
        expect(internals.renderBackgroundColor).toHaveBeenCalledOnce();
    });
});
