import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class CatalogStudioLockMessageParser implements IMessageParser
{
    public operationId = '';
    public success = false;
    public code = '';
    public message = '';
    public draftVersionId = 0;
    public entityType = '';
    public catalogType = 'NORMAL';
    public entityId = 0;
    public ownerId = 0;
    public ownerName = '';
    public token = '';
    public expiresAt = '';

    public flush(): boolean
    {
        this.operationId = '';
        this.success = false;
        this.code = '';
        this.message = '';
        this.draftVersionId = 0;
        this.entityType = '';
        this.catalogType = 'NORMAL';
        this.entityId = 0;
        this.ownerId = 0;
        this.ownerName = '';
        this.token = '';
        this.expiresAt = '';
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        this.operationId = wrapper.readString();
        this.success = wrapper.readBoolean();
        this.code = wrapper.readString();
        this.message = wrapper.readString();
        this.draftVersionId = wrapper.readInt();
        this.entityType = wrapper.readString();
        this.catalogType = wrapper.readString();
        this.entityId = wrapper.readInt();
        this.ownerId = wrapper.readInt();
        this.ownerName = wrapper.readString();
        this.token = wrapper.readString();
        this.expiresAt = wrapper.readString();
        return true;
    }
}
