import { AvatarImageBodyPartContainer } from '../AvatarImageBodyPartContainer';
import { AvatarImagePartContainer } from '../AvatarImagePartContainer';

export class AvatarImageDirectionCache
{
    private _partList: AvatarImagePartContainer[];
    private _images: Map<string, AvatarImageBodyPartContainer>;

    constructor(partList: AvatarImagePartContainer[])
    {
        this._partList = partList;
        this._images = new Map();
    }

    public dispose(): void
    {
        for(const image of this._images.values()) image && image.dispose();

        this._images = null;
    }

    public getPartList(): AvatarImagePartContainer[]
    {
        return this._partList;
    }

    public getImageContainer(frameCount: number): AvatarImageBodyPartContainer
    {
        const existing = this._images.get(this.getCacheKey(frameCount));

        if(!existing) return null;

        return existing;
    }

    public updateImageContainer(container: AvatarImageBodyPartContainer, frameCount: number): void
    {
        const name = this.getCacheKey(frameCount);

        const existing = this._images.get(name);

        if(existing) existing.dispose();

        this._images.set(name, container);
    }

    private getCacheKey(frameCount: number): string
    {
        let name = '';

        for(const part of this._partList) name += (part.getCacheableKey(frameCount) + '/');

        return name;
    }

    private debugInfo(message: string): void
    {
    }
}
