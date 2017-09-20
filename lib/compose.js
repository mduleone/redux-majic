'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.composeRequest = composeRequest;
exports.buildIncluded = buildIncluded;
exports.buildRelationship = buildRelationship;
exports.validateSchema = validateSchema;
exports.validateArray = validateArray;
exports.validateSimpleSchema = validateSimpleSchema;
exports.validateRelationshipSchema = validateRelationshipSchema;
exports.validateIncludedSchema = validateIncludedSchema;

var _lang = require('lodash/lang');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function composeRequest(data, schema) {
    validateSchema(schema);

    if (!data.id) {
        throw new Error('Missing key: \'id\'');
    }

    var id = data.id,
        type = data.type;

    var topLevelMeta = {};
    var attributes = {};
    var relationships = {};
    var meta = {};
    var included = [];

    if (type !== schema.type) {
        throw new Error('Data and schema have a type mismatch');
    }

    if (schema.topLevelMeta) {
        schema.topLevelMeta.forEach(function (attr) {
            if (!(attr in data)) {
                return;
            }

            topLevelMeta[attr] = data[attr];
        });
    }

    if (schema.attributes) {
        schema.attributes.forEach(function (attr) {
            if (!(attr in data)) {
                return;
            }

            attributes[attr] = data[attr];
        });
    }

    if (schema.relationships) {
        schema.relationships.forEach(function (relation) {
            if (!(relation.key in data)) {
                return;
            }

            relationships[relation.key] = buildRelationship(data[relation.key], relation);
        });
    }

    if (schema.included) {
        schema.included.forEach(function (includedEntity) {
            if (!(includedEntity.key in data)) {
                return;
            }

            var newIncluded = Array.isArray(data[includedEntity.key].data) ? data[includedEntity.key].data.map(function (el) {
                return buildIncluded(el, includedEntity);
            }) : [buildIncluded(data[includedEntity.key].data, includedEntity)];

            included = [].concat(_toConsumableArray(included), _toConsumableArray(newIncluded));
        });
    }

    if (schema.meta) {
        schema.meta.forEach(function (attr) {
            if (!(attr in data)) {
                return;
            }

            meta[attr] = data[attr];
        });
    }

    var responseData = _extends({
        id: id,
        type: type
    }, (0, _lang.isEmpty)(attributes) ? {} : { attributes: attributes }, (0, _lang.isEmpty)(relationships) ? {} : { relationships: relationships }, (0, _lang.isEmpty)(meta) ? {} : { meta: meta });

    return _extends({
        data: [responseData]
    }, (0, _lang.isEmpty)(included) ? {} : { included: included }, (0, _lang.isEmpty)(topLevelMeta) ? {} : { meta: topLevelMeta });
}

function buildIncluded(data, schema) {
    validateIncludedSchema(schema);

    if (!data.id) {
        throw new Error('Included ' + JSON.stringify(data) + ' Missing key: \'id\'');
    }

    var id = data.id,
        type = data.type;

    var attributes = {};
    var relationships = {};
    var meta = {};

    if (schema.attributes) {
        schema.attributes.forEach(function (attr) {
            if (!(attr in data)) {
                return;
            }

            attributes[attr] = data[attr];
        });
    }

    if (schema.relationships) {
        schema.relationships.forEach(function (relation) {
            if (!(relation.key in data)) {
                return;
            }

            relationships[relation.key] = buildRelationship(data[relation.key], relation);
        });
    }

    if (schema.meta) {
        schema.meta.forEach(function (attr) {
            if (!(attr in data)) {
                return;
            }

            meta[attr] = data[attr];
        });
    }

    return _extends({
        id: id,
        type: type || schema.defaultType
    }, (0, _lang.isEmpty)(attributes) ? {} : { attributes: attributes }, (0, _lang.isEmpty)(relationships) ? {} : { relationships: relationships }, (0, _lang.isEmpty)(meta) ? {} : { meta: meta });
}

function buildRelationship(relation, schema) {
    var meta = {};
    var data = void 0;

    if (schema.meta) {
        schema.meta.forEach(function (metaAttr) {
            if (relation.meta[metaAttr]) {
                meta[metaAttr] = relation.meta[metaAttr];
            }
        });
    }

    if (Array.isArray(relation.data)) {
        data = relation.data.map(function (rel) {
            return {
                id: rel.id,
                type: rel.type || schema.defaultType
            };
        });
    } else if (relation.data && !(0, _lang.isEmpty)(relation.data)) {
        data = {
            id: relation.data.id,
            type: relation.data.type || schema.defaultType
        };
    }

    return _extends({}, (0, _lang.isEmpty)(meta) ? {} : { meta: meta }, (0, _lang.isEmpty)(data) ? {} : { data: data });
}

function validateSchema(schema) {
    if (!schema.type) {
        throw new Error('Schema ' + JSON.stringify(schema) + ' missing \'type\'');
    }

    schema.topLevelMeta && !validateArray(schema.topLevelMeta, 'topLevelMeta');
    schema.attributes && !validateArray(schema.attributes, 'attributes');
    schema.relationships && !validateArray(schema.relationships, 'relationships');
    schema.meta && !validateArray(schema.meta, 'meta');
    schema.included && !validateArray(schema.included, 'included');

    schema.topLevelMeta && !schema.topLevelMeta.every(function (el) {
        return validateSimpleSchema(el, 'topLevelMeta');
    });
    schema.attributes && !schema.attributes.every(function (el) {
        return validateSimpleSchema(el, 'attributes');
    });
    schema.relationships && !schema.relationships.every(validateRelationshipSchema);
    schema.meta && !schema.meta.every(function (el) {
        return validateSimpleSchema(el, 'meta');
    });
    schema.included && !schema.included.every(validateIncludedSchema);

    return true;
}

function validateArray(candidate, entity) {
    if (!Array.isArray(candidate)) {
        throw new Error(entity + ' is not an Array');
    }

    return true;
}

function validateSimpleSchema(candidate, entity) {
    if (typeof candidate !== 'string') {
        throw new Error(entity + ' ' + JSON.stringify(candidate) + ' is not a valid ' + entity);
    }

    return true;
}

function validateRelationshipSchema(candidate) {
    if ((typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) !== 'object') {
        throw new Error('Relationship ' + JSON.stringify(candidate) + ' is not an object');
    }

    if (!('key' in candidate)) {
        throw new Error('Candidate relationship ' + JSON.stringify(candidate) + ' missing key');
    }

    if (typeof candidate.key !== 'string') {
        throw new Error('Candidate relationship ' + JSON.stringify(candidate) + ' has invalid key');
    }

    if (candidate.meta && (!Array.isArray(candidate.meta) || !candidate.meta.every(function (el) {
        return validateSimpleSchema(el, 'relationshipMeta');
    }))) {
        throw new Error('Candidate relationship ' + JSON.stringify(candidate) + ' has invalid \'meta\'');
    }

    return true;
}

function validateIncludedSchema(schema) {
    if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) !== 'object') {
        throw new Error('included ' + JSON.stringify(schema) + ' is not an object');
    }

    if (!schema.key) {
        throw new Error('included ' + JSON.stringify(schema) + ' has invalid \'key\'');
    }

    schema.attributes && !validateArray(schema.attributes, 'attributes');
    schema.relationships && !validateArray(schema.relationships, 'relationships');
    schema.meta && !validateArray(schema.meta, 'meta');

    schema.attributes && !schema.attributes.every(function (el) {
        return validateSimpleSchema(el, 'attributes');
    });
    schema.relationships && !schema.relationships.every(validateRelationshipSchema);
    schema.meta && !schema.meta.every(function (el) {
        return validateSimpleSchema(el, 'meta');
    });

    return true;
}