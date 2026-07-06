export class AvatarSet
{
    private _id: string;
    private _isMain: boolean;
    private _avatarSets: Map<string, AvatarSet>;
    private _bodyParts: string[];
    private _allBodyParts: string[];

    constructor(data: any)
    {
        this._id = data.id;
        this._isMain = data.main || false;
        this._avatarSets = new Map();
        this._bodyParts = [];
        this._allBodyParts = [];

        if(data.avatarSets && (data.avatarSets.length > 0))
        {
            for(const avatarSet of data.avatarSets)
            {
                if(!avatarSet) continue;

                const set = new AvatarSet(avatarSet);

                this._avatarSets.set(set.id, set);
            }
        }

        if(data.bodyParts && (data.bodyParts.length > 0))
        {
            for(const bodyPart of data.bodyParts)
            {
                if(!bodyPart) continue;

                this._bodyParts.push(bodyPart.id);
            }
        }

        let bodyParts = this._bodyParts.concat();

        for(const avatarSet of this._avatarSets.values())
        {
            if(!avatarSet) continue;

            bodyParts = bodyParts.concat(avatarSet.getBodyParts());
        }

        this._allBodyParts = bodyParts;
    }

    public findAvatarSet(avatarSetId: string): AvatarSet
    {
        if(avatarSetId === this._id) return this;

        for(const avatarSet of this._avatarSets.values())
        {
            if(!avatarSet) continue;

            const found = avatarSet.findAvatarSet(avatarSetId);

            if(found) return found;
        }

        return null;
    }

    public getBodyParts(): string[]
    {
        return this._allBodyParts.concat();
    }

    public get id(): string
    {
        return this._id;
    }

    public get isMain(): boolean
    {
        if(this._isMain) return true;

        for(const avatarSet of this._avatarSets.values())
        {
            if(!avatarSet) continue;

            if(!avatarSet.isMain) continue;

            return true;
        }

        return false;
    }
}
