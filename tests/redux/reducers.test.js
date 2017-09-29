import * as reducers from '../../src/redux/reducers';
import * as actions from '../../src/redux/actions';
import {parsedArticle1} from '../states';

describe('requestMajicNamespace', () => {
    let state;
    let action;
    let namespace;
    let expected;
    let actual;
    it('returns state if the action meta does not have a namespace', () => {
        state = {namespaces: []};
        action = actions.createMajicAction('NOTHING_TO_SEE_HERE', {}, {});
        expected = state;
        actual = reducers.requestMajicNamespace(state, action);

        expect(actual).toEqual(expected);
    });

    it(`adds the action meta's namespace to the namespaces array if it was not there already and sets isFetching to true on the namespace`, () => {
        namespace = 'namespace';
        state = {namespaces: []};
        action = actions.createMajicAction('REQUEST_ENTITY', {}, {namespace});
        expected = {
            namespaces: [namespace],
            [namespace]: {
                isFetching: true,
            },
        };
        actual = reducers.requestMajicNamespace(state, action);

        expect(actual).toEqual(expected);
    });
});

describe('standardMapper', () => {
    it('returns an object that combines the existing map with the data on the received `data` key', () => {
        const received = {
            data: {
                'id': {
                    id: 'id'
                },
            },
        };

        const current = {};
        const actual = reducers.standardMapper(current, received);
        const expected = received.data;

        expect(actual).toEqual(expected);
    });

    it('returns an object that combines the existing map with the data on the received `data` key, preserving any the old data not also received', () => {
        const received = {
            data: {
                'newId': {
                    'id': 'newId'
                },
                'changingId': {
                    'id': 'chaningId',
                    'newProp': 'newprop',
                },
            },
        };

        const current = {
            'changingId': {
                'id': 'changingId'
            },
            'oldId': {
                'id': 'oldId',
            }
        };

        const actual = reducers.standardMapper(current, received);
        const expected = {
            ...current,
            ...received.data,
        };

        expect(actual).toEqual(expected);
    });
});

describe('receiveMajicEntitiesReducer', () => {
    let actual;
    let expected;
    let state;
    let action;
    let primaryEntity;
    let namespace;

    it('returns the passed in state if the action type is not RECEIVE_MAJIC_ENTITIES', () => {
        state = {entityMap: {}};
        action = actions.createMajicAction('something-else');
        actual = reducers.receiveMajicEntitiesReducer(state, action);
        expected = state;

        expect(actual).toEqual(expected);
    });

    it('returns the passed in state if the entities are unknown', () => {
        state = {entityMap: {}};
        action = actions.receiveMajicEntitiesAction({
            entities: {data: {id: {id: 'id', type: 'entity'}}},
        });
        primaryEntity = 'other';

        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity);
        expected = state;

        expect(actual).toEqual(expected);
    });

    it('stores the data in to the map; defaults namespaces to an empty array if it does not already exist', () => {
        state = {entitiesMap: {}};
        action = actions.receiveMajicEntitiesAction({
            entities: {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
        }, {});
        primaryEntity = 'entities';

        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity);
        expected = {
            ...state,
            entitiesMap: {
                ...state.entitiesMap,
                ...action.payload.entities.data,
            },
            namespaces: [],
        };

        expect(actual).toEqual(expected);
    });

    it('stores the data in to the map', () => {
        state = {['entitiesMap']: {}, namespaces: []};
        action = actions.receiveMajicEntitiesAction({
            'entities': {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
        }, {});
        primaryEntity = 'entities';

        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity);
        expected = {
            ...state,
            ['entitiesMap']: {
                ...action.payload['entities'].data,
            },
        };

        expect(actual).toEqual(expected);
    });

    it('stores the data in to the map; if an alternate mapping function is provided, it uses that mapper', () => {
        state = {entitiesMap: {}, namespaces: []};
        namespace = 'namespace';
        action = actions.receiveMajicEntitiesAction({
            entities: {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
        });
        primaryEntity = 'entities';

        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity, {mapFunctions: {entities: (current, received) => ({...current, ...received.data, proof: 'proof'})}});
        expected = {
            ...state,
            entitiesMap: {
                ...action.payload.entities.data,
                proof: 'proof',
            },
        };

        expect(actual).toEqual(expected);
    });

    it('stores the data in to the map; if there is a namespace and no preserveEntities flag saves the namespace with no preservedEntities', () => {
        state = {entitiesMap: {}, namespaces: [namespace], [namespace]: {isFetching: true}};
        namespace = 'namespace';
        action = actions.receiveMajicEntitiesAction({
            entities: {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
        }, {namespace});
        primaryEntity = 'entities';

        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity);
        expected = {
            ...state,
            entitiesMap: {
                ...state.entitiesMap,
                ...action.payload.entities.data,
            },
            namespaces: [namespace],
            [namespace]: {
                keys: ['id'],
                preservedEntities: {},
                isFetching: false,
            },
        };
        
        expect(actual).toEqual(expected);
    });
    
    it('stores the data in to the map; if there is a namespace and a preserveEntities flag, saves the namespace with preservedEntities', () => {
        state = {entitiesMap: {}, namespaces: []};
        namespace = 'namespace';
        action = actions.receiveMajicEntitiesAction({
            entities: {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
        }, {namespace, preserveEntities: true});
        primaryEntity = 'entities';
        
        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity);
        expected = {
            ...state,
            entitiesMap: {
                ...state.entitiesMap,
                ...action.payload.entities.data,
            },
            namespaces: [namespace],
            [namespace]: {
                keys: ['id'],
                preservedEntities: action.payload.entities.data,
                isFetching: false,
            },
        };
        
        expect(actual).toEqual(expected);
    });
    
    it('stores the data in to the respective maps when receiving more than one entity type', () => {
        namespace = 'namespace';
        state = {['other-entitiesMap']: {}, namespaces: []};
        action = actions.receiveMajicEntitiesAction({
            'entities': {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
            'other-entities': {data: {id: {id: 'id', type: 'other-entities'}}},
        }, {});
        primaryEntity = 'entities';
        
        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity, {entities: [primaryEntity, 'other-entities']});
        expected = {
            ...state,
            entitiesMap: {
                ...state.entitiesMap,
                ...action.payload.entities.data,
            },
            ['other-entitiesMap']: {
                ...state['other-entitiesMap'],
                ...action.payload['other-entities'].data,
            },
        };
        
        expect(actual).toEqual(expected);
    });
    
    it('stores the data in to the respective maps when receiving more than one entity type, but still only one primary entity type', () => {
        namespace = 'namespace';
        state = {['other-entitiesMap']: {}, entitiesMap: {}, namespaces: []};
        action = actions.receiveMajicEntitiesAction({
            'entities': {data: {id: {id: 'id', type: 'entities'}}},
            'other-entities': {data: {otherId: {id: 'otherId', type: 'other-entities'}}, keys: ['otherId']},
        }, {namespace});
        primaryEntity = 'other-entities';
        
        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity, {entities: [primaryEntity, 'entities']});
        expected = {
            ...state,
            entitiesMap: {
                ...state.entitiesMap,
                ...action.payload.entities.data,
            },
            ['other-entitiesMap']: {
                ...state['other-entitiesMap'],
                ...action.payload['other-entities'].data,
            },
            namespaces: [namespace],
            [namespace]: {
                keys: ['otherId'],
                preservedEntities: {},
                isFetching: false,
            },
        };
        
        expect(actual).toEqual(expected);
    });
    
    it('stores the data in to the respective maps when receiving more than one possible primary entity type, and properly uses the right entity for the namespace', () => {
        namespace = 'namespace';
        state = {entitiesMap: {}, ['other-entitiesMap']: {}, namespaces: []};
        action = actions.receiveMajicEntitiesAction({
            'entities': {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
            'other-entities': {data: {id: {id: 'id', type: 'other-entities'}}},
        }, {namespace, preserveEntities: true});
        primaryEntity = ['entities', 'other-entities'];
        
        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity);
        expected = {
            ...state,
            entitiesMap: {
                ...state.entitiesMap,
                ...action.payload.entities.data,
            },
            ['other-entitiesMap']: {
                ...state['other-entitiesMap'],
                ...action.payload['other-entities'].data,
            },
            namespaces: [namespace],
            [namespace]: {
                keys: ['id'],
                preservedEntities: action.payload.entities.data,
                isFetching: false,
            },
        };
        
        expect(actual).toEqual(expected);
    });
    
    it('stores the data in to the map, and if there is a namespace and an appendKeys flag appends the new keys to the namespace', () => {
        namespace = 'namespace';
        state = {entitiesMap: {}, namespaces: [namespace], [namespace]: {keys: ['hello']}};
        action = actions.receiveMajicEntitiesAction({
            entities: {data: {id: {id: 'id', type: 'entities'}}, keys: ['id']},
        }, {namespace, appendKeys: true});
        primaryEntity = 'entities';
        
        actual = reducers.receiveMajicEntitiesReducer(state, action, primaryEntity);
        expected = {
            ...state,
            entitiesMap: {
                ...state.entitiesMap,
                ...action.payload.entities.data,
            },
            namespaces: [namespace],
            [namespace]: {
                keys: ['hello', 'id'],
                preservedEntities: {},
                isFetching: false,
            },
        };

        expect(actual).toEqual(expected);
    });
});

describe('clearMajicNamespaceReducer', () => {
    it('returns the passed in state if the action type is not RECEIVE_MAJIC_ENTITIES', () => {
        const state = {entityMap: {}};
        const action = actions.createMajicAction('something-else');
        const actual = reducers.clearMajicNamespaceReducer(state, action);
        const expected = state;

        expect(actual).toEqual(expected);
    });

    it('removes namespace from namespaces array and clears the namespace', () => {
        const state = {
            namespaces: ['namespace', 'leftoverNamespace'],
            namespace: {
                keys: ['objectiveId', 'objectiveId2'],
            },
        };

        const action = actions.clearNamespaceAction('namespace');

        const actual = reducers.clearMajicNamespaceReducer(state, action);
        const expected = {
            namespaces: ['leftoverNamespace'],
        };
        expect(actual).toEqual(expected);
    });
});
