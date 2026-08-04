import { IMessageComposer } from '@nitrots/api';

export class CatalogStudioPreviewComposer implements IMessageComposer<any[]>
{
    private _data: any[];

    constructor(operationId: string, draftVersionId: number, expectedRevision: number, rank: number,
        hc: boolean, vip: boolean, buildersClub: boolean, showHidden: boolean, credits: number,
        currencies: Record<number, number>)
    {
        const balances = Object.entries(currencies).flatMap(([ type, amount ]) => [ Number(type), amount ]);
        this._data = [ operationId, draftVersionId, expectedRevision, rank, hc, vip, buildersClub,
            showHidden, credits, Object.keys(currencies).length, ...balances ];
    }

    public dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
