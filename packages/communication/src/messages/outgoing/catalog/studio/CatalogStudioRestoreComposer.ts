import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioRestoreComposer implements IMessageComposer<ConstructorParameters<typeof CatalogStudioRestoreComposer>>
{
    private _data: ConstructorParameters<typeof CatalogStudioRestoreComposer>;
    constructor(operationId: string, draftVersionId: number, expectedRevision: number, sourceVersionId: number)
    {
        this._data = [ operationId, draftVersionId, expectedRevision, sourceVersionId ];
    }
    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
