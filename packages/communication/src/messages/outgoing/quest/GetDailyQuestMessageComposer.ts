import { IMessageComposer } from '@nitrots/api';

export class GetDailyQuestMessageComposer implements IMessageComposer<ConstructorParameters<typeof GetDailyQuestMessageComposer>>
{
    private _data: ConstructorParameters<typeof GetDailyQuestMessageComposer>;

    constructor(easyQuest: boolean, questId: number)
    {
        this._data = [easyQuest, questId];
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
