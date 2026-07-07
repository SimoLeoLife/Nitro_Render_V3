export interface IRoomManagerListener
{
    objectInitialized(roomId: string, objectId: number, category: number): void;
    initalizeTemporaryObjectsByType(type: string, contentLoaded: boolean): void;
}
