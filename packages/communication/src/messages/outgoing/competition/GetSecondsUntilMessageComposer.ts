import { IMessageComposer } from '@nitrots/api';

export class GetSecondsUntilMessageComposer implements IMessageComposer<ConstructorParameters<typeof GetSecondsUntilMessageComposer>>
{
    private _data: ConstructorParameters<typeof GetSecondsUntilMessageComposer>;

    constructor(timingCode: string)
    {
        this._data = [timingCode];
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
