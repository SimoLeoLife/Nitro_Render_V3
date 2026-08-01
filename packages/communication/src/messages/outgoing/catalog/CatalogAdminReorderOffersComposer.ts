import { IMessageComposer } from '@nitrots/api';

export interface ICatalogAdminOfferOrder
{
    id: number;
    orderNumber: number;
}

export class CatalogAdminReorderOffersComposer implements IMessageComposer<any[]>
{
    private _data: any[];

    constructor(orders: ICatalogAdminOfferOrder[], catalogMode: string = 'NORMAL')
    {
        this._data = [ orders.length ];
        for(const order of orders) this._data.push(order.id, order.orderNumber);
        this._data.push(catalogMode);
    }

    dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
