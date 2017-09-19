// @flow

import {get, pick, merge} from 'lodash/object';
import {uniq} from 'lodash/array';
import {isEmpty} from 'lodash/lang';
import type {JsonApiResponse, JsonApiError} from './types';

export function getJsonapi(response: JsonApiResponse): {} {
    return get(response, 'jsonapi', {});
}

export function getLinks(response: {links: ?{}}): {} {
    return get(response, 'links', {});
}

export function getMeta(response: {meta: ?{}}): {} {
    return get(response, 'meta', {});
}

export function getAllIncludedTypes(response: JsonApiResponse): Array<string> {
    return uniq(get(response, 'included', []).map(({type}) => type));
}

export function extractIncludedType(response: JsonApiResponse, type: string): {} {
    const includedType = get(response, 'included', []).reduce(
        (entities, current) => {
            const {id, type: currType, attributes = {}, relationships = {}} = current;
            if (currType === type) {
                entities.data[id] = {
                    id,
                    type,
                    links: getLinks(current),
                    ...attributes,
                    ...relationships,
                    ...getMeta(current),
                };
            }

            return entities;
        },
        {data: {}}
    );

    return isEmpty(includedType.data) ? {} : includedType;
}

export function getIncluded(response: JsonApiResponse): {} {
    return getAllIncludedTypes(response)
        .reduce((types, curr) => {
            return ({...types, [curr]: extractIncludedType(response, curr)});
        }, {});
}

export function getData(response: JsonApiResponse): {} {
    if (!(response.data)) {
        return {};
    }

    const dataArray = Array.isArray(response.data) ? response.data : [response.data];

    return dataArray.reduce(
        (entities, current) => {
            const {id, type, attributes = {}, relationships = {}} = current;
            if (!(type in entities)) {
                entities[type] = {data: {}, keys: []};
            }

            entities[type].keys.push(id);
            entities[type].data[id] = {
                id,
                type,
                links: getLinks(current),
                ...attributes,
                ...relationships,
                ...getMeta(current),
            };

            return entities;
        },
        {}
    );
}

export function parseResponse(response: JsonApiResponse): {}|{errors: JsonApiError[]} {
    if (!('data' in response) && !('errors' in response) && !('meta' in response)) {
        return {};
    }

    if ('errors' in response) {
        return pick(response, 'errors');
    }

    return {
        jsonapi: getJsonapi(response),
        links: getLinks(response),
        meta: getMeta(response),
        ...merge(getData(response), getIncluded(response)),
    };
}

export function parseResponseFactory(identifier: Function): Function {
    function extractIncludedType(response: JsonApiResponse, type: string): {} {
        const includedType = get(response, 'included', []).reduce(
            (entities, current) => {
                const {id, type: currType, attributes = {}, relationships = {}} = current;
                if (currType === type) {
                    entities.data[identifier(current)] = {
                        id,
                        type,
                        links: getLinks(current),
                        ...attributes,
                        ...relationships,
                        ...getMeta(current),
                    };
                }

                return entities;
            },
            {data: {}}
        );

        return isEmpty(includedType.data) ? {} : includedType;
    }

    function getIncluded(response: JsonApiResponse): {} {
        return getAllIncludedTypes(response)
            .reduce((types, curr) => {
                return ({...types, [curr]: extractIncludedType(response, curr)});
            }, {});
    }

    function getData(response: JsonApiResponse): {} {
        if (!response.data) {
            return {};
        }

        const dataArray = Array.isArray(response.data) ? response.data : [response.data];

        return dataArray.reduce(
            (entities, current) => {
                const {id, type, attributes = {}, relationships = {}} = current;
                if (!(type in entities)) {
                    entities[type] = {data: {}, keys: []};
                }

                entities[type].keys.push(identifier(current));
                entities[type].data[identifier(current)] = {
                    id,
                    type,
                    links: getLinks(current),
                    ...attributes,
                    ...relationships,
                    ...getMeta(current),
                };

                return entities;
            },
            {}
        );
    }

    return function parseResponse(response: JsonApiResponse): {}|{errors: JsonApiError[]} {
        if (!('data' in response) && !('errors' in response) && !('meta' in response)) {
            return {};
        }

        if ('errors' in response) {
            return pick(response, 'errors');
        }

        return {
            jsonapi: getJsonapi(response),
            links: getLinks(response),
            meta: getMeta(response),
            ...merge(getData(response), getIncluded(response)),
        };
    };
}
