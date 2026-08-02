import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { CatalogStudioLockMessageParser } from '../../../parser/catalog/studio/CatalogStudioLockMessageParser';

export class CatalogStudioAcquireLockEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: Function) { super(callback, CatalogStudioLockMessageParser); }
    public getParser(): CatalogStudioLockMessageParser { return this.parser as CatalogStudioLockMessageParser; }
}
