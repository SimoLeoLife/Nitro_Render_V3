import { readFileSync } from 'node:fs';
import {
    PacketContract,
    PacketContractManifest,
    PacketDirection,
    PacketEndpoint,
    PacketExemption,
    PacketHeaderRange,
    PacketMetadata,
    PacketOrigin,
    PacketRegistryPolicy,
    PacketSide,
    PacketStability,
    ScalarType,
    UnpairedPacket,
    WireSchema
} from './PacketContractTypes';

const DIRECTIONS = new Set<PacketDirection>(['client_to_server', 'server_to_client']);
const SCALAR_TYPES = new Set<ScalarType>(['byte', 'short', 'int', 'long', 'boolean', 'string', 'bytes']);
const SIDES = new Set(['java', 'typescript']);
const ORIGINS = new Set<PacketOrigin>(['official', 'custom']);
const STABILITIES = new Set<PacketStability>(['stable', 'experimental', 'deprecated']);
const GENERIC_REASONS = new Set(['complex packet', 'dynamic packet', 'unsupported packet', 'todo']);

export const loadPacketContractManifest = (path: string): PacketContractManifest =>
    parsePacketContractManifest(JSON.parse(readFileSync(path, 'utf8')) as unknown);

export const parsePacketContractManifest = (input: unknown): PacketContractManifest =>
{
    const root = object(input, 'manifest');
    if(root.schemaVersion !== 2) throw new TypeError('packet contract manifest requires schemaVersion 2');

    const registry = packetRegistry(root.registry);
    const contracts = array(root.contracts, 'contracts').map((value, index) => contract(value, `contracts[${ index }]`));
    const unpaired = array(root.unpaired, 'unpaired').map((value, index) => unpairedPacket(value, `unpaired[${ index }]`));
    const exemptions = array(root.exemptions, 'exemptions').map((value, index) => exemption(value, `exemptions[${ index }]`));
    const classified = new Set<string>();
    for(const entry of [...contracts, ...unpaired, ...exemptions])
    {
        const key = `${ entry.direction }:${ entry.header }`;
        if(classified.has(key)) throw new TypeError(`${ key } is classified more than once`);
        classified.add(key);
    }
    for(const alias of registry.aliases)
    {
        const key = `${ alias.direction }:${ alias.header }`;
        if(!classified.has(key)) throw new TypeError(`alias header ${ key } is not classified`);
    }

    return deepFreeze({ schemaVersion: 2, registry, contracts, unpaired, exemptions });
};

const packetRegistry = (input: unknown): PacketRegistryPolicy =>
{
    const value = object(input, 'registry');
    const defaultsValue = object(value.defaults, 'registry.defaults');
    const defaults = {
        origin: origin(defaultsValue.origin, 'registry.defaults.origin'),
        stability: stability(defaultsValue.stability, 'registry.defaults.stability')
    };
    const ranges = array(value.ranges, 'registry.ranges').map((entry, index) =>
        packetRange(entry, `registry.ranges[${ index }]`));
    validateRanges(ranges);
    const aliases = array(value.aliases, 'registry.aliases').map((entry, index) =>
    {
        const context = `registry.aliases[${ index }]`;
        const alias = object(entry, context);
        const canonical = nonEmptyString(alias.canonical, `${ context }.canonical`);
        const symbols = array(alias.aliases, `${ context }.aliases`).map((symbol, aliasIndex) =>
            nonEmptyString(symbol, `${ context }.aliases[${ aliasIndex }]`));
        if(!symbols.length) throw new TypeError(`${ context } requires aliases`);
        if(symbols.includes(canonical) || new Set(symbols).size !== symbols.length)
            throw new TypeError(`${ context } contains duplicate symbols`);
        return {
            side: side(alias.side, `${ context }.side`),
            direction: direction(alias.direction, context),
            header: positiveInteger(alias.header, `${ context }.header`),
            canonical,
            aliases: symbols,
            reason: concreteReason(alias.reason, context)
        };
    });
    const unsupportedKeys = new Set<string>();
    const unsupported = array(value.unsupported, 'registry.unsupported').map((entry, index) =>
    {
        const context = `registry.unsupported[${ index }]`;
        const packet = object(entry, context);
        const result = {
            side: side(packet.side, `${ context }.side`),
            direction: direction(packet.direction, context),
            symbol: nonEmptyString(packet.symbol, `${ context }.symbol`),
            reason: concreteReason(packet.reason, context)
        };
        const key = `${ result.side }:${ result.direction }:${ result.symbol }`;
        if(unsupportedKeys.has(key)) throw new TypeError(`duplicate unsupported packet ${ key }`);
        unsupportedKeys.add(key);
        return result;
    });
    return {
        defaults,
        ranges,
        aliases,
        unsupported,
        metadataFor: (packetDirection: PacketDirection, header: number): PacketMetadata =>
        {
            const range = ranges.find(candidate => candidate.direction === packetDirection
                && header >= candidate.start && header <= candidate.end);
            return range
                ? { range: range.name, origin: range.origin, feature: range.feature, stability: range.stability }
                : { range: '', origin: defaults.origin, feature: '', stability: defaults.stability };
        }
    };
};

const packetRange = (input: unknown, context: string): PacketHeaderRange =>
{
    const value = object(input, context);
    const start = positiveInteger(value.start, `${ context }.start`);
    const end = positiveInteger(value.end, `${ context }.end`);
    if(end < start) throw new TypeError(`${ context } ends before it starts`);
    return {
        name: nonEmptyString(value.name, `${ context }.name`),
        direction: direction(value.direction, context),
        start,
        end,
        origin: origin(value.origin, `${ context }.origin`),
        feature: nonEmptyString(value.feature, `${ context }.feature`),
        stability: stability(value.stability, `${ context }.stability`)
    };
};

const validateRanges = (ranges: readonly PacketHeaderRange[]): void =>
{
    const names = new Set<string>();
    for(const range of ranges)
    {
        if(names.has(range.name)) throw new TypeError(`duplicate registry range ${ range.name }`);
        names.add(range.name);
    }
    for(let left = 0; left < ranges.length; left++)
    {
        for(let right = left + 1; right < ranges.length; right++)
        {
            const first = ranges[left];
            const second = ranges[right];
            if(first.direction !== second.direction) continue;
            if(first.start <= second.end && second.start <= first.end)
                throw new TypeError(`overlapping ${ first.direction } registry ranges ${ first.name } and ${ second.name }`);
        }
    }
};

const origin = (input: unknown, context: string): PacketOrigin =>
{
    const value = nonEmptyString(input, context);
    if(!ORIGINS.has(value as PacketOrigin)) throw new TypeError(`${ context } has unknown origin ${ value }`);
    return value as PacketOrigin;
};

const stability = (input: unknown, context: string): PacketStability =>
{
    const value = nonEmptyString(input, context);
    if(!STABILITIES.has(value as PacketStability)) throw new TypeError(`${ context } has unknown stability ${ value }`);
    return value as PacketStability;
};

const side = (input: unknown, context: string): PacketSide =>
{
    const value = nonEmptyString(input, context);
    if(!SIDES.has(value)) throw new TypeError(`${ context } has invalid side ${ value }`);
    return value as PacketSide;
};

const contract = (input: unknown, context: string): PacketContract =>
{
    const value = object(input, context);
    return {
        name: nonEmptyString(value.name, `${ context }.name`),
        direction: direction(value.direction, context),
        header: positiveInteger(value.header, `${ context }.header`),
        java: endpoint(value.java, `${ context }.java`),
        typescript: endpoint(value.typescript, `${ context }.typescript`),
        fields: array(value.fields, `${ context }.fields`).map((field, index) => schema(field, `${ context }.fields[${ index }]`))
    };
};

const unpairedPacket = (input: unknown, context: string): UnpairedPacket =>
{
    const value = object(input, context);
    const side = nonEmptyString(value.side, `${ context }.side`);
    if(!SIDES.has(side)) throw new TypeError(`${ context } has invalid side ${ side }`);
    return {
        direction: direction(value.direction, context),
        side: side as UnpairedPacket['side'],
        header: positiveInteger(value.header, `${ context }.header`),
        symbol: nonEmptyString(value.symbol, `${ context }.symbol`),
        path: nonEmptyString(value.path, `${ context }.path`),
        reason: concreteReason(value.reason, context)
    };
};

const exemption = (input: unknown, context: string): PacketExemption =>
{
    const value = object(input, context);
    return {
        name: nonEmptyString(value.name, `${ context }.name`),
        direction: direction(value.direction, context),
        header: positiveInteger(value.header, `${ context }.header`),
        java: endpoint(value.java, `${ context }.java`),
        typescript: endpoint(value.typescript, `${ context }.typescript`),
        reason: concreteReason(value.reason, context)
    };
};

const endpoint = (input: unknown, context: string): PacketEndpoint =>
{
    const value = object(input, context);
    return {
        symbol: nonEmptyString(value.symbol, `${ context }.symbol`),
        className: nonEmptyString(value.className, `${ context }.className`),
        path: nonEmptyString(value.path, `${ context }.path`)
    };
};

const schema = (input: unknown, context: string): WireSchema =>
{
    const value = object(input, context);
    const kind = nonEmptyString(value.kind, `${ context }.kind`);
    if(kind === 'scalar')
    {
        const type = nonEmptyString(value.type, `${ context }.type`);
        if(!SCALAR_TYPES.has(type as ScalarType)) throw new TypeError(`${ context } has unknown scalar type ${ type }`);
        return { type: type as ScalarType, name: string(value.name, `${ context }.name`) };
    }
    if(kind === 'list')
    {
        const countType = nonEmptyString(value.countType, `${ context }.countType`);
        if(!SCALAR_TYPES.has(countType as ScalarType)) throw new TypeError(`${ context } has unknown scalar type ${ countType }`);
        return {
            type: 'list',
            countType: countType as ScalarType,
            item: array(value.item, `${ context }.item`).map((field, index) => schema(field, `${ context }.item[${ index }]`))
        };
    }
    if(kind === 'optional')
    {
        return {
            type: 'optional',
            controller: nonEmptyString(value.controller, `${ context }.controller`),
            fields: array(value.fields, `${ context }.fields`).map((field, index) => schema(field, `${ context }.fields[${ index }]`))
        };
    }
    if(kind === 'variant')
    {
        const branches = object(value.branches, `${ context }.branches`);
        return {
            type: 'variant',
            discriminator: nonEmptyString(value.discriminator, `${ context }.discriminator`),
            branches: Object.fromEntries(Object.entries(branches).map(([key, fields]) => [
                key,
                array(fields, `${ context }.branches.${ key }`).map((field, index) => schema(field, `${ context }.branches.${ key }[${ index }]`))
            ]))
        };
    }
    throw new TypeError(`${ context } has unknown schema kind ${ kind }`);
};

const direction = (input: unknown, context: string): PacketDirection =>
{
    if(typeof input !== 'string' || !DIRECTIONS.has(input as PacketDirection))
        throw new TypeError(`${ context } has invalid direction ${ String(input) }`);
    return input as PacketDirection;
};

const concreteReason = (input: unknown, context: string): string =>
{
    const reason = nonEmptyString(input, `${ context }.reason`);
    if(reason.length < 20 || GENERIC_REASONS.has(reason.toLowerCase()))
        throw new TypeError(`${ context } requires a concrete exemption reason`);
    return reason;
};

const object = (input: unknown, context: string): Record<string, unknown> =>
{
    if(!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError(`${ context } must be an object`);
    return input as Record<string, unknown>;
};

const array = (input: unknown, context: string): unknown[] =>
{
    if(!Array.isArray(input)) throw new TypeError(`${ context } must be an array`);
    return input;
};

const string = (input: unknown, context: string): string =>
{
    if(typeof input !== 'string') throw new TypeError(`${ context } must be a string`);
    return input;
};

const nonEmptyString = (input: unknown, context: string): string =>
{
    const value = string(input, context).trim();
    if(!value) throw new TypeError(`${ context } must not be empty`);
    return value;
};

const positiveInteger = (input: unknown, context: string): number =>
{
    if(!Number.isInteger(input) || (input as number) <= 0) throw new TypeError(`${ context } must be a positive integer`);
    return input as number;
};

const deepFreeze = <T>(input: T): T =>
{
    if(input && typeof input === 'object' && !Object.isFrozen(input))
    {
        Object.freeze(input);
        for(const value of Object.values(input)) deepFreeze(value);
    }
    return input;
};
