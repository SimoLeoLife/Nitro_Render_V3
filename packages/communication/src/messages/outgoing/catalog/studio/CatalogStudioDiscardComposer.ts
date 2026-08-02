import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioDiscardComposer implements IMessageComposer<ConstructorParameters<typeof CatalogStudioDiscardComposer>>
{
    private _data: ConstructorParameters<typeof CatalogStudioDiscardComposer>;
    constructor(operationId: string, draftVersionId: number, expectedRevision: number)
    {
        this._data = [ operationId, draftVersionId, expectedRevision ];
    }
    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
