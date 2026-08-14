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
        model: {},
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
        _currentPreviewNeedsZoomOut: boolean;
    };

    Object.assign(previewer, {
        _roomEngine: roomEngine,
        _previewRoomId: 77,
        _currentPreviewObjectCategory: category,
        _currentPreviewRectangle: null,
        _automaticStateChange: true
    });

    return { previewer, internals, roomEngine, roomObject };
};

describe('RoomPreviewer catalog controls', () => {
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
