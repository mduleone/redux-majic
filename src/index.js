// @flow

export {parseResponse, parseResponseFactory} from './api/parse';
export {composeRequest, validateSchema} from './api/compose';

export {createMajicAction, receiveMajicEntitiesAction, clearNamespaceAction} from './redux/actions';
export {requestMajicNamespace, receiveMajicEntitiesReducer, clearMajicNamespaceReducer} from './redux/reducers';
export {selectEntityById, selectEntityByNamespaceAndId, selectEntitiesByNamespace, selectNamespaceIsFetching} from './redux/selectors';
export {RECEIVE_MAJIC_ENTITIES, CLEAR_NAMESPACE} from './redux/constants';
