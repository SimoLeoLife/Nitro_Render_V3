import { describe, expect, it } from 'vitest';
import { SSOTicketMessageComposer } from './SSOTicketMessageComposer';

describe('SSOTicketMessageComposer', () =>
{
    it('uses an empty optional field when no recovery token exists', () =>
    {
        expect(new SSOTicketMessageComposer('sso', 12).getMessageArray()).toEqual([ 'sso', 12, '' ]);
    });

    it('appends a recovery token when reconnecting after a controlled restart', () =>
    {
        expect(new SSOTicketMessageComposer('sso', 12, 'recovery').getMessageArray())
            .toEqual([ 'sso', 12, 'recovery' ]);
    });
});
