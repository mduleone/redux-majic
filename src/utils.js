// @flow

export function get(obj: {}, attribute: string, defaultValue: any = {}): any {
    return (attribute in obj) ? obj[attribute] : defaultValue;
}

export function pick(obj: {}, attributes: string|string[]): {} {
    if (!Array.isArray(attributes)) {
        attributes = [attributes];
    }

    return attributes.reduce((aggregator, attribute) => {
        if (attribute in obj) {
            aggregator[attribute] = obj[attribute];
        }

        return aggregator;
    }, {});
}

export function omit(obj: {}, attributes: string|string[]): {} {
    if (!Array.isArray(attributes)) {
        attributes = [attributes];
    }

    return Object.keys(obj).reduce((aggregator, attribute) => {
        if (!attributes.includes(attribute)) {
            aggregator[attribute] = obj[attribute];
        }

        return aggregator;
    }, {});
}

export function stringUniq(arr: string[]): string[] {
    return arr.reduce((agg, curr) => (agg.includes(curr) ? [...agg] : [...agg, curr]), []);
}

export function mergeMajicObjects(majic1: {}, majic2: {}): {} {
    const majic1keys = Object.keys(majic1);
    let majic2keys = Object.keys(majic2);

    const newMajicObject = majic1keys.reduce((majics, key) => {
        const {data: entity1data, keys: entity1keys} = majic1[key] || {};
        const {data: entity2data, keys: entity2keys} = majic2[key] || {};
        // majic1 copy of the received entity wins
        const data = {
            ...entity2data,
            ...entity1data,
        };
        const keys = stringUniq([...(entity1keys ? entity1keys : []), ...(entity2keys ? entity2keys : [])]);

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
    majic2keys.forEach(key => newMajicObject[key] = majic2[key]);

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
