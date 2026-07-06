import { AssetAliasCollection } from './alias';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarImage } from './AvatarImage';
import { AvatarStructure } from './AvatarStructure';
import { EffectAssetDownloadManager } from './EffectAssetDownloadManager';

export class PlaceHolderAvatarImage extends AvatarImage
{
    constructor(structure: AvatarStructure, assets: AssetAliasCollection, figure: AvatarFigureContainer, scale: string, effectManager: EffectAssetDownloadManager)
    {
        super(structure, assets, figure, scale, effectManager, null);
    }

    public isPlaceholder(): boolean
    {
        return true;
    }
}
