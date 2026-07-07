import { IAdvancedMap } from '../../utils';
import { IRoomObjectModel } from './IRoomObjectModel';

export interface IRoomObjectModelController extends IRoomObjectModel
{
    setNumber(key: string, value: number, override: boolean): void;
    setString(key: string, value: string, override: boolean): void;
    setNumberArray(key: string, value: [], override: boolean): void;
    setStringArray(key: string, value: [], override: boolean): void;
    setStringToStringMap(key: string, value: IAdvancedMap<any, any>, override: boolean): void;
}
