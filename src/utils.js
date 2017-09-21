// @flow

import type {ParsedMajicObjects} from './types';

export function get(obj: {}, attribute: string, defaultValue: any = {}): any {
    return (attribute in obj) ? obj[attribute] : defaultValue;
}

export function pick(obj: {}, attributes: string|string[]): {[string]: any} {
    attributes = Array.isArray(attributes) ? attributes : [attributes];

    return attributes.reduce((aggregator: {}, attribute: string) => {
        if (attribute in obj) {
            aggregator[attribute] = obj[attribute];
        }

        return aggregator;
    }, {});
}

export function omit(obj: {}, attributes: string|string[]): {[string]: any} {
    attributes = Array.isArray(attributes) ? attributes : [attributes];

    return Object.keys(obj).reduce((aggregator: {}, attribute: string) => {
        if (!attributes.includes(attribute)) {
            aggregator[attribute] = obj[attribute];
        }

        return aggregator;
    }, {});
}

export function stringUniq(arr: string[]): string[] {
    return arr.reduce((agg: string[], curr: string) => (agg.includes(curr) ? [...agg] : [...agg, curr]), []);
}

export function mergeMajicObjects(majic1: ParsedMajicObjects, majic2: ParsedMajicObjects): ParsedMajicObjects {
    const majic1keys: string[] = Object.keys(majic1);
    let majic2keys: string[] = Object.keys(majic2);

    const newMajicObject: ParsedMajicObjects = majic1keys.reduce((majics, key) => {
        if (key === '__primaryEntities') {
            majics.__primaryEntities = stringUniq([...(majic1.__primaryEntities || []), ...(majic2.__primaryEntities || [])]);
            majic2keys = [
                ...majic2keys.slice(0, majic2keys.indexOf(key)),
                ...majic2keys.slice(majic2keys.indexOf(key) + 1),
            ];

            return majics;
        }

        const {data: entity1data, keys: entity1keys}: {data: {}, keys?: string[]} = majic1[key] || {};
        const {data: entity2data, keys: entity2keys}: {data: {}, keys?: string[]} = majic2[key] || {};

        // majic1 copy of the received entity wins
        const data: {} = {
            ...entity2data,
            ...entity1data,
        };
        const keys: string[] = stringUniq([...(entity1keys ? entity1keys : []), ...(entity2keys ? entity2keys : [])]);

        majics[key] = {
            data,
            ...(keys.length > 0 ? {keys} : {})
        };

        if (majic2keys.includes(key)) {
            majic2keys = [
                ...majic2keys.slice(0, majic2keys.indexOf(key)),
                ...majic2keys.slice(majic2keys.indexOf(key) + 1),
            ];
        }

        return majics;
    }, {});

    // Go through all the keys from the second object that weren't processed
    // with the first object, and add them to the return value
    majic2keys.forEach((key: string) => {
        if (key !== '__primaryEntities') {
            newMajicObject[key] = majic2[key];
        }
    });

    return newMajicObject;
}

export function isEmpty(candidate: any): boolean {
    if (candidate === null) {
        return true;
    }

    if (Array.isArray(candidate)) {
        return candidate.length === 0;
    }

    if (typeof candidate === 'object') {
        return Object.keys(candidate).length === 0;
    }

    return !candidate;
}
