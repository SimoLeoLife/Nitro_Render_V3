import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioPublishComposer implements IMessageComposer<ConstructorParameters<typeof CatalogStudioPublishComposer>>
{
    private _data: ConstructorParameters<typeof CatalogStudioPublishComposer>;
    constructor(operationId: string, draftVersionId: number, expectedRevision: number)
    {
        this._data = [ operationId, draftVersionId, expectedRevision ];
    }
    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
