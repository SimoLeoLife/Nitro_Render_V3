import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export interface CatalogStudioChangedEntity
{
    entityType: string;
    entityId: number;
}

export class CatalogStudioOperationMessageParser implements IMessageParser
{
    public operationId = '';
    public success = false;
    public code = '';
    public message = '';
    public revision = 0;
    public changedEntities: CatalogStudioChangedEntity[] = [];

    public flush(): boolean
    {
        this.operationId = '';
        this.success = false;
        this.code = '';
        this.message = '';
        this.revision = 0;
        this.changedEntities = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        this.operationId = wrapper.readString();
        this.success = wrapper.readBoolean();
        this.code = wrapper.readString();
        this.message = wrapper.readString();
        this.revision = wrapper.readInt();
        this.changedEntities = Array.from({ length: wrapper.readInt() }, () => ({
            entityType: wrapper.readString(), entityId: wrapper.readInt()
        }));
        return true;
    }
}
