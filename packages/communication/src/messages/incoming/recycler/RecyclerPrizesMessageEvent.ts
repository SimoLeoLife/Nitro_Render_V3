import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { RecyclerPrizesMessageParser } from '../../parser';

export class RecyclerPrizesMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RecyclerPrizesMessageParser);
    }

    public getParser(): RecyclerPrizesMessageParser
    {
        return this.parser as RecyclerPrizesMessageParser;
    }
}
