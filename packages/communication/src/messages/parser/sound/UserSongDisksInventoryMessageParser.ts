import { IAdvancedMap, IMessageDataWrapper, IMessageParser } from '@nitrots/api';
import { AdvancedMap } from '@nitrots/utils';

export class UserSongDisksInventoryMessageParser implements IMessageParser
{
    private _songDiskInventory: IAdvancedMap<number, number> = new AdvancedMap();

    flush(): boolean
    {
        this._songDiskInventory.reset();
        return true;
    }

    parse(wrapper: IMessageDataWrapper): boolean
    {
        const count = wrapper.readInt();

        for(let i = 0; i < count; i++)
        {
            this._songDiskInventory.add(wrapper.readInt(), wrapper.readInt());
        }
        return true;
    }

    public getDiskId(index: number): number
    {
        if(((index >= 0) && (index < this._songDiskInventory.length)))
        {
            return this._songDiskInventory.getKey(index);
        }
        return -1;
    }

    public getSongId(index: number): number
    {
        if(((index >= 0) && (index < this._songDiskInventory.length)))
        {
            return this._songDiskInventory.getWithIndex(index);
        }
        return -1;
    }

    public get songDiskCount(): number
    {
        return this._songDiskInventory.length;
    }
}
