import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioReleaseLockComposer implements IMessageComposer<ConstructorParameters<typeof CatalogStudioReleaseLockComposer>>
{
    private _data: ConstructorParameters<typeof CatalogStudioReleaseLockComposer>;
    constructor(operationId: string, draftVersionId: number, entityType: string, catalogType: string, entityId: number, token: string)
    {
        this._data = [ operationId, draftVersionId, entityType, catalogType, entityId, token ];
    }
    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
