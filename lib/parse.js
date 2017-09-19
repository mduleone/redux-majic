'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getJsonapi = getJsonapi;
exports.getLinks = getLinks;
exports.getMeta = getMeta;
exports.getAllIncludedTypes = getAllIncludedTypes;
exports.extractIncludedType = extractIncludedType;
exports.getIncluded = getIncluded;
exports.getData = getData;
exports.parseResponse = parseResponse;
exports.parseResponseFactory = parseResponseFactory;

var _object = require('lodash/object');

var _lang = require('lodash/lang');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getJsonapi(response) {
    return (0, _object.get)(response, 'jsonapi', {});
}

function getLinks(response) {
    return (0, _object.get)(response, 'links', {});
}

function getMeta(response) {
    return (0, _object.get)(response, 'meta', {});
}

function getAllIncludedTypes(response) {
    return (0, _object.get)(response, 'included', []).reduce(function (types, curr) {
        return types.includes(curr.type) ? types : types.concat(curr.type);
    }, []);
}

function extractIncludedType(response, type) {
    var includedType = (0, _object.get)(response, 'included', []).reduce(function (entities, current) {
        var id = current.id,
            currType = current.type,
            _current$attributes = current.attributes,
            attributes = _current$attributes === undefined ? {} : _current$attributes,
            _current$relationship = current.relationships,
            relationships = _current$relationship === undefined ? {} : _current$relationship;

        if (currType === type) {
            entities.data[id] = _extends({
                id: id,
                type: type,
                links: getLinks(current)
            }, attributes, relationships, getMeta(current));
        }

        return entities;
    }, { data: {} });

    return (0, _lang.isEmpty)(includedType.data) ? {} : includedType;
}

function getIncluded(response) {
    return getAllIncludedTypes(response).reduce(function (types, curr) {
        return _extends({}, types, _defineProperty({}, curr, extractIncludedType(response, curr)));
    }, {});
}

function getData(response) {
    if (!response.data) {
        return {};
    }

    var dataArray = Array.isArray(response.data) ? response.data : [response.data];

    return dataArray.reduce(function (entities, current) {
        var id = current.id,
            type = current.type,
            _current$attributes2 = current.attributes,
            attributes = _current$attributes2 === undefined ? {} : _current$attributes2,
            _current$relationship2 = current.relationships,
            relationships = _current$relationship2 === undefined ? {} : _current$relationship2;

        if (!(type in entities)) {
            entities[type] = { data: {}, keys: [] };
        }

        entities[type].keys.push(id);
        entities[type].data[id] = _extends({
            id: id,
            type: type,
            links: getLinks(current)
        }, attributes, relationships, getMeta(current));

        return entities;
    }, {});
}

function parseResponse(response) {
    if (!('data' in response) && !('errors' in response) && !('meta' in response)) {
        return {};
    }

    if ('errors' in response) {
        return (0, _object.pick)(response, 'errors');
    }

    return _extends({
        jsonapi: getJsonapi(response),
        links: getLinks(response),
        meta: getMeta(response)
    }, (0, _object.merge)(getData(response), getIncluded(response)));
}

function parseResponseFactory(idFunc) {
    function getAllIncludedTypes(response) {
        return (0, _object.get)(response, 'included', []).reduce(function (types, curr) {
            return types.includes(curr.type) ? types : types.concat(curr.type);
        }, []);
    }

    function extractIncludedType(response, type) {
        var includedType = (0, _object.get)(response, 'included', []).reduce(function (entities, current) {
            var id = current.id,
                currType = current.type,
                _current$attributes3 = current.attributes,
                attributes = _current$attributes3 === undefined ? {} : _current$attributes3,
                _current$relationship3 = current.relationships,
                relationships = _current$relationship3 === undefined ? {} : _current$relationship3;

            if (currType === type) {
                entities.data[idFunc(current)] = _extends({
                    id: id,
                    type: type,
                    links: getLinks(current)
                }, attributes, relationships, getMeta(current));
            }

            return entities;
        }, { data: {} });

        return (0, _lang.isEmpty)(includedType.data) ? {} : includedType;
    }

    function getIncluded(response) {
        return getAllIncludedTypes(response).reduce(function (types, curr) {
            return _extends({}, types, _defineProperty({}, curr, extractIncludedType(response, curr)));
        }, {});
    }

    function getData(response) {
        if (!('data' in response)) {
            return {};
        }

        if (!Array.isArray(response.data)) {
            response.data = [response.data];
        }

        return response.data.reduce(function (entities, current) {
            var id = current.id,
                type = current.type,
                _current$attributes4 = current.attributes,
                attributes = _current$attributes4 === undefined ? {} : _current$attributes4,
                _current$relationship4 = current.relationships,
                relationships = _current$relationship4 === undefined ? {} : _current$relationship4;

            if (!(type in entities)) {
                entities[type] = { data: {}, keys: [] };
            }

            entities[type].keys.push(idFunc(current));
            entities[type].data[idFunc(current)] = _extends({
                id: id,
                type: type,
                links: getLinks(current)
            }, attributes, relationships, getMeta(current));

            return entities;
        }, {});
    }

    return function (response) {
        if (!('data' in response) && !('errors' in response) && !('meta' in response)) {
            return {};
        }

        if ('errors' in response) {
            return (0, _object.pick)(response, 'errors');
        }

        return _extends({
            jsonapi: getJsonapi(response),
            links: getLinks(response),
            meta: getMeta(response)
        }, (0, _object.merge)(getData(response), getIncluded(response)));
    };
}