import { IMessageComposer } from '@nitrots/api';

type SoundboardCatalogUpsertData = [ number, string, string, number, boolean ];

export class SoundboardCatalogUpsertComposer implements IMessageComposer<SoundboardCatalogUpsertData>
{
    private readonly _data: SoundboardCatalogUpsertData;

    constructor(id: number, name: string, url: string, minRank: number, enabled: boolean)
    {
        this._data = [ id, name, url, minRank, enabled ];
    }

    public getMessageArray(): SoundboardCatalogUpsertData { return this._data; }

    public dispose(): void { return; }
}
