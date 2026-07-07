import { IMessageComposer } from '@nitrots/api';

export class ModerateMessageMessageComposer implements IMessageComposer<ConstructorParameters<typeof ModerateMessageMessageComposer>>
{
    private _data: ConstructorParameters<typeof ModerateMessageMessageComposer>;

    constructor(groupId: number, threadId: number, messageId: number, state: number)
    {
        this._data = [groupId, threadId, messageId, state];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
