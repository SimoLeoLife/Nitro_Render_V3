export const isAssetJsonUrl = (url: string): boolean =>
    /\.(?:json|jsonc)(?:[?#]|$)/i.test(url);

export const assetImageFallbackUrl = (url: string, assetName?: string): string =>
{
    if(assetName?.length) return new URL(`${ assetName }.png`, url).toString();

    return url.replace(/\.(?:json|jsonc)(?=[?#]|$)/i, '.png');
};
