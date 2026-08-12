import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioDocumentDryRunComposer implements IMessageComposer<ConstructorParameters<typeof CatalogStudioDocumentDryRunComposer>>
{
    private _data: ConstructorParameters<typeof CatalogStudioDocumentDryRunComposer>;
    constructor(operationId: string, draftVersionId: number, expectedRevision: number, format: 'SQL', document: string)
    {
        this._data = [ operationId, draftVersionId, expectedRevision, format, document ];
    }
    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
