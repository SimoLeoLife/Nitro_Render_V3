import { describe, expect, it } from 'vitest';
import type { ColorMatrix } from 'pixi.js';
import { normalizeCameraBlendMode, normalizeCameraColorMatrix, resolveCameraEffectType } from '../RoomCameraWidgetManager';

describe('normalizeCameraBlendMode', () =>
{
    it('converts legacy Pixi numeric configuration to Pixi 8 string modes', () =>
    {
        expect(normalizeCameraBlendMode(0)).toBe('normal');
        expect(normalizeCameraBlendMode(2)).toBe('multiply');
        expect(normalizeCameraBlendMode(4)).toBe('overlay');
        expect(normalizeCameraBlendMode(9)).toBe('hard-light');
    });

    it('keeps valid Pixi 8 modes and safely defaults unknown values', () =>
    {
        expect(normalizeCameraBlendMode('screen')).toBe('screen');
        expect(normalizeCameraBlendMode('not-a-blend-mode')).toBe('normal');
        expect(normalizeCameraBlendMode(999)).toBe('normal');
    });
});

describe('resolveCameraEffectType', () =>
{
    it('recognizes the official frame effects that legacy configuration does not type', () =>
    {
        expect(resolveCameraEffectType({ name: 'frame_gold' })).toBe('frame');
        expect(resolveCameraEffectType({ name: 'finger_nrm' })).toBe('frame');
    });

    it('prefers an explicit type and otherwise distinguishes matrix and composite effects', () =>
    {
        expect(resolveCameraEffectType({ name: 'custom_frame', type: 'frame' })).toBe('frame');
        expect(resolveCameraEffectType({
            name: 'dark_sepia',
            colorMatrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
        })).toBe('colormatrix');
        expect(resolveCameraEffectType({ name: 'shadow_multiply_02' })).toBe('composite');
    });
});

describe('normalizeCameraColorMatrix', () =>
{
    it('keeps explicit negative grayscale bias untouched', () =>
    {
        const matrix: ColorMatrix = [
            -0.5, -0.5, -0.5, 0, 1,
            -0.5, -0.5, -0.5, 0, 1,
            -0.5, -0.5, -0.5, 0, 1,
            0, 0, 0, 1, 0
        ];

        expect(normalizeCameraColorMatrix(matrix)).toEqual(matrix);
    });

    it('adds missing white bias for negative grayscale matrices', () =>
    {
        const matrix: ColorMatrix = [
            -0.5, -0.5, -0.5, 0, 0,
            -0.5, -0.5, -0.5, 0, 0,
            -0.5, -0.5, -0.5, 0, 0,
            0, 0, 0, 1, 0
        ];

        expect(normalizeCameraColorMatrix(matrix)).toEqual([
            -0.5, -0.5, -0.5, 0, 1,
            -0.5, -0.5, -0.5, 0, 1,
            -0.5, -0.5, -0.5, 0, 1,
            0, 0, 0, 1, 0
        ]);
    });

    it('normalizes legacy 255-based offsets to pixi range', () =>
    {
        const matrix: ColorMatrix = [
            1, 0, 0, 0, 255,
            0, 1, 0, 0, 128,
            0, 0, 1, 0, 64,
            0, 0, 0, 1, 255
        ];

        expect(normalizeCameraColorMatrix(matrix)).toEqual([
            1, 0, 0, 0, 1,
            0, 1, 0, 0, 128 / 255,
            0, 0, 1, 0, 64 / 255,
            0, 0, 0, 1, 1
        ]);
    });
});
