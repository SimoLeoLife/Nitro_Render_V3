import { IRoomObject, IRoomObjectSprite, IRoomObjectSpriteVisualization } from '@nitrots/api';
import { describe, expect, it, vi } from 'vitest';
import { RoomObjectCache } from './cache';
import { RoomSpriteCanvas } from './RoomSpriteCanvas';

const { TestVector3d } = vi.hoisted(() => ({
    TestVector3d: class
    {
        constructor(public x: number = 0, public y: number = 0, public z: number = 0)
        {}

        public assign(vector: { x: number; y: number; z: number }): void
        {
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
        }
    }
}));

vi.mock('@nitrots/utils', () => ({
    GetTicker: () => ({ deltaTime: 1 }),
    TextureUtils: {},
    Vector3d: TestVector3d
}));

vi.mock('@nitrots/configuration', () => ({
    GetConfiguration: () => ({ getValue: (_key: string, fallback: unknown) => fallback })
}));

vi.mock('../utils', () => ({
    RoomEnterEffect: { isVisualizationOn: () => false },
    RoomGeometry: class {},
    RoomRotatingEffect: {},
    RoomShakingEffect: {}
}));

describe('RoomSpriteCanvas', () =>
{
    it('does not mark an idle animation tick as a changed canvas', () =>
    {
        const canvas = createRenderCanvas();

        canvas.render(0, false);

        expect(canvas.canvasUpdated).toBe(false);
    });

    it('still marks a forced render as a changed canvas', () =>
    {
        const canvas = createRenderCanvas();

        canvas.render(0, true);

        expect(canvas.canvasUpdated).toBe(true);
    });

    it('marks removal of the last sprite as a changed canvas', () =>
    {
        const sprite = { setTexture: vi.fn() };
        const canvas = Object.create(RoomSpriteCanvas.prototype) as RoomSpriteCanvas & Record<string, unknown>;

        Object.assign(canvas, {
            _canvasUpdated: false,
            _display: { getChildAt: vi.fn(() => sprite) },
            _activeSpriteCount: 1,
            _spriteCount: 1
        });

        (canvas as any).cleanSprites(0);

        expect(canvas.canvasUpdated).toBe(true);
        expect(sprite.setTexture).toHaveBeenCalledWith(null);
    });

    it('marks a real animated visualization update as a changed canvas', () =>
    {
        const sprite = createSprite('', 0);
        let updateSpriteCounter = 1;
        const visualization = {
            instanceId: 1,
            get updateSpriteCounter()
            {
                return updateSpriteCounter;
            },
            sprites: [ sprite ],
            update: vi.fn(() => updateSpriteCounter++)
        } as unknown as IRoomObjectSpriteVisualization;
        const object = createRoomObject(visualization);
        const canvas = createObjectRenderCanvas();

        (canvas as any).renderObject(object, '1', 0, true, false, 0);
        canvas.canvasUpdated = false;

        (canvas as any).renderObject(object, '1', 1, false, true, 0);

        expect(canvas.canvasUpdated).toBe(true);
    });

    it('keeps a furniture badge layer in front of its base layer', () =>
    {
        const baseSprite = createSprite('', 0);
        const badgeSprite = createSprite('BADGE', -(0.001 * Math.sqrt(0.5)));
        const visualization = {
            instanceId: 1,
            updateSpriteCounter: 1,
            sprites: [baseSprite, badgeSprite],
            update: vi.fn()
        } as unknown as IRoomObjectSpriteVisualization;
        const object = {
            instanceId: 1,
            updateCounter: 1,
            visualization,
            model: { getValue: () => Number.NaN },
            getLocation: () => new TestVector3d(0, 0, 0)
        } as unknown as IRoomObject;
        const canvas = Object.create(RoomSpriteCanvas.prototype) as RoomSpriteCanvas & Record<string, unknown>;

        Object.assign(canvas, {
            _objectCache: new RoomObjectCache(''),
            _geometry: {
                updateId: 1,
                getScreenPosition: () => new TestVector3d(0, 0, 0)
            },
            _width: 100,
            _height: 100,
            _screenOffsetX: 0,
            _screenOffsetY: 0,
            _noSpriteVisibilityChecking: true,
            _sortableSprites: []
        });

        const spriteCount = (canvas as any).renderObject(object, '1', 0, true, false, 0);
        const [baseSortable, badgeSortable] = (canvas as any)._sortableSprites;

        expect(spriteCount).toBe(2);
        expect(badgeSortable.z).toBeLessThan(baseSortable.z);
    });
});

const createRenderCanvas = () =>
{
    const canvas = Object.create(RoomSpriteCanvas.prototype) as RoomSpriteCanvas & Record<string, unknown>;

    Object.assign(canvas, {
        _canvasUpdated: false,
        _totalTimeRunning: 0,
        _renderTimestamp: 0,
        _animationFPS: 24,
        _lastFrame: -1,
        _container: { objects: new Map() },
        _geometry: {},
        _width: 100,
        _height: 100,
        _renderedWidth: 100,
        _renderedHeight: 100,
        _display: {
            x: 0,
            y: 0,
            scale: { x: 1, set: vi.fn() }
        },
        _scale: 1,
        _screenOffsetX: 0,
        _screenOffsetY: 0,
        _sortableSprites: [],
        _activeSpriteCount: 0,
        doMagic: vi.fn(),
        cleanSprites: vi.fn(),
        updateBoundaryMask: vi.fn()
    });

    return canvas;
};

const createObjectRenderCanvas = () =>
{
    const canvas = Object.create(RoomSpriteCanvas.prototype) as RoomSpriteCanvas & Record<string, unknown>;

    Object.assign(canvas, {
        _canvasUpdated: false,
        _objectCache: new RoomObjectCache(''),
        _geometry: {
            updateId: 1,
            getScreenPosition: () => new TestVector3d(0, 0, 0)
        },
        _width: 100,
        _height: 100,
        _screenOffsetX: 0,
        _screenOffsetY: 0,
        _noSpriteVisibilityChecking: true,
        _sortableSprites: []
    });

    return canvas;
};

const createRoomObject = (visualization: IRoomObjectSpriteVisualization) => ({
    instanceId: 1,
    updateCounter: 1,
    visualization,
    model: { getValue: () => Number.NaN },
    getLocation: () => new TestVector3d(0, 0, 0)
} as unknown as IRoomObject);

const createSprite = (tag: string, relativeDepth: number): IRoomObjectSprite => ({
    visible: true,
    texture: {
        source: {},
        width: 39,
        height: 39
    },
    offsetX: 0,
    offsetY: 0,
    flipH: false,
    flipV: false,
    spriteType: 1,
    libraryAssetName: '',
    tag,
    relativeDepth
} as unknown as IRoomObjectSprite);
