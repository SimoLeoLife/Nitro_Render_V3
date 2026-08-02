import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioDocumentApplyComposer implements IMessageComposer<ConstructorParameters<typeof CatalogStudioDocumentApplyComposer>>
{
    private _data: ConstructorParameters<typeof CatalogStudioDocumentApplyComposer>;
    constructor(operationId: string, draftVersionId: number, expectedRevision: number, rootLockToken: string,
        format: 'JSONC' | 'SQL' | 'BULK', document: string, fingerprint: string, summary: string)
    {
        this._data = [ operationId, draftVersionId, expectedRevision, rootLockToken, format, document, fingerprint, summary ];
    }
    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
