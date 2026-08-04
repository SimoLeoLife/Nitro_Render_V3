import { IMessageComposer } from '@nitrots/api';

export class CatalogAdminSavePageImagesComposer implements IMessageComposer<ConstructorParameters<typeof CatalogAdminSavePageImagesComposer>>
{
    private _data: ConstructorParameters<typeof CatalogAdminSavePageImagesComposer>;

    constructor(
        pageId: number,
        headerImage: string,
        teaserImage: string,
        catalogType: string = 'NORMAL',
        draftVersionId: number = 0,
        expectedRevision: number = 0,
        lockToken: string = '',
        summary: string = '')
    {
        this._data = [ pageId, headerImage, teaserImage, catalogType, draftVersionId, expectedRevision, lockToken, summary ];
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
