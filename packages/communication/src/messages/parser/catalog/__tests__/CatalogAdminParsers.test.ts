import { BinaryReader, BinaryWriter } from '@nitrots/utils';
import { describe, expect, it } from 'vitest';
import { CatalogAdminPageDetailsMessageParser } from '../CatalogAdminPageDetailsMessageParser';
import { CatalogAdminOfferDetailsMessageParser } from '../CatalogAdminOfferDetailsMessageParser';

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

describe('CatalogAdminPageDetailsMessageParser', () =>
{
    it('parses every persisted page field using the database layout code', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(42);
        writer.writeString('Guild shop');
        writer.writeString('guild_shop');
        writer.writeInt(7);
        writer.writeString('BOTH');
        writer.writeString('guild_furni');
        writer.writeInt(3);
        writer.writeInt(145);
        writer.writeInt(5);
        writer.writeInt(9);
        writer.writeByte(1);
        writer.writeByte(0);
        writer.writeByte(1);
        writer.writeByte(0);
        writer.writeString('headline');
        writer.writeString('teaser');
        writer.writeString('special');
        writer.writeString('text one');
        writer.writeString('text two');
        writer.writeString('details');
        writer.writeString('teaser text');
        writer.writeInt(123);
        writer.writeString('1;2;3');

        const parser = new CatalogAdminPageDetailsMessageParser();
        expect(parser.parse(new TestWrapper(new BinaryReader(writer.getBuffer())) as any)).toBe(true);

        expect(parser.pageId).toBe(42);
        expect((parser as any).parentId).toBe(7);
        expect((parser as any).catalogMode).toBe('BOTH');
        expect((parser as any).layout).toBe('guild_furni');
        expect((parser as any).iconColor).toBe(3);
        expect((parser as any).iconImage).toBe(145);
        expect((parser as any).clubOnly).toBe(true);
        expect((parser as any).vipOnly).toBe(false);
        expect((parser as any).headline).toBe('headline');
        expect((parser as any).teaser).toBe('teaser');
        expect((parser as any).special).toBe('special');
        expect((parser as any).textOne).toBe('text one');
        expect((parser as any).textTwo).toBe('text two');
        expect((parser as any).textDetails).toBe('details');
        expect((parser as any).textTeaser).toBe('teaser text');
        expect((parser as any).roomId).toBe(123);
        expect((parser as any).includes).toBe('1;2;3');
    });
});

describe('CatalogAdminOfferDetailsMessageParser', () =>
{
    it('parses the complete persisted offer instead of relying on the public catalog projection', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(99);
        writer.writeInt(42);
        writer.writeString('100:2;200:5');
        writer.writeString('quantity_bundle');
        writer.writeInt(25);
        writer.writeInt(10);
        writer.writeInt(5);
        writer.writeInt(1);
        writer.writeByte(1);
        writer.writeString('extra');
        writer.writeByte(0);
        writer.writeInt(77);
        writer.writeInt(100);
        writer.writeInt(12);
        writer.writeInt(4);
        writer.writeString('NORMAL');

        const parser = new CatalogAdminOfferDetailsMessageParser();
        expect(parser.parse(new TestWrapper(new BinaryReader(writer.getBuffer())) as any)).toBe(true);

        expect(parser.offerId).toBe(99);
        expect((parser as any).pageId).toBe(42);
        expect((parser as any).itemIds).toBe('100:2;200:5');
        expect((parser as any).catalogName).toBe('quantity_bundle');
        expect((parser as any).costCredits).toBe(25);
        expect((parser as any).costPoints).toBe(10);
        expect((parser as any).pointsType).toBe(5);
        expect((parser as any).amount).toBe(1);
        expect((parser as any).clubOnly).toBe(true);
        expect((parser as any).extradata).toBe('extra');
        expect((parser as any).haveOffer).toBe(false);
        expect(parser.offerIdGroup).toBe(77);
        expect(parser.limitedStack).toBe(100);
        expect((parser as any).limitedSells).toBe(12);
        expect(parser.orderNumber).toBe(4);
        expect((parser as any).catalogMode).toBe('NORMAL');
    });
});
