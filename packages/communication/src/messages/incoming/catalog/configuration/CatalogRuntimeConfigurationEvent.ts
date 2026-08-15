import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { CatalogRuntimeConfigurationMessageParser } from '../../../parser/catalog/configuration';

export class CatalogRuntimeConfigurationEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: Function)
    {
        super(callback, CatalogRuntimeConfigurationMessageParser);
    }

    public getParser(): CatalogRuntimeConfigurationMessageParser
    {
        return this.parser as CatalogRuntimeConfigurationMessageParser;
    }
}
