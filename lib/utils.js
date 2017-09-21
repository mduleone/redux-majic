'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.get = get;
exports.pick = pick;
exports.omit = omit;
exports.stringUniq = stringUniq;
exports.mergeMajicObjects = mergeMajicObjects;
exports.isEmpty = isEmpty;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function get(obj, attribute) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return attribute in obj ? obj[attribute] : defaultValue;
}

function pick(obj, attributes) {
    if (!Array.isArray(attributes)) {
        attributes = [attributes];
    }

    return attributes.reduce(function (aggregator, attribute) {
        if (attribute in obj) {
            aggregator[attribute] = obj[attribute];
        }

        return aggregator;
    }, {});
}

function omit(obj, attributes) {
    if (!Array.isArray(attributes)) {
        attributes = [attributes];
    }

    return Object.keys(obj).reduce(function (aggregator, attribute) {
        if (!attributes.includes(attribute)) {
            aggregator[attribute] = obj[attribute];
        }

        return aggregator;
    }, {});
}

function stringUniq(arr) {
    return arr.reduce(function (agg, curr) {
        return agg.includes(curr) ? [].concat(_toConsumableArray(agg)) : [].concat(_toConsumableArray(agg), [curr]);
    }, []);
}

function mergeMajicObjects(majic1, majic2) {
    var majic1keys = Object.keys(majic1);
    var majic2keys = Object.keys(majic2);

    var newMajicObject = majic1keys.reduce(function (majics, key) {
        if (key === '__primaryEntities') {
            majics.__primaryEntities = stringUniq([].concat(_toConsumableArray(majic1.__primaryEntities || []), _toConsumableArray(majic2.__primaryEntities || [])));
            majic2keys = [].concat(_toConsumableArray(majic2keys.slice(0, majic2keys.indexOf(key))), _toConsumableArray(majic2keys.slice(majic2keys.indexOf(key) + 1)));

            return majics;
        }

        var _ref = majic1[key] || {},
            entity1data = _ref.data,
            entity1keys = _ref.keys;

        var _ref2 = majic2[key] || {},
            entity2data = _ref2.data,
            entity2keys = _ref2.keys;
        // majic1 copy of the received entity wins


        var data = _extends({}, entity2data, entity1data);
        var keys = stringUniq([].concat(_toConsumableArray(entity1keys ? entity1keys : []), _toConsumableArray(entity2keys ? entity2keys : [])));

        majics[key] = _extends({
            data: data
        }, keys.length > 0 ? { keys: keys } : {});

        if (majic2keys.includes(key)) {
            majic2keys = [].concat(_toConsumableArray(majic2keys.slice(0, majic2keys.indexOf(key))), _toConsumableArray(majic2keys.slice(majic2keys.indexOf(key) + 1)));
        }

        return majics;
    }, {});

    // Go through all the keys from the second object that weren't processed
    // with the first object, and add them to the return value
    majic2keys.forEach(function (key) {
        return newMajicObject[key] = majic2[key];
    });

    return newMajicObject;
}

function isEmpty(candidate) {
    if (candidate === null) {
        return true;
    }

    if (Array.isArray(candidate)) {
        return candidate.length === 0;
    }

    if ((typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) === 'object') {
        return Object.keys(candidate).length === 0;
    }

    return !candidate;
}