import { IMessageComposer } from '@nitrots/api';

export class GetRecyclerPrizesMessageComposer implements IMessageComposer<[]>
{
    public dispose(): void
    {}

    public getMessageArray(): []
    {
        return [];
    }
}
