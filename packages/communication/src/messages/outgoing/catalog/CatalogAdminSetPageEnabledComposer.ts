import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminSetPageEnabledComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminSetPageEnabledComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminSetPageEnabledComposer>;

    constructor(pageId: number, enabled: boolean, catalogMode: string = 'NORMAL')
    {
        this._data = [ pageId, enabled, catalogMode ];
    }

    dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
