import { RoomObjectCategory } from '@nitrots/api';
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
        updateRoomObjectFloor: vi.fn()
    };
    const previewer = Object.create(RoomPreviewer.prototype) as RoomPreviewer;
    const internals = previewer as unknown as {
        _automaticStateChange: boolean;
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
            canRotate: false,
            canChangeState: false,
            canUseAvatarActions: true
        });
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
