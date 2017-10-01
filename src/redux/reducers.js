// @flow

import type {ReceiveMajicConfigObject, ReceiveMajicMeta, MajicAction, MajicMapper} from './types';
import type {MajicEntities, ParsedMajicObjects} from '../types';
import {RECEIVE_MAJIC_ENTITIES, CLEAR_NAMESPACE} from './constants';
import {omit, isEmpty, stringUniq, stringWithout} from '../utils';

/**
 * 
 * @param {*} state
 * @param {MagicAction} action
 * @return {*}
 */
export function requestMajicNamespace(state: {namespaces?: string[]}, {meta: {namespace}}: MajicAction): {namespaces?: string[]} {
    if (!namespace) {
        return state;
    }

    return {
        ...state,
        namespaces: stringUniq([...(state.namespaces || []), namespace].filter((el: any): boolean => !!el)),
        [namespace]: {
            ...state[namespace],
            isFetching: true,
        },
    };
}

/**
 * 
 * @param {[string]: {*}} existingMap
 * @param {data: {[string]: {*}}} receivedEntities
 * @return {[string]: {*}}
 */
export function standardMapper(
    existingMap: {[string]: {}},
    receivedEntities: {data: {[string]: {}}},
): {[string]: {}} {
    return {
        ...existingMap,
        ...receivedEntities.data,
    };
}

/**
 * 
 * @param {*} state
 * @param {MajicAction} action
 * @param {string|string[]} primaryEntities entity types to listen for as "primary" entities
 *          Primary entities are entity types we store in the associated namespace. Per JSONAPI, every request has at least one primary entity.
 * @param {ReceiveMajicConfigObject?} config (optional) {entities: ?string[], mapFunctions: ?{[string]: MajicMapper}}
 *      `entities` is the complete list of entities this reducer should receive. If it is omitted, it defaults to `primaryEntities`. This is useful if a reducer needs to track multiple entities, but will never want to store some of them in the namespace
 *      `mapFunctions` is a object keyed on entity-types with special functions to use to update an entity-type's map if the standard map builder is insufficient.
 * @return {*}
 */
export function receiveMajicEntitiesReducer(
    state: {namespaces: ?string[]},
    action: MajicAction,
    primaryEntities: string|string[] = [],
    {mapFunctions = {}, entities}: ReceiveMajicConfigObject = {},
): {} {
    if (action.type !== RECEIVE_MAJIC_ENTITIES) {
        return state;
    }
    
    const {payload, meta: {namespace, preserveEntities, appendKeys}}: {payload: ParsedMajicObjects, meta: ReceiveMajicMeta} = action;

    if (!entities) {
        entities = Array.isArray(primaryEntities) ? primaryEntities : [primaryEntities];
    }

    entities.forEach((entity: string) => {
        mapFunctions[entity] = typeof mapFunctions[entity] === 'function' ? mapFunctions[entity] : standardMapper;
    });

    const {receivedEntities, newEntityMaps}: {receivedEntities: {[string]: MajicEntities}, newEntityMaps: {}} = entities.reduce(
        (aggregator, entity) => {
            const [newEntities, newMap] = !!payload[entity]
                ? (
                    [
                        {[entity]: payload[entity]},
                        {[`${entity}Map`]: mapFunctions[entity](state[`${entity}Map`], payload[entity])},
                    ]
                )
                : (
                    []
                );

            return {
                receivedEntities: {
                    ...aggregator.receivedEntities,
                    ...newEntities,
                },
                newEntityMaps: {
                    ...aggregator.newEntityMaps,
                    ...newMap,
                },
            };
        },
        {receivedEntities: {}, newEntityMaps: {}}
    );

    if (isEmpty(receivedEntities)) {
        return state;
    }

    let newNamespace = {};
    if (!!namespace) {
        const {__primaryEntities} = payload;

        if (!Array.isArray(primaryEntities)) {
            primaryEntities = [primaryEntities];
        }

        primaryEntities.forEach((entity: string) => {
            const {keys, data = {}} = receivedEntities[entity];

            // We didn't receive any of this entity in the data payload
            if ((__primaryEntities && !__primaryEntities.includes(entity)) || !keys) {
                return;
            }

            const oldKeys = (state[namespace] || {}).keys || [];
            const oldPreservedEntities = (state[namespace] || {}).preservedEntities || {};

            newNamespace = {
                [namespace]: {
                    ...state[namespace],
                    isFetching: false,
                    keys: appendKeys ? [...oldKeys, ...keys] : keys,
                    preservedEntities: preserveEntities ? {
                        ...(appendKeys ? oldPreservedEntities : {}),
                        ...keys.reduce((agg, curr) => ({...agg, [curr]: data[curr]}), {}),
                    } : {},
                },
            };
        });

    }

    const namespaces = stringUniq([...(state.namespaces || []), namespace])
        .filter((el: ?string): boolean => !!el);

    return {
        ...state,
        ...newEntityMaps,
        ...newNamespace,
        namespaces,
    };
}

/**
 * 
 * @param {*} state
 * @param {MajicAction} action
 * @return {*}
 */
export function clearMajicNamespaceReducer(state: {namespaces?: string[]}, action: MajicAction): {} {
    if (action.type !== CLEAR_NAMESPACE) {
        return state;
    }

    const {meta: {namespace}}: {meta: ReceiveMajicMeta} = action;

    return {
        ...omit(state, namespace),
        namespaces: stringWithout(state.namespaces || [], namespace),
    };
}
