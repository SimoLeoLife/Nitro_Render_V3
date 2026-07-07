import { IMessageComposer } from '@nitrots/api';

export class OpenPresentComposer implements IMessageComposer<ConstructorParameters<typeof OpenPresentComposer>>
{
    private _data: ConstructorParameters<typeof OpenPresentComposer>;

    constructor(objectId: number)
    {
        this._data = [objectId];
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
