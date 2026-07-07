import { IMessageComposer } from '@nitrots/api';

export class MysteryBoxWaitingCanceledMessageComposer implements IMessageComposer<ConstructorParameters<typeof MysteryBoxWaitingCanceledMessageComposer>>
{
    private _data: ConstructorParameters<typeof MysteryBoxWaitingCanceledMessageComposer>;

    constructor(objectId: number)
    {
        this._data = [ objectId ];
    }

    dispose(): void
    {
        this._data = null;
    }

    public getMessageArray()
    {
        return this._data;
    }
}
