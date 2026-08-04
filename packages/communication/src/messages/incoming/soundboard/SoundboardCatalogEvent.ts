import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SoundboardCatalogParser } from '../../parser';

export class SoundboardCatalogEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SoundboardCatalogParser);
    }

    public getParser(): SoundboardCatalogParser
    {
        return this.parser as SoundboardCatalogParser;
    }
}
