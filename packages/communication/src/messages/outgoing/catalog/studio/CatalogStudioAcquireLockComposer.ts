import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioAcquireLockComposer implements IMessageComposer<ConstructorParameters<typeof CatalogStudioAcquireLockComposer>>
{
    private _data: ConstructorParameters<typeof CatalogStudioAcquireLockComposer>;
    constructor(operationId: string, draftVersionId: number, entityType: string, catalogType: string, entityId: number)
    {
        this._data = [ operationId, draftVersionId, entityType, catalogType, entityId ];
    }
    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
