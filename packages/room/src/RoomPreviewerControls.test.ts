import { AvatarAction, RoomObjectCategory, RoomObjectVariable } from '@nitrots/api';
import { describe, expect, it, vi } from 'vitest';
import { RoomPreviewer } from './RoomPreviewer';

vi.mock('./GetRoomMessageHandler', () => ({
    GetRoomMessageHandler: () => ({})
}));

vi.mock('./GetRoomEngine', () => ({
    GetRoomEngine: () => null
}));

const makePreviewer = (category = RoomObjectCategory.FLOOR) => {
    const roomObject = {
        getDirection: () => ({ x: 90 }),
        model: { getValue: vi.fn(() => [ 0, 90, 180, 270 ]) },
        setDirection: vi.fn()
    };
    const roomEngine = {
        changeObjectState: vi.fn(),
        getRoomInstanceRenderingCanvasOffset: vi.fn(() => null),
        getRoomObject: vi.fn(() => roomObject),
        objectEventHandler: { getValidRoomObjectDirection: vi.fn((_object, clockwise) => (clockwise ? 180 : 0)) },
        setRoomInstanceRenderingCanvasScale: vi.fn(),
        updateRoomObjectFloor: vi.fn(),
        updateRoomObjectUserAction: vi.fn(),
        updateRoomObjectUserLocation: vi.fn(),
        updateRoomObjectUserPosture: vi.fn()
    };
    const previewer = Object.create(RoomPreviewer.prototype) as RoomPreviewer;
    const internals = previewer as unknown as {
        _automaticStateChange: boolean;
        _currentAvatarAction: number;
        _currentAvatarDirection: number;
        _currentAvatarHeadDirection: number;
        _currentPreviewMode: string;
        _currentPreviewNeedsZoomOut: boolean;
        _currentPreviewScale: number;
        _previewCapabilities: object;
        _previewCapabilityListeners: Set<() => void>;
        refreshPreviewCapabilities(): void;
    };

    Object.assign(previewer, {
        _roomEngine: roomEngine,
        _previewRoomId: 77,
        _currentAvatarAction: 0,
        _currentAvatarDirection: 2,
        _currentAvatarHeadDirection: 3,
        _currentPreviewObjectCategory: category,
        _currentPreviewMode: 'floor',
        _currentPreviewRectangle: null,
        _currentPreviewScale: RoomPreviewer.SCALE_NORMAL,
        _previewCapabilities: {
            mode: 'none',
            canRotate: false,
            canChangeState: false,
            canUseAvatarActions: false,
            canZoomIn: false,
            canZoomOut: false
        },
        _previewCapabilityListeners: new Set(),
        _automaticStateChange: true
    });

    return { previewer, internals, roomEngine, roomObject };
};

describe('RoomPreviewer catalog controls', () => {
    it('reports stable capabilities for the object that is actually loaded', () => {
        const { previewer, internals } = makePreviewer();

        internals.refreshPreviewCapabilities();

        expect((previewer as any).getPreviewCapabilities()).toEqual({
            mode: 'floor',
            canRotate: true,
            canChangeState: true,
            canUseAvatarActions: false,
            canZoomIn: false,
            canZoomOut: true
        });
    });

    it('notifies subscribers when zoom availability changes', () => {
        const { previewer, internals } = makePreviewer();
        const listener = vi.fn();
        const unsubscribe = (previewer as any).subscribePreviewCapabilities(listener);

        internals.refreshPreviewCapabilities();
        previewer.zoomOut();

        expect(listener).toHaveBeenCalled();
        expect((previewer as any).getPreviewCapabilities()).toMatchObject({ canZoomIn: true, canZoomOut: false });

        unsubscribe();
    });

    it('distinguishes avatar actions from furniture interactions', () => {
        const { previewer, internals } = makePreviewer(RoomObjectCategory.UNIT);

        internals._currentPreviewMode = 'avatar';
        internals.refreshPreviewCapabilities();

        expect((previewer as any).getPreviewCapabilities()).toMatchObject({
            mode: 'avatar',
            canRotate: true,
            canChangeState: false,
            canUseAvatarActions: true
        });
    });

    it('cycles an avatar through walk, dance, sit, lay, wave and stand', () => {
        const { previewer, internals, roomEngine } = makePreviewer(RoomObjectCategory.UNIT);

        internals._currentPreviewMode = 'avatar';

        previewer.cycleAvatarAction();
        expect(roomEngine.updateRoomObjectUserPosture).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, AvatarAction.POSTURE_WALK, '');

        previewer.cycleAvatarAction();
        expect(roomEngine.updateRoomObjectUserAction).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, RoomObjectVariable.FIGURE_DANCE, 1, null);

        previewer.cycleAvatarAction();
        expect(roomEngine.updateRoomObjectUserPosture).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, AvatarAction.POSTURE_SIT, '');
        expect(roomEngine.updateRoomObjectUserLocation).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, expect.objectContaining({ x: 2, y: 2, z: 0.55 }), expect.anything(), false, 0, expect.anything(), expect.any(Number));

        previewer.cycleAvatarAction();
        expect(roomEngine.updateRoomObjectUserPosture).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, AvatarAction.POSTURE_LAY, '');

        previewer.cycleAvatarAction();
        expect(roomEngine.updateRoomObjectUserAction).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, RoomObjectVariable.FIGURE_EXPRESSION, AvatarAction.getExpressionId(AvatarAction.EXPRESSION_WAVE), null);

        previewer.cycleAvatarAction();
        expect(internals._currentAvatarAction).toBe(0);
        expect(roomEngine.updateRoomObjectUserPosture).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, AvatarAction.POSTURE_STAND, '');
    });

    it('skips avatar poses that are incompatible with the current direction', () => {
        const { previewer, internals, roomEngine } = makePreviewer(RoomObjectCategory.UNIT);

        internals._currentPreviewMode = 'avatar';
        internals._currentAvatarAction = 2;
        internals._currentAvatarDirection = 1;

        previewer.cycleAvatarAction();

        expect(internals._currentAvatarAction).toBe(5);
        expect(roomEngine.updateRoomObjectUserAction).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, RoomObjectVariable.FIGURE_EXPRESSION, AvatarAction.getExpressionId(AvatarAction.EXPRESSION_WAVE), null);
    });

    it('keeps avatar rotation on valid directions for directional poses', () => {
        const { previewer, internals, roomEngine } = makePreviewer(RoomObjectCategory.UNIT);

        internals._currentPreviewMode = 'avatar';
        internals._currentAvatarAction = 3;

        previewer.changeRoomObjectDirection(true);

        expect(internals._currentAvatarDirection).toBe(4);
        expect(roomEngine.updateRoomObjectUserLocation).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, expect.anything(), expect.anything(), false, 0, expect.objectContaining({ x: 180 }), 180);
    });

    it('keeps laying avatars on the two supported directions', () => {
        const { previewer, internals } = makePreviewer(RoomObjectCategory.UNIT);

        internals._currentPreviewMode = 'avatar';
        internals._currentAvatarAction = 4;
        internals._currentAvatarDirection = 2;

        previewer.changeRoomObjectDirection(true);
        expect(internals._currentAvatarDirection).toBe(0);

        previewer.changeRoomObjectDirection(false);
        expect(internals._currentAvatarDirection).toBe(2);
    });

    it('rotates floor furniture in both requested directions and refreshes the preview', () => {
        const { previewer, roomEngine } = makePreviewer();

        previewer.changeRoomObjectDirection(false);
        previewer.changeRoomObjectDirection(true);

        expect(roomEngine.objectEventHandler.getValidRoomObjectDirection).toHaveBeenNthCalledWith(1, expect.anything(), false);
        expect(roomEngine.objectEventHandler.getValidRoomObjectDirection).toHaveBeenNthCalledWith(2, expect.anything(), true);
        expect(roomEngine.updateRoomObjectFloor).toHaveBeenNthCalledWith(1, 77, RoomPreviewer.PREVIEW_OBJECT_ID, expect.anything(), expect.objectContaining({ x: 0 }), null, null);
        expect(roomEngine.updateRoomObjectFloor).toHaveBeenNthCalledWith(2, 77, RoomPreviewer.PREVIEW_OBJECT_ID, expect.anything(), expect.objectContaining({ x: 180 }), null, null);
    });

    it('changes furni state and disables automatic cycling', () => {
        const { previewer, internals, roomEngine } = makePreviewer();

        previewer.changeRoomObjectState();

        expect(internals._automaticStateChange).toBe(false);
        expect(roomEngine.changeObjectState).toHaveBeenCalledWith(77, RoomPreviewer.PREVIEW_OBJECT_ID, RoomObjectCategory.FLOOR);
    });

    it('applies explicit zoom in and out without an automatic-size lock overriding the choice', () => {
        const { previewer, internals, roomEngine } = makePreviewer();

        previewer.zoomOut();
        expect(internals._currentPreviewNeedsZoomOut).toBe(true);
        expect(roomEngine.setRoomInstanceRenderingCanvasScale).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_CANVAS_ID, 0.5);

        previewer.zoomIn();
        expect(internals._currentPreviewNeedsZoomOut).toBe(false);
        expect(roomEngine.setRoomInstanceRenderingCanvasScale).toHaveBeenLastCalledWith(77, RoomPreviewer.PREVIEW_CANVAS_ID, 1);
    });
});
