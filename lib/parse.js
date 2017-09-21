'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseResponse = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getJsonapi = getJsonapi;
exports.getLinks = getLinks;
exports.getMeta = getMeta;
exports.getAllIncludedTypes = getAllIncludedTypes;
exports.parseResponseFactory = parseResponseFactory;

var _utils = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getJsonapi(response) {
    return (0, _utils.get)(response, 'jsonapi', {});
}

function getLinks(response) {
    return (0, _utils.get)(response, 'links', {});
}

function getMeta(response) {
    return (0, _utils.get)(response, 'meta', {});
}

function getAllIncludedTypes(response) {
    return (0, _utils.stringUniq)((0, _utils.get)(response, 'included', []).map(function (_ref) {
        var type = _ref.type;
        return type;
    }));
}

function parseResponseFactory(identifier) {
    function extractIncludedType(response, type) {
        var includedType = (0, _utils.get)(response, 'included', []).reduce(function (entities, current) {
            var id = current.id,
                currType = current.type,
                _current$attributes = current.attributes,
                attributes = _current$attributes === undefined ? {} : _current$attributes,
                _current$relationship = current.relationships,
                relationships = _current$relationship === undefined ? {} : _current$relationship;

            if (currType === type) {
                entities.data[identifier(current)] = _extends({
                    id: id,
                    type: type,
                    links: getLinks(current)
                }, attributes, relationships, getMeta(current));
            }

            return entities;
        }, { data: {} });

        return (0, _utils.isEmpty)(includedType.data) ? {} : includedType;
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

            entities[type].keys.push(identifier(current));
            entities[type].data[identifier(current)] = _extends({
                id: id,
                type: type,
                links: getLinks(current)
            }, attributes, relationships, getMeta(current));

            entities['__primaryEntities'] = (0, _utils.stringUniq)([].concat(_toConsumableArray(entities['__primaryEntities']), [type]));

            return entities;
        }, { '__primaryEntities': [] });
    }

    return function parseResponse(response) {
        if (!('data' in response) && !('errors' in response) && !('meta' in response)) {
            return {};
        }

        if ('errors' in response) {
            return (0, _utils.pick)(response, 'errors');
        }

        return _extends({
            jsonapi: getJsonapi(response),
            links: getLinks(response),
            meta: getMeta(response)
        }, (0, _utils.mergeMajicObjects)(getData(response), getIncluded(response)));
    };
}

var parseResponse = exports.parseResponse = parseResponseFactory(function (el) {
    return el.id;
});