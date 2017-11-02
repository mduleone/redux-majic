// @flow

import type {ReceiveMajicMeta, MajicAction} from './types';
import type {ParsedMajicObjects} from '../types';
import {RECEIVE_MAJIC_ENTITIES, CLEAR_NAMESPACE} from './constants';

export function createMajicAction(type: string, payload: {} = {}, meta: {} = {}, callbacks: {[string]: Function} = {}, error: boolean = false): MajicAction {
    return {
        type,
        payload,
        meta,
        callbacks: {
            default: null,
            ...callbacks,
        },
        error,
    };
}

export function receiveMajicEntitiesAction(entities: ParsedMajicObjects, meta: ReceiveMajicMeta): MajicAction {
    return createMajicAction(RECEIVE_MAJIC_ENTITIES, entities, meta);
}

export function clearNamespaceAction(namespace: string): MajicAction {
    return createMajicAction(CLEAR_NAMESPACE, {}, {namespace});
}
