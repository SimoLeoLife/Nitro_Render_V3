import { describe, expect, it } from 'vitest';
import { NitroMessages } from '../../../../NitroMessages';
import { OutgoingHeader } from '../../OutgoingHeader';
import { CatalogAdminSavePageIconComposer } from '../CatalogAdminSavePageIconComposer';
import { CatalogAdminSavePageImagesComposer } from '../CatalogAdminSavePageImagesComposer';
import * as CatalogAdminComposers from '..';

describe('catalog admin packet contract', () =>
{
    it('matches the emulator page asset update headers', () =>
    {
        expect(OutgoingHeader.CATALOG_ADMIN_SAVE_PAGE_IMAGES).toBe(10060);
        expect(OutgoingHeader.CATALOG_ADMIN_SAVE_PAGE_ICON).toBe(10061);
    });

    it('registers both page asset composers', () =>
    {
        const messages = new NitroMessages();

        expect(messages.composers.get(10060)).toBe(CatalogAdminSavePageImagesComposer);
        expect(messages.composers.get(10061)).toBe(CatalogAdminSavePageIconComposer);
    });

    it('uses dedicated page state packets so root parent id remains available for moves', () =>
    {
        const SetEnabled = (CatalogAdminComposers as any).CatalogAdminSetPageEnabledComposer;
        const SetVisible = (CatalogAdminComposers as any).CatalogAdminSetPageVisibleComposer;

        expect((OutgoingHeader as any).CATALOG_ADMIN_SET_PAGE_ENABLED).toBe(10064);
        expect((OutgoingHeader as any).CATALOG_ADMIN_SET_PAGE_VISIBLE).toBe(10065);
        expect(new SetEnabled(42, false, 'NORMAL').getMessageArray()).toEqual([ 42, false, 'NORMAL' ]);
        expect(new SetVisible(42, true, 'NORMAL').getMessageArray()).toEqual([ 42, true, 'NORMAL' ]);
    });

    it('sends offer ordering as one atomic batch', () =>
    {
        const ReorderOffers = (CatalogAdminComposers as any).CatalogAdminReorderOffersComposer;

        expect((OutgoingHeader as any).CATALOG_ADMIN_REORDER_OFFERS).toBe(10066);
        expect(new ReorderOffers([ { id: 10, orderNumber: 0 }, { id: 11, orderNumber: 1 } ], 'NORMAL').getMessageArray())
            .toEqual([ 2, 10, 0, 11, 1, 'NORMAL' ]);
    });

    it('sends every editable page field when saving', () =>
    {
        const SavePage = (CatalogAdminComposers as any).CatalogAdminSavePageComposer;
        const message = new SavePage(
            42, 'Guild shop', 'guild_shop', 'guild_furni', 145, 5, true, false, 9, 7,
            'headline', 'teaser', 'details', 'NORMAL', 'BOTH', 'text one',
            3, true, false, 'special', 'text two', 'teaser text', 123, '1;2;3'
        ).getMessageArray();

        expect(message).toEqual([
            42, 'Guild shop', 'guild_shop', 'guild_furni', 145, 5, true, false, 9, 7,
            'headline', 'teaser', 'details', 'NORMAL', 'BOTH', 'text one',
            3, true, false, 'special', 'text two', 'teaser text', 123, '1;2;3'
        ]);
    });

    it('sends every editable page field when creating', () =>
    {
        const CreatePage = (CatalogAdminComposers as any).CatalogAdminCreatePageComposer;
        const message = new CreatePage(
            'Guild shop', 'guild_shop', 'guild_furni', 145, 5, true, false, 9, 7,
            'NORMAL', 'BOTH', 3, true, false, 'headline', 'teaser', 'special',
            'text one', 'text two', 'details', 'teaser text', 123, '1;2;3'
        ).getMessageArray();

        expect(message).toEqual([
            'Guild shop', 'guild_shop', 'guild_furni', 145, 5, true, false, 9, 7,
            'NORMAL', 'BOTH', 3, true, false, 'headline', 'teaser', 'special',
            'text one', 'text two', 'details', 'teaser text', 123, '1;2;3'
        ]);
    });
});
