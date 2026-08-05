import { afterEach, describe, expect, it, vi } from 'vitest';
import { CanvasAnimatedTextureDependencies, createCanvasAnimatedResource } from './CanvasAnimatedTexture';
import { DecodedAnimation } from './DecodedAnimation';

vi.mock('pixi.js', () => ({
    Ticker: { shared: { add: vi.fn(), remove: vi.fn() } },
    Texture: { from: vi.fn() }
}));

const animation = (loopCount: number, durations: number[] = [ 20, 30 ]): DecodedAnimation => ({
    width: 1,
    height: 1,
    loopCount,
    frames: durations.map((durationMs, index) => ({
        pixels: new Uint8ClampedArray([ index * 50, 0, 0, 255 ]),
        durationMs
    }))
});

const createDependencies = (): CanvasAnimatedTextureDependencies & {
    render: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
} =>
{
    const render = vi.fn();
    const update = vi.fn();
    const destroy = vi.fn();

    return {
        ticker: { add: vi.fn(), remove: vi.fn() },
        createSurface: vi.fn().mockReturnValue({ source: { width: 1, height: 1 }, render }),
        textureFrom: vi.fn().mockReturnValue({ source: { scaleMode: 'nearest', update }, destroy }),
        render,
        update,
        destroy
    };
};

afterEach(() => vi.restoreAllMocks());

describe('createCanvasAnimatedResource', () =>
{
    it('renders the first frame immediately and advances only after its duration', () =>
    {
        const dependencies = createDependencies();
        const resource = createCanvasAnimatedResource(animation(0), 'webp', dependencies);
        const tick = vi.mocked(dependencies.ticker.add).mock.calls[0][0];

        expect(dependencies.render).toHaveBeenCalledTimes(1);
        expect(resource.texture.source.scaleMode).toBe('linear');

        tick({ deltaMS: 19 });
        expect(dependencies.render).toHaveBeenCalledTimes(1);

        tick({ deltaMS: 1 });
        expect(dependencies.render).toHaveBeenCalledTimes(2);
        expect(dependencies.update).toHaveBeenCalledOnce();
    });

    it('clamps zero and invalid frame durations to 10 milliseconds', () =>
    {
        const dependencies = createDependencies();

        createCanvasAnimatedResource(animation(0, [ 0, Number.NaN ]), 'png', dependencies);
        const tick = vi.mocked(dependencies.ticker.add).mock.calls[0][0];

        tick({ deltaMS: 9 });
        expect(dependencies.render).toHaveBeenCalledTimes(1);

        tick({ deltaMS: 1 });
        expect(dependencies.render).toHaveBeenCalledTimes(2);
    });

    it('stops after a finite loop and disposes ticker and texture exactly once', () =>
    {
        const dependencies = createDependencies();
        const resource = createCanvasAnimatedResource(animation(1, [ 10, 10 ]), 'webp', dependencies);
        const tick = vi.mocked(dependencies.ticker.add).mock.calls[0][0];

        tick({ deltaMS: 20 });

        expect(dependencies.ticker.remove).toHaveBeenCalledWith(tick);
        expect(dependencies.render).toHaveBeenCalledTimes(2);

        resource.dispose();
        resource.dispose();

        expect(dependencies.ticker.remove).toHaveBeenCalledTimes(1);
        expect(dependencies.destroy).toHaveBeenCalledTimes(1);
    });

    it('keeps an infinite animation registered after multiple loops', () =>
    {
        const dependencies = createDependencies();

        createCanvasAnimatedResource(animation(0, [ 10, 10 ]), 'gif', dependencies);
        const tick = vi.mocked(dependencies.ticker.add).mock.calls[0][0];

        tick({ deltaMS: 100 });

        expect(dependencies.ticker.remove).not.toHaveBeenCalled();
        expect(dependencies.render.mock.calls.length).toBeGreaterThan(2);
    });

    it('rejects frames whose RGBA byte length does not match the canvas', () =>
    {
        const invalid = animation(0);

        invalid.frames[0].pixels = new Uint8ClampedArray(3);

        expect(() => createCanvasAnimatedResource(invalid, 'webp', createDependencies())).toThrow(/RGBA byte length/);
    });
});
