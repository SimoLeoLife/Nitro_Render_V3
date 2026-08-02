import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminSetPageVisibleComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminSetPageVisibleComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminSetPageVisibleComposer>;

    constructor(pageId: number, visible: boolean, catalogMode: string = 'NORMAL')
    {
        this._data = [ pageId, visible, catalogMode ];
    }

    dispose(): void { this._data = null; }
    public getMessageArray() { return this._data; }
}
