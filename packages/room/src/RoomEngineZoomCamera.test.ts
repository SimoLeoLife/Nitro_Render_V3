import { describe, expect, it, vi } from 'vitest';
import { RoomEngine } from './RoomEngine';
import { RoomInstanceData } from './utils';

vi.mock('./GetRoomMessageHandler', () => ({
    GetRoomMessageHandler: () => ({})
}));

vi.mock('./GetRoomEngine', () => ({
    GetRoomEngine: () => null
}));

describe('RoomEngine zoom camera synchronization', () =>
{
    it('keeps the camera aligned with a dragged canvas when the zoom scale changes', () =>
    {
        const roomId = 42;
        const instanceData = new RoomInstanceData(roomId);
        const canvas = {
            width: 800,
            height: 600,
            scale: 2,
            screenOffsetX: -600,
            screenOffsetY: -300,
            setScale: (scale: number) =>
            {
                canvas.scale = scale;
            }
        };
        const engine = Object.create(RoomEngine.prototype) as RoomEngine;

        Object.assign(engine, {
            _roomInstanceDatas: new Map([[ roomId, instanceData ]]),
            getRoomInstanceRenderingCanvas: () => canvas
        });

        engine.setRoomInstanceRenderingCanvasScale(roomId, 1, 2);

        expect(instanceData.roomCamera.location).toMatchObject({ x: 200, y: 75, z: 0 });
    });
});
