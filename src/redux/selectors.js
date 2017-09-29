// @flow

export function selectEntityById(entityStore: {}, id: string, entity: string): {} {
    return entityStore[`${entity}Map`][id] || {};
}

export function selectEntityByNamespaceAndId(entityStore: {}, namespace: string, id: string, entity: string): {} {
    return (entityStore[namespace] && entityStore[namespace].preservedEntities && entityStore[namespace].preservedEntities[id]) || entityStore[`${entity}Map`][id] || {};
}

export function selectEntitiesByNamespace(entityStore: {}, namespace: string, entity: string): [] {
    if (!entityStore || !entityStore[namespace] || !entityStore[namespace].keys || entityStore[namespace].keys.length === 0) {
        return [];
    }

    return entityStore[namespace].keys.map(entityId => selectEntityByNamespaceAndId(entityStore, namespace, entityId, entity));
}

export function selectNamespaceIsFetching(entityStore: {}, namespace: string): boolean {
    return !!entityStore[namespace] && !!entityStore[namespace].isFetching;
}
