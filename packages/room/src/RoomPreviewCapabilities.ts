export type RoomPreviewMode = 'none' | 'floor' | 'wall' | 'avatar' | 'pet';

export interface IRoomPreviewCapabilities
{
    mode: RoomPreviewMode;
    canRotate: boolean;
    canChangeState: boolean;
    canUseAvatarActions: boolean;
    canZoomIn: boolean;
    canZoomOut: boolean;
}
