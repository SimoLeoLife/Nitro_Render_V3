export class YoutubeDisplayPlaylist
{
    private _video: string;
    private _title: string;
    private _description: string;

    constructor(video: string, title: string, description: string)
    {
        this._video = video;
        this._title = title;
        this._description = description;
    }

    public get video():string
    {
        return this._video;
    }

    public get title():string
    {
        return this._title;
    }

    public get description():string
    {
        return this._description;
    }
}
