import { BinaryReader, BinaryWriter } from '@nitrots/utils';
import { describe, expect, it } from 'vitest';
import { NitroMessages } from '../../../../NitroMessages';
import { IncomingHeader } from '../../../incoming/IncomingHeader';
import { OutgoingHeader } from '../../../outgoing/OutgoingHeader';
import {
    CatalogStudioAcquireLockComposer,
    CatalogStudioDocumentApplyComposer,
    CatalogStudioDocumentDryRunComposer,
    CatalogStudioExportComposer,
    CatalogStudioHistoryComposer,
    CatalogStudioOpenSessionComposer,
    CatalogStudioPublishComposer,
    CatalogStudioPreviewComposer,
    CatalogStudioRenewLockComposer,
    CatalogStudioRestoreComposer,
    CatalogStudioUndoComposer
} from '../../../outgoing/catalog/studio';
import { CatalogStudioHistoryMessageParser } from '../../../parser/catalog/studio/CatalogStudioHistoryMessageParser';
import { CatalogStudioDocumentResultMessageParser } from '../../../parser/catalog/studio/CatalogStudioDocumentResultMessageParser';
import { CatalogStudioPreviewMessageParser } from '../../../parser/catalog/studio/CatalogStudioPreviewMessageParser';
import { CatalogStudioSessionMessageParser } from '../../../parser/catalog/studio/CatalogStudioSessionMessageParser';
import { CatalogStudioValidationMessageParser } from '../../../parser/catalog/studio/CatalogStudioValidationMessageParser';

class TestWrapper
{
    constructor(private reader: BinaryReader) {}
    readByte() { return this.reader.readByte(); }
    readBytes(length: number) { return this.reader.readBytes(length); }
    readBoolean() { return this.reader.readByte() === 1; }
    readShort() { return this.reader.readShort(); }
    readInt() { return this.reader.readInt(); }
    readFloat() { return this.reader.readFloat(); }
    readDouble() { return this.reader.readDouble(); }
    readString() { const length = this.reader.readShort(); return this.reader.readBytes(length).toString(); }
    header = 0;
    get bytesAvailable() { return this.reader.remaining() > 0; }
}

describe('catalog studio packet contract', () =>
{
    it('uses the emulator headers and registers every request and response', () =>
    {
        const messages = new NitroMessages();

        for(let header = 10067; header <= 10076; header++)
        {
            expect(messages.composers.has(header)).toBe(true);
            expect(messages.events.has(header)).toBe(true);
        }

        expect(OutgoingHeader.CATALOG_STUDIO_OPEN_SESSION).toBe(10067);
        expect(IncomingHeader.CATALOG_STUDIO_RESTORE).toBe(10076);
        for(let header = 10077; header <= 10080; header++) expect(messages.composers.has(header)).toBe(true);
        for(let header = 10077; header <= 10078; header++) expect(messages.events.has(header)).toBe(true);
    });

    it('serializes requests in the frozen emulator field order', () =>
    {
        expect(new CatalogStudioOpenSessionComposer().getMessageArray()).toEqual([]);
        expect(new CatalogStudioAcquireLockComposer('op-acquire', 12, 'PAGE', 'BUILDER', 44).getMessageArray())
            .toEqual([ 'op-acquire', 12, 'PAGE', 'BUILDER', 44 ]);
        expect(new CatalogStudioRenewLockComposer('op-renew', 12, 'OFFER', 'NORMAL', 77, 'token').getMessageArray())
            .toEqual([ 'op-renew', 12, 'OFFER', 'NORMAL', 77, 'token' ]);
        expect(new CatalogStudioHistoryComposer(12, -4, 5000).getMessageArray()).toEqual([ 12, -4, 5000 ]);
        expect(new CatalogStudioUndoComposer('op-undo', 12, 7, 91).getMessageArray())
            .toEqual([ 'op-undo', 12, 7, 91 ]);
        expect(new CatalogStudioPublishComposer('op-publish', 12, 7).getMessageArray())
            .toEqual([ 'op-publish', 12, 7 ]);
        expect(new CatalogStudioRestoreComposer('op-restore', 12, 7, 11).getMessageArray())
            .toEqual([ 'op-restore', 12, 7, 11 ]);
        expect(new CatalogStudioExportComposer('op-export', 12, 7, 'JSONC').getMessageArray())
            .toEqual([ 'op-export', 12, 7, 'JSONC' ]);
        expect(new CatalogStudioDocumentDryRunComposer('op-dry', 12, 7, 'SQL', 'UPDATE x').getMessageArray())
            .toEqual([ 'op-dry', 12, 7, 'SQL', 'UPDATE x' ]);
        expect(new CatalogStudioDocumentApplyComposer('op-apply', 12, 7, 'root-token', 'BULK', '{}', 'abc', 'Apply bulk').getMessageArray())
            .toEqual([ 'op-apply', 12, 7, 'root-token', 'BULK', '{}', 'abc', 'Apply bulk' ]);
        expect(new CatalogStudioPreviewComposer('op-preview', 12, 7, 4, true, false, true, false, 500, { 5: 25 }).getMessageArray())
            .toEqual([ 'op-preview', 12, 7, 4, true, false, true, false, 500, 1, 5, 25 ]);
    });

    it('parses exact preview and document results', () =>
    {
        const previewWriter = new BinaryWriter();
        previewWriter.writeString('op-preview'); previewWriter.writeInt(7);
        previewWriter.writeString('[{"catalogType":"NORMAL","pageId":17}]');
        previewWriter.writeString('[{"offer":{"catalogType":"NORMAL","offerId":42},"eligible":false,"reasons":["RANK"]}]');
        const preview = new CatalogStudioPreviewMessageParser();
        expect(preview.parse(new TestWrapper(new BinaryReader(previewWriter.getBuffer())) as any)).toBe(true);
        expect(preview.pages[0].pageId).toBe(17);
        expect(preview.offers[0].reasons).toEqual([ 'RANK' ]);

        const resultWriter = new BinaryWriter();
        resultWriter.writeString('op-dry'); resultWriter.writeByte(1); resultWriter.writeString('DRY_RUN_READY');
        resultWriter.writeString('Dry-run ready'); resultWriter.writeInt(7); resultWriter.writeString('JSONC');
        resultWriter.writeString('{}'); resultWriter.writeString('fingerprint'); resultWriter.writeInt(3);
        const result = new CatalogStudioDocumentResultMessageParser();
        expect(result.parse(new TestWrapper(new BinaryReader(resultWriter.getBuffer())) as any)).toBe(true);
        expect(result).toMatchObject({ success: true, revision: 7, format: 'JSONC', changedEntities: 3 });
    });

    it('parses a studio session with actors and published versions', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(11); writer.writeInt(12); writer.writeInt(7);
        writer.writeString('2026-08-02T10:00:00Z'); writer.writeString('2026-08-02T10:05:00Z');
        writer.writeInt(3); writer.writeInt(1); writer.writeInt(9); writer.writeString('Alice');
        writer.writeByte(1); writer.writeInt(2); writer.writeInt(1);
        writer.writeInt(11); writer.writeString('Summer catalog'); writer.writeString('2026-08-02T10:00:00Z');
        writer.writeString('[]'); writer.writeString('[]');

        const parser = new CatalogStudioSessionMessageParser();
        expect(parser.parse(new TestWrapper(new BinaryReader(writer.getBuffer())) as any)).toBe(true);
        expect(parser.draftVersionId).toBe(12);
        expect(parser.actors).toEqual([ { id: 9, username: 'Alice' } ]);
        expect(parser.validationCurrent).toBe(true);
        expect(parser.publishedVersions[0].label).toBe('Summer catalog');
        expect(parser.pages).toEqual([]);
        expect(parser.offers).toEqual([]);
    });

    it('parses history groups and navigable validation issues', () =>
    {
        const historyWriter = new BinaryWriter();
        historyWriter.writeInt(12); historyWriter.writeInt(7); historyWriter.writeInt(1); historyWriter.writeInt(1);
        historyWriter.writeInt(91); historyWriter.writeInt(7); historyWriter.writeInt(9); historyWriter.writeString('Alice');
        historyWriter.writeString('Move offer'); historyWriter.writeString('UI'); historyWriter.writeString('2026-08-02T10:05:30Z');
        historyWriter.writeInt(1); historyWriter.writeString('OFFER'); historyWriter.writeInt(77); historyWriter.writeString('MOVE');

        const history = new CatalogStudioHistoryMessageParser();
        expect(history.parse(new TestWrapper(new BinaryReader(historyWriter.getBuffer())) as any)).toBe(true);
        expect(history.groups[0].entries[0]).toEqual({ entityType: 'OFFER', entityId: 77, operation: 'MOVE' });

        const validationWriter = new BinaryWriter();
        validationWriter.writeString('op-validation'); validationWriter.writeByte(0);
        validationWriter.writeString('VALIDATION_FAILED'); validationWriter.writeString('One issue found');
        validationWriter.writeInt(7); validationWriter.writeByte(1); validationWriter.writeInt(1);
        validationWriter.writeString('PAGE_PARENT_MISSING'); validationWriter.writeString('PAGE'); validationWriter.writeInt(44);
        validationWriter.writeString('parentId'); validationWriter.writeString('Parent page is missing');

        const validation = new CatalogStudioValidationMessageParser();
        expect(validation.parse(new TestWrapper(new BinaryReader(validationWriter.getBuffer())) as any)).toBe(true);
        expect(validation.issues[0]).toEqual({
            code: 'PAGE_PARENT_MISSING', entityType: 'PAGE', entityId: 44,
            field: 'parentId', message: 'Parent page is missing'
        });
    });
});
