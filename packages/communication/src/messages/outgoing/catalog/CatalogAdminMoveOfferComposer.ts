import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminMoveOfferComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminMoveOfferComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminMoveOfferComposer>;

    constructor(
        offerId: number,
        orderNumber: number,
        catalogMode: string = 'NORMAL',
        draftVersionId: number = 0,
        expectedRevision: number = 0,
        lockToken: string = '',
        summary: string = '')
    {
        this._data = [ offerId, orderNumber, catalogMode, draftVersionId, expectedRevision, lockToken, summary ];
    }

    dispose(): void
    {
        this._data = null;
    }

    public getMessageArray()
    {
        return this._data;
    }
}
