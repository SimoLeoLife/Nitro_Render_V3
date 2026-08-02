import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { SoundboardPlayDeniedParser } from '../../parser';

export class SoundboardPlayDeniedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, SoundboardPlayDeniedParser);
    }

    public getParser(): SoundboardPlayDeniedParser
    {
        return this.parser as SoundboardPlayDeniedParser;
    }
}
