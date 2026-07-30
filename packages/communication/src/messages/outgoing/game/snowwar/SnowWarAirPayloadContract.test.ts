import { describe, expect, it } from 'vitest';
import { SnowWarCreateSnowballComposer } from './SnowWarCreateSnowballComposer';
import { SnowWarLoadStageReadyComposer } from './SnowWarLoadStageReadyComposer';
import { SnowWarSelectArenaComposer } from './SnowWarSelectArenaComposer';
import { SnowWarGetAllTimeFriendsLeaderboardComposer } from './SnowWarGetAllTimeFriendsLeaderboardComposer';
import { SnowWarGetAllTimeLeaderboardComposer } from './SnowWarGetAllTimeLeaderboardComposer';
import { SnowWarGetWeeklyFriendsLeaderboardComposer } from './SnowWarGetWeeklyFriendsLeaderboardComposer';
import { SnowWarGetWeeklyLeaderboardComposer } from './SnowWarGetWeeklyLeaderboardComposer';
import { SnowWarSaveEditorComposer } from './SnowWarSaveEditorComposer';
import { SnowWarThrowAtLocationComposer } from './SnowWarThrowAtLocationComposer';
import { SnowWarThrowAtPlayerComposer } from './SnowWarThrowAtPlayerComposer';
import { SnowWarWalkComposer } from './SnowWarWalkComposer';

describe('SnowWar AIR-compatible outgoing payloads', () =>
{
    it('reports a fully loaded arena stage', () =>
    {
        expect(new SnowWarLoadStageReadyComposer().getMessageArray()).toEqual([ 100 ]);
    });

    it('keeps the authoritative turn and subturn on synchronized actions', () =>
    {
        expect(new SnowWarWalkComposer(3200, 6400, 12, 3).getMessageArray())
            .toEqual([ 3200, 6400, 12, 3 ]);
        expect(new SnowWarThrowAtLocationComposer(9600, 12800, 2, 12, 4).getMessageArray())
            .toEqual([ 9600, 12800, 2, 12, 4 ]);
        expect(new SnowWarThrowAtPlayerComposer(77, 3, 13, 0).getMessageArray())
            .toEqual([ 77, 3, 13, 0 ]);
        expect(new SnowWarCreateSnowballComposer(13, 1).getMessageArray())
            .toEqual([ 13, 1 ]);
    });

    it('sends the lobby leader arena choice', () =>
    {
        expect(new SnowWarSelectArenaComposer(11).getMessageArray()).toEqual([ 11 ]);
    });

    it('preserves all four AIR leaderboard request shapes', () =>
    {
        expect(new SnowWarGetAllTimeLeaderboardComposer(0, -1, 0, 8, 50).getMessageArray())
            .toEqual([ 0, -1, 0, 8, 50 ]);
        expect(new SnowWarGetAllTimeFriendsLeaderboardComposer(0, -1, 0, 8, 50).getMessageArray())
            .toEqual([ 0, -1, 0, 8, 50 ]);
        expect(new SnowWarGetWeeklyLeaderboardComposer(0, 0, -1, 0, 8, 50).getMessageArray())
            .toEqual([ 0, 0, -1, 0, 8, 50 ]);
        expect(new SnowWarGetWeeklyFriendsLeaderboardComposer(0, 0, -1, 0, 8, 50).getMessageArray())
            .toEqual([ 0, 0, -1, 0, 8, 50 ]);
    });

    it('publishes a named custom arena', () =>
    {
        expect(new SnowWarSaveEditorComposer(1000, [], [], [ '00', '00' ], 'Duckie Arena').getMessageArray())
            .toEqual([ 1000, 0, 0, 2, '00', '00', 'Duckie Arena' ]);
    });
});
