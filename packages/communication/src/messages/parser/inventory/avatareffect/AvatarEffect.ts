export class AvatarEffect
{
    private _type: number;
    private _subType: number;
    private _duration: number;
    private _inactiveEffectsInInventory: number;
    private _secondsLeftIfActive: number;
    private _permanent: boolean;

    public get type(): number
    {
        return this._type;
    }

    public set type(value: number)
    {
        this._type = value;
    }

    public get subType(): number
    {
        return this._subType;
    }

    public set subType(value: number)
    {
        this._subType = value;
    }

    public get duration(): number
    {
        return this._duration;
    }

    public set duration(value: number)
    {
        this._duration = value;
    }

    public get inactiveEffectsInInventory(): number
    {
        return this._inactiveEffectsInInventory;
    }

    public set inactiveEffectsInInventory(value: number)
    {
        this._inactiveEffectsInInventory = value;
    }

    public get secondsLeftIfActive(): number
    {
        return this._secondsLeftIfActive;
    }

    public set secondsLeftIfActive(value: number)
    {
        this._secondsLeftIfActive = value;
    }

    public get isPermanent(): boolean
    {
        return this._permanent;
    }

    public set isPermanent(value: boolean)
    {
        this._permanent = value;
    }
}
