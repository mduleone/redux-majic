import * as actions from '../../src/redux/actions';
import * as types from '../../src/redux/constants';
import {parsedArticle1} from '../states';

describe('createMajicAction', () => {
    let type;
    let payload;
    let meta;
    let callbacks;
    let actual;
    let expected;

    beforeAll(() => {
        type = 'type';
        payload = {};
        meta = {};
        callbacks = {};
    });

    it('returns an object passing through the received `type`, `payload`, and `meta`, and ensures callbacks has a null default', () => {
        expected = {
            type,
            payload,
            meta,
            callbacks: {
                default: null,
            },
        };

        actual = actions.createMajicAction(type, payload, meta);

        expect(actual).toEqual(expected);
    });

    it('returns the right shape of action (with proper defaults) if nothing other than type is passed in', () => {
        expected = {
            type,
            payload: {},
            meta: {},
            callbacks: {
                default: null,
            },
        };

        actual = actions.createMajicAction(type);

        expect(actual).toEqual(expected);
    });
});

describe('receiveMajicEntitiesAction', () => {
    it('returns a Majic Action with type `RECEIVE_MAJIC_ENTITIES` and passes through the payload and meta', () => {
        const payload = parsedArticle1;
        const meta = {namespace: 'articles'};
        const actual = actions.receiveMajicEntitiesAction(payload, meta);
        const expected = actions.createMajicAction(types.RECEIVE_MAJIC_ENTITIES, payload, meta);
        
        expect(actual).toEqual(expected);
    });
});

describe('clearNamespaceAction', () => {
    it('returns a Majic Action with type `RECEIVE_MAJIC_ENTITIES` and passes through the payload and meta', () => {
        const namespace = 'articles';
        const actual = actions.clearNamespaceAction(namespace);
        const expected = actions.createMajicAction(types.CLEAR_NAMESPACE, {}, {namespace});

        expect(actual).toEqual(expected);
    });
});
