import { IMessageComposer } from '@nitrots/api';

export class ForwardToACompetitionRoomMessageComposer implements IMessageComposer<ConstructorParameters<typeof ForwardToACompetitionRoomMessageComposer>>
{
    private _data: ConstructorParameters<typeof ForwardToACompetitionRoomMessageComposer>;

    constructor(goalCode: string, roomId: number)
    {
        this._data = [goalCode, roomId];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
