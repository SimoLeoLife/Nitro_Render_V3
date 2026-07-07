import { IMessageComposer } from '@nitrots/api';

export class FurnitureMannequinSaveLookComposer implements IMessageComposer<ConstructorParameters<typeof FurnitureMannequinSaveLookComposer>>
{
    private _data: ConstructorParameters<typeof FurnitureMannequinSaveLookComposer>;

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
