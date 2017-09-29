// @flow

import type {ReceiveMajicMeta, MajicAction} from './types';
import type {ParsedMajicObjects} from '../types';
import {RECEIVE_MAJIC_ENTITIES, CLEAR_NAMESPACE} from './constants';

export function createMajicAction(type: string, payload: {} = {}, meta: {} = {}, callbacks: {[string]: Function} = {}): MajicAction {
    return {
        type,
        payload,
        meta,
        callbacks: {
            default: null,
            ...callbacks,
        },
    };
}

export function receiveMajicEntitiesAction(entities: ParsedMajicObjects, meta: ReceiveMajicMeta): MajicAction {
    return createMajicAction(RECEIVE_MAJIC_ENTITIES, entities, meta);
}

export function clearNamespaceAction(namespace: string): MajicAction {
    return createMajicAction(CLEAR_NAMESPACE, {}, {namespace});
}
