import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';

export class CatalogStudioDocumentResultMessageParser implements IMessageParser
{
    public operationId = '';
    public success = false;
    public code = '';
    public message = '';
    public revision = 0;
    public format = '';
    public document = '';
    public fingerprint = '';
    public changedEntities = 0;
    public flush(): boolean
    {
        this.operationId = ''; this.success = false; this.code = ''; this.message = ''; this.revision = 0;
        this.format = ''; this.document = ''; this.fingerprint = ''; this.changedEntities = 0; return true;
    }
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        this.operationId = wrapper.readString();
        this.success = wrapper.readBoolean();
        this.code = wrapper.readString();
        this.message = wrapper.readString();
        this.revision = wrapper.readInt();
        this.format = wrapper.readString();
        this.document = wrapper.readString();
        this.fingerprint = wrapper.readString();
        this.changedEntities = wrapper.readInt();
        return true;
    }
}
