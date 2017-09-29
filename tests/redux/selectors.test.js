import * as selectors from '../../src/redux/selectors';


describe ('selectEntityById', () => {
    let store;
    let entityId;
    let entity;
    let expected;
    let actual;

    beforeAll(() => {
        entityId = 'entity-id';
        entity = 'entity';
        
        store = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
            },
        };
    });

    it('returns a the entity from the map if it exists', () => {
        expected = store[`${entity}Map`][entityId];
        actual = selectors.selectEntityById(store, entityId, entity);
        expect(actual).toEqual(expected);
    });

    it('returns a the entity from the map if preservedEntities does not exist', () => {
        entityId = 'does-not-exist';

        expected = {};
        actual = selectors.selectEntityById(store, entityId, entity);
        expect(actual).toEqual(expected);
    });
});

describe ('selectEntityByNamespaceAndId', () => {
    let storeNoNamespace;
    let storeNamespaceNoPreserved;
    let storePreserved;
    let namespace;
    let entityId;
    let noWhereElse;
    let entity;
    let expected;
    let actual;

    beforeAll(() => {
        namespace = 'namespace';
        entityId = 'entity-id';
        noWhereElse = 'no-where-else';
        entity = 'entity';
        
        storeNoNamespace = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'noWhereElse',
                },
            },
        };

        storeNamespaceNoPreserved = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'no-where-else',
                },
            },
            namespace: {},
        };

        storePreserved = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'no-where-else',
                },
            },
            namespace: {
                preservedEntities: {
                    [entityId]: {
                        id: 'entity-id',
                        preserved: 'lolz',
                    },
                },
            },
        };
    });

    it('returns a the entity from the map if the store does not have the namespace', () => {
        expected = storeNoNamespace[`${entity}Map`][entityId];
        actual = selectors.selectEntityByNamespaceAndId(storeNoNamespace, namespace, entityId, entity);
        expect(actual).toEqual(expected);
    });

    it('returns a the entity from the map if preservedEntities does not exist', () => {
        expected = storePreserved[`${entity}Map`][entityId];
        actual = selectors.selectEntityByNamespaceAndId(storeNamespaceNoPreserved, namespace, entityId, entity);
        expect(actual).toEqual(expected);
    });

    it('returns a the entity from the preserved section if it is preserved', () => {
        expected = storePreserved[namespace].preservedEntities[entityId];
        actual = selectors.selectEntityByNamespaceAndId(storePreserved, namespace, entityId, entity);
        expect(actual).toEqual(expected);
    });

    it('returns a the entity from the map if the preserved exist but the entity is only in the map', () => {
        entityId = noWhereElse;
        expected = storePreserved[`${entity}Map`][entityId];
        actual = selectors.selectEntityByNamespaceAndId(storePreserved, namespace, entityId, entity);
        expect(actual).toEqual(expected);
    });

    it('returns an empty object if entity is missing from the namespace and map', () => {
        entityId = 'does-not-exist';
        expected = {};
        actual = selectors.selectEntityByNamespaceAndId(storePreserved, namespace, entityId, entity);
        expect(actual).toEqual(expected);
    });
});

describe('selectEntitiesByNamespace', () => {
    let storeNoNamespace;
    let storeNoKeys;
    let storeMixedPreserved;
    let namespace;
    let entityId;
    let noWhereElse;
    let entity;
    let expected;
    let actual;

    beforeAll(() => {
        namespace = 'namespace';
        entityId = 'entity-id';
        noWhereElse = 'no-where-else';
        entity = 'entity';
        
        storeNoNamespace = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'noWhereElse',
                },
            },
            namespaces: [],
        };

        storeNoKeys = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'no-where-else',
                },
            },
            namespaces: [namespace],
            namespace: {
                preservedEntities: {
                    [entityId]: {
                        id: 'entity-id',
                        preserved: 'lolz',
                    },
                },
            },
        };

        storeMixedPreserved = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'no-where-else',
                },
            },
            namespaces: [namespace],
            namespace: {
                keys: [entityId, noWhereElse],
                preservedEntities: {
                    [entityId]: {
                        id: 'entity-id',
                        preserved: 'lolz',
                    },
                },
            },
        };
    });

    it('returns an empty array if the namespace does not exist', () => {
        expected = [];
        actual = selectors.selectEntitiesByNamespace(storeNoNamespace, namespace, entity);

        expect(actual).toEqual(expected);
    });

    it('returns an empty array if the namespace exists but has no keys array', () => {
        expected = [];
        actual = selectors.selectEntitiesByNamespace(storeNoKeys, namespace, entity);

        expect(actual).toEqual(expected);
    });

    it('returns an array of entities in from the namespace keys array, picking from the preservedEntites or data map as necessary', () => {
        expected = [
            {
                id: 'entity-id',
                preserved: 'lolz',
            },
            {
                id: 'no-where-else',
            },
        ];
        actual = selectors.selectEntitiesByNamespace(storeMixedPreserved, namespace, entity);

        expect(actual).toEqual(expected);
    });
});

describe('selectNamespaceIsFetching', () => {
    let storeNoNamespace;
    let storeIsFetching;
    let storeNotFetching;
    let namespace;
    let entityId;
    let noWhereElse;
    let entity;
    let expected;
    let actual;

    beforeAll(() => {
        namespace = 'namespace';
        entityId = 'entity-id';
        noWhereElse = 'no-where-else';
        entity = 'entity';
        
        storeNoNamespace = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'noWhereElse',
                },
            },
            namespaces: [],
        };

        storeIsFetching = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'no-where-else',
                },
            },
            namespaces: [namespace],
            namespace: {
                keys: [entityId, noWhereElse],
                isFetching: true,
                preservedEntities: {
                    [entityId]: {
                        id: 'entity-id',
                        preserved: 'lolz',
                    },
                },
            },
        };

        storeNotFetching = {
            entityMap: {
                [entityId]: {
                    id: 'entity-id',
                },
                [noWhereElse]: {
                    id: 'no-where-else',
                },
            },
            namespaces: [namespace],
            namespace: {
                keys: [entityId, noWhereElse],
                isFetching: false,
                preservedEntities: {
                    [entityId]: {
                        id: 'entity-id',
                        preserved: 'lolz',
                    },
                },
            },
        };
    });

    it('returns false if the namespace does not exist', () => {
        expected = false;
        actual = selectors.selectNamespaceIsFetching(storeNoNamespace, namespace);

        expect(actual).toEqual(expected);
    });

    it('returns false if the namespace exists and is not fetching', () => {
        expected = false;
        actual = selectors.selectNamespaceIsFetching(storeNotFetching, namespace);
        
        expect(actual).toEqual(expected);
    });
    
    it('returns true if the namespace exists and is fetching', () => {
        expected = true;
        actual = selectors.selectNamespaceIsFetching(storeIsFetching, namespace);

        expect(actual).toEqual(expected);
    });
});
