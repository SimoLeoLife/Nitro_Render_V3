import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { IsFirstLoginOfDayParser } from '../../parser';

export class IsFirstLoginOfDayEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, IsFirstLoginOfDayParser);
    }

    public getParser(): IsFirstLoginOfDayParser
    {
        return this.parser as IsFirstLoginOfDayParser;
    }
}
