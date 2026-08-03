import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';
import { CatalogStudioOfferSnapshot, CatalogStudioPageSnapshot } from './CatalogStudioSessionMessageParser';

export interface CatalogStudioPreviewOffer
{
    offer: CatalogStudioOfferSnapshot;
    eligible: boolean;
    reasons: string[];
}

export class CatalogStudioPreviewMessageParser implements IMessageParser
{
    public operationId = '';
    public revision = 0;
    public pages: CatalogStudioPageSnapshot[] = [];
    public offers: CatalogStudioPreviewOffer[] = [];
    public flush(): boolean { this.operationId = ''; this.revision = 0; this.pages = []; this.offers = []; return true; }
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        this.operationId = wrapper.readString();
        this.revision = wrapper.readInt();
        this.pages = JSON.parse(wrapper.readString()) as CatalogStudioPageSnapshot[];
        this.offers = JSON.parse(wrapper.readString()) as CatalogStudioPreviewOffer[];
        return true;
    }
}
