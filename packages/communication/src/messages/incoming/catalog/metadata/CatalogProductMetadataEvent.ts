import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { CatalogProductMetadataMessageParser } from '../../../parser/catalog/metadata';

export class CatalogProductMetadataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: Function)
    {
        super(callback, CatalogProductMetadataMessageParser);
    }

    public getParser(): CatalogProductMetadataMessageParser
    {
        return this.parser as CatalogProductMetadataMessageParser;
    }
}
