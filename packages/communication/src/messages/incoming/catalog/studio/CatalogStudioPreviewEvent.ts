import { IMessageEvent } from '@nitrots/api';
import { MessageEvent } from '@nitrots/events';
import { CatalogStudioPreviewMessageParser } from '../../../parser/catalog/studio/CatalogStudioPreviewMessageParser';

export class CatalogStudioPreviewEvent extends MessageEvent implements IMessageEvent
{
    constructor(callback: Function) { super(callback, CatalogStudioPreviewMessageParser); }
    public getParser(): CatalogStudioPreviewMessageParser { return this.parser as CatalogStudioPreviewMessageParser; }
}
