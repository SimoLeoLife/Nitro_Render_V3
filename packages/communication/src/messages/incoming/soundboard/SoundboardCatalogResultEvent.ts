import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SoundboardCatalogResultParser } from '../../parser';

export class SoundboardCatalogResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SoundboardCatalogResultParser);
    }

    public getParser(): SoundboardCatalogResultParser
    {
        return this.parser as SoundboardCatalogResultParser;
    }
}
