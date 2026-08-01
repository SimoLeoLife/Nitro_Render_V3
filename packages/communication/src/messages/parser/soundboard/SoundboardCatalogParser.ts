import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export interface ISoundboardCatalogSound
{
    id: number;
    name: string;
    url: string;
    enabled: boolean;
    sortOrder: number;
    minRank: number;
}

export class SoundboardCatalogParser implements IMessageParser
{
    private static readonly MAX_SOUND_COUNT = 500;

    private _sounds: ISoundboardCatalogSound[] = [];

    public flush(): boolean
    {
        this._sounds = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._sounds = [];
        const count = wrapper.readInt();

        if(count < 0 || count > SoundboardCatalogParser.MAX_SOUND_COUNT) return false;

        for(let index = 0; index < count; index++)
        {
            this._sounds.push({
                id: wrapper.readInt(),
                name: wrapper.readString(),
                url: wrapper.readString(),
                enabled: wrapper.readBoolean(),
                sortOrder: wrapper.readInt(),
                minRank: wrapper.readInt()
            });
        }

        return true;
    }

    public get sounds(): ISoundboardCatalogSound[] { return this._sounds; }
}
