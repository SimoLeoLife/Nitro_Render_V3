import { IMessageDataWrapper, IMessageParser } from '@nitrots/api';
import { SnowWarPlayerData } from './SnowWarPlayerData';

/**
 * Provisional pre-match line-up sent during the lobby countdown so the client
 * can show the waiting players split into their teams (Red / Blue) before the
 * arena splash. Player records use the SnowWarPlayerData wire shape (objectId
 * is 0 here - the real match, and its object ids, only exists once the
 * countdown ends).
 */
export class SnowWarLobbyTeamsParser implements IMessageParser
{
    private _teamCount: number;
    private _players: SnowWarPlayerData[];

    public flush(): boolean
    {
        this._teamCount = 0;
        this._players = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._teamCount = wrapper.readInt();

        let totalPlayers = wrapper.readInt();

        while(totalPlayers > 0)
        {
            this._players.push(new SnowWarPlayerData(wrapper));

            totalPlayers--;
        }

        return true;
    }

    public get teamCount(): number
    {
        return this._teamCount;
    }

    public get players(): SnowWarPlayerData[]
    {
        return this._players;
    }
}
