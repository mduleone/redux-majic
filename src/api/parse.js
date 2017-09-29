// @flow

import {get, pick, stringUniq, mergeMajicObjects, isEmpty} from '../utils';
import type {JsonApiResponse, JsonApiError, JsonApiEntity, ParsedMajicEntity, MajicEntities} from '../types';

export function getJsonapi(response: JsonApiResponse): {[string]: string} {
    return get(response, 'jsonapi', {});
}

export function getLinks(response: {links?: {[string]: string}}): {[string]: string} {
    return get(response, 'links', {});
}

export function getMeta(response: {meta?: {[string]: string}}): {[string]: string} {
    return get(response, 'meta', {});
}

export function getAllIncludedTypes(response: JsonApiResponse): string[] {
    return stringUniq(get(response, 'included', []).map(({type}: {type: string}) => type));
}

export function parseResponseFactory(identifier: (response: JsonApiEntity) => string): (response: JsonApiResponse) => ParsedMajicEntity|{errors: JsonApiError[]} {
    function extractIncludedType(response: JsonApiResponse, type: string): {} {
        const includedType = (response.included || []).reduce(
            (entities: {data: {[string]: {}}}, current: JsonApiEntity): {data: {[string]: {}}} => {
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

    function getIncluded(response: JsonApiResponse): {__primaryEntities?: string[]} {
        return getAllIncludedTypes(response)
            .reduce((types, curr) => {
                return ({...types, [curr]: extractIncludedType(response, curr)});
            }, {__primaryEntities: []});
    }

    function getData(response: JsonApiResponse): {__primaryEntities?: string[]} {
        if (!response.data) {
            return {__primaryEntities: []};
        }

        const dataArray: JsonApiEntity[] = Array.isArray(response.data) ? response.data : [response.data];

        return dataArray.reduce(
            (entities: {__primaryEntities?: string[], [string]: MajicEntities}, current: JsonApiEntity) => {
                const {id, type, attributes = {}, relationships = {}} = current;
                if (!(type in entities)) {
                    entities[type] = {data: {}, keys: []};
                }

                entities[type].keys = stringUniq([...(entities[type].keys || []), identifier(current)]);
                entities[type].data[identifier(current)] = {
                    id,
                    type,
                    links: getLinks(current),
                    ...attributes,
                    ...relationships,
                    ...getMeta(current),
                };

                entities.__primaryEntities = stringUniq([
                    ...(entities.__primaryEntities || []),
                    type,
                ]);

                return entities;
            },
            {'__primaryEntities': []}
        );
    }

    return function parseResponse(response: JsonApiResponse): ParsedMajicEntity|{errors: JsonApiError[]} {
        if (!('data' in response) && !('errors' in response) && !('meta' in response)) {
            return {};
        }

        if ('errors' in response) {
            const error: {errors: JsonApiError[]} = pick(response, 'errors');
            return error;
        }

        const jsonapi: {} = getJsonapi(response);
        const links: {} = getLinks(response);
        const meta: {} = getMeta(response);
        return {
            ...(isEmpty(jsonapi) ? {} : {jsonapi}),
            ...(isEmpty(links) ? {} : {links}),
            ...(isEmpty(meta) ? {} : {meta}),
            ...mergeMajicObjects(getData(response), getIncluded(response)),
        };
    };
}

export const parseResponse = parseResponseFactory(el => el.id);
