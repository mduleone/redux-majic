// @flow

import {get, pick, stringUniq, mergeMajicObjects, isEmpty} from './utils';
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
    return stringUniq(get(response, 'included', []).map(({type}) => type));
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

    function getIncluded(response: JsonApiResponse): {__primaryEntities: ?string[]} {
        return getAllIncludedTypes(response)
            .reduce((types, curr) => {
                return ({...types, [curr]: extractIncludedType(response, curr)});
            }, {__primaryEntities: []});
    }

    function getData(response: JsonApiResponse): {__primaryEntities: ?string[]} {
        if (!response.data) {
            return {__primaryEntities: []};
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

                entities['__primaryEntities'] = stringUniq([
                    ...entities['__primaryEntities'],
                    type,
                ]);

                return entities;
            },
            {'__primaryEntities': []}
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
            ...mergeMajicObjects(getData(response), getIncluded(response)),
        };
    };
}

export const parseResponse = parseResponseFactory(el => el.id);
