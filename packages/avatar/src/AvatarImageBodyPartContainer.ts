import { Container, Point } from 'pixi.js';

export class AvatarImageBodyPartContainer
{
    private _image: Container;
    private _regPoint: Point;
    private _offset: Point;
    private _isCacheable: boolean;

    constructor(image: Container, regPoint: Point, isCacheable: boolean)
    {
        this._image = image;
        this._regPoint = regPoint;
        this._offset = new Point(0, 0);
        this._regPoint = regPoint;
        this._isCacheable = isCacheable;

        this.cleanPoints();
    }

    public dispose(): void
    {
        if(this._image)
        {
            this._image.destroy({
                children: true
            });
        }

        this._image = null;
        this._regPoint = null;
        this._offset = null;
    }

    private cleanPoints(): void
    {
        // this._regPoint.x    = this._regPoint.x;
        // this._regPoint.y    = this._regPoint.y;
        // this._offset.x      = this._offset.x;
        // this._offset.y      = this._offset.y;
    }

    public setRegPoint(regPoint: Point): void
    {
        this._regPoint = regPoint;

        this.cleanPoints();
    }

    public get image(): Container
    {
        return this._image;
    }

    public set image(image: Container)
    {
        if(this._image && (this._image !== image))
        {
            this._image.destroy({
                children: true
            });
        }

        this._image = image;
    }

    public get regPoint(): Point
    {
        const clone = this._regPoint.clone();

        clone.x += this._offset.x;
        clone.y += this._offset.y;

        return clone;
    }

    public set offset(offset: Point)
    {
        this._offset = offset;

        this.cleanPoints();
    }

    public get isCacheable(): boolean
    {
        return this._isCacheable;
    }
}
