import { CatalogStudioHistoryGroup, CatalogStudioOfferSnapshot, CatalogStudioPageSnapshot } from './studio';

export type CatalogAdminSmartSaveAction = 'createPage' | 'savePage' | 'createOffer' | 'saveOffer';

export interface CatalogAdminSmartSaveResult
{
    protocolVersion: 1;
    operationId: string;
    action: CatalogAdminSmartSaveAction;
    code: string;
    draftVersionId: number;
    revision: number;
    entityType: 'PAGE' | 'OFFER';
    catalogType: 'NORMAL' | 'BUILDER';
    entityId: number;
    entity: CatalogStudioPageSnapshot | CatalogStudioOfferSnapshot | null;
    historyGroup: CatalogStudioHistoryGroup | null;
    fieldErrors: Record<string, string>;
    serverDurationMs: number;
}

const ACTIONS = new Set<CatalogAdminSmartSaveAction>([ 'createPage', 'savePage', 'createOffer', 'saveOffer' ]);

const isObject = (value: unknown): value is Record<string, unknown> =>
    !!value && (typeof value === 'object') && !Array.isArray(value);

const parseJsonObject = (value: string): Record<string, unknown> | null =>
{
    if(!value) return null;
    const parsed: unknown = JSON.parse(value);
    if(!isObject(parsed)) throw new Error('Catalog Smart Save JSON must contain an object');
    return parsed;
};

export const parseCatalogAdminEntity = (
    value: string,
    entityType: 'PAGE' | 'OFFER',
    catalogType: 'NORMAL' | 'BUILDER',
    entityId: number): CatalogStudioPageSnapshot | CatalogStudioOfferSnapshot | null =>
{
    const parsed = parseJsonObject(value);
    if(!parsed) return null;
    const identity = entityType === 'PAGE' ? parsed.pageId : parsed.offerId;
    if((typeof identity !== 'number') || (identity !== entityId) || (parsed.catalogType !== catalogType))
        throw new Error('Catalog Smart Save entity identity is invalid');
    return parsed as unknown as CatalogStudioPageSnapshot | CatalogStudioOfferSnapshot;
};

export const parseCatalogAdminHistoryGroup = (value: string): CatalogStudioHistoryGroup | null =>
{
    if(!value || value === 'null') return null;
    const parsed = parseJsonObject(value);
    if(!parsed || (typeof parsed.id !== 'number') || (typeof parsed.revision !== 'number') ||
        (typeof parsed.actorId !== 'number') || (typeof parsed.actorName !== 'string') ||
        (typeof parsed.summary !== 'string') || (typeof parsed.source !== 'string') ||
        (typeof parsed.createdAt !== 'string') || !Array.isArray(parsed.entries))
        throw new Error('Catalog Smart Save history group is invalid');

    for(const entry of parsed.entries)
    {
        if(!isObject(entry) || (typeof entry.entityType !== 'string') ||
            (typeof entry.entityId !== 'number') || (typeof entry.operation !== 'string'))
            throw new Error('Catalog Smart Save history entry is invalid');
    }
    return parsed as unknown as CatalogStudioHistoryGroup;
};

export const parseCatalogAdminFieldErrors = (value: string): Record<string, string> =>
{
    const parsed = parseJsonObject(value) ?? {};
    if(Object.values(parsed).some(entry => typeof entry !== 'string'))
        throw new Error('Catalog Smart Save field errors are invalid');
    return parsed as Record<string, string>;
};

export const isCatalogAdminSmartSaveAction = (value: string): value is CatalogAdminSmartSaveAction =>
    ACTIONS.has(value as CatalogAdminSmartSaveAction);
