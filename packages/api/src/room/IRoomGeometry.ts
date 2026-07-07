import { Point } from 'pixi.js';
import { IVector3D } from '../utils';

export interface IRoomGeometry
{
    getCoordinatePosition(location: IVector3D): IVector3D;
    getScreenPoint(location: IVector3D): Point;
    getScreenPosition(location: IVector3D): IVector3D;
    getPlanePosition(screenPoint: Point, origin: IVector3D, leftSide: IVector3D, rightSide: IVector3D): Point;
    setDisplacement(location: IVector3D, displacement: IVector3D): void;
    adjustLocation(location: IVector3D, direction: number): void;
    performZoom(): void;
    performZoomOut(): void;
    performZoomIn(): void;
    isZoomedIn(): boolean;
    updateId: number;
    z_scale: number;
    scale: number;
    directionAxis: IVector3D;
    direction: IVector3D;
}
