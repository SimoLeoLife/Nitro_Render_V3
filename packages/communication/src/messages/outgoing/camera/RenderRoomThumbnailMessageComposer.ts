import { RenderRoomMessageComposer } from './RenderRoomMessageComposer';

export class RenderRoomThumbnailMessageComposer extends RenderRoomMessageComposer
{
    constructor(value: any = '', label: string = '', description: string = '', width: number = -1, height: number = -1)
    {
        super(value, label, description, width, height);
    }
}
