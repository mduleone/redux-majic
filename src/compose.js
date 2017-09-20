// @flow

import {isEmpty} from 'lodash/lang';
import type {
    JsonApiResponse,
    MajicCompositionSchema,
    MajicDataEntity,
    MajicRelationship,
    MajicIncluded,
    MajicJsonApiRequest,
    MajicJsonApiEntity,
} from './types';

export function composeRequest(data: MajicDataEntity, schema: MajicCompositionSchema): MajicJsonApiRequest {
    validateSchema(schema);

    if (!data.id) {
        throw new Error(`Missing key: 'id'`);
    }

    const {id, type} = data;
    const topLevelMeta = {};
    const attributes = {};
    const relationships = {};
    const meta = {};
    let included = [];

    if (type !== schema.type) {
        throw new Error('Data and schema have a type mismatch');
    }

    if (schema.topLevelMeta) {
        schema.topLevelMeta.forEach(attr => {
            if (!(attr in data)) {
                return;
            }

            topLevelMeta[attr] = data[attr];
        });
    }

    if (schema.attributes) {
        schema.attributes.forEach(attr => {
            if (!(attr in data)) {
                return;
            }

            attributes[attr] = data[attr];
        });
    }

    if (schema.relationships) {
        schema.relationships.forEach(relation => {
            if (!(relation.key in data)) {
                return;
            }

            relationships[relation.key] = buildRelationship(data[relation.key], relation);
        });
    }

    if (schema.included) {
        schema.included.forEach(includedEntity => {
            if (!(includedEntity.key in data)) {
                return;
            }

            const newIncluded = Array.isArray(data[includedEntity.key].data)
                ? data[includedEntity.key].data.map(el => buildIncluded(el, includedEntity))
                : [buildIncluded(data[includedEntity.key].data, includedEntity)];

            included = [...included, ...newIncluded];
        });
    }

    if (schema.meta) {
        schema.meta.forEach(attr => {
            if (!(attr in data)) {
                return;
            }

            meta[attr] = data[attr];
        });
    }

    const responseData = {
        id,
        type,
        ...(isEmpty(attributes) ? {} : {attributes}),
        ...(isEmpty(relationships) ? {} : {relationships}),
        ...(isEmpty(meta) ? {} : {meta}),
    };

    return {
        data: [responseData],
        ...(isEmpty(included) ? {} : {included}),
        ...(isEmpty(topLevelMeta) ? {} : {meta: topLevelMeta}),
    };
}

export function buildIncluded(data: MajicDataEntity, schema: MajicIncluded): MajicJsonApiEntity {
    validateIncludedSchema(schema);

    if (!data.id) {
        throw new Error(`Included ${JSON.stringify(data)} Missing key: 'id'`);
    }

    const {id, type} = data;
    const attributes = {};
    const relationships = {};
    const meta = {};

    if (schema.attributes) {
        schema.attributes.forEach(attr => {
            if (!(attr in data)) {
                return;
            }

            attributes[attr] = data[attr];
        });
    }

    if (schema.relationships) {
        schema.relationships.forEach(relation => {
            if (!(relation.key in data)) {
                return;
            }

            relationships[relation.key] = buildRelationship(data[relation.key], relation);
        });
    }

    if (schema.meta) {
        schema.meta.forEach(attr => {
            if (!(attr in data)) {
                return;
            }

            meta[attr] = data[attr];
        });
    }

    return {
        id,
        type: type || schema.defaultType,
        ...(isEmpty(attributes) ? {} : {attributes}),
        ...(isEmpty(relationships) ? {} : {relationships}),
        ...(isEmpty(meta) ? {} : {meta}),
    };
}

export function buildRelationship(relation: {}, schema: MajicRelationship): {} {
    const meta = {};
    let data;

    if (schema.meta) {
        schema.meta.forEach(metaAttr => {
            if (relation.meta[metaAttr]) {
                meta[metaAttr] = relation.meta[metaAttr];
            }
        });
    }

    if (Array.isArray(relation.data)) {
        data = relation.data.map(rel => {
            return {
                id: rel.id,
                type: rel.type || schema.defaultType
            };
        });
    } else if (relation.data && !isEmpty(relation.data)) {
        data = {
            id: relation.data.id,
            type: relation.data.type || schema.defaultType
        }
    }

    return {
        ...(isEmpty(meta) ? {} : {meta}),
        ...(isEmpty(data) ? {} : {data}),
    };
}

export function validateSchema(schema: MajicCompositionSchema) :boolean {
    if (!schema.type) {
        throw new Error(`Schema ${JSON.stringify(schema)} missing 'type'`);
    }

    schema.topLevelMeta && !validateArray(schema.topLevelMeta, 'topLevelMeta');
    schema.attributes && !validateArray(schema.attributes, 'attributes');
    schema.relationships && !validateArray(schema.relationships, 'relationships');
    schema.meta && !validateArray(schema.meta, 'meta');
    schema.included && !validateArray(schema.included, 'included');

    schema.topLevelMeta && !schema.topLevelMeta.every(el => validateSimpleSchema(el, 'topLevelMeta'));
    schema.attributes && !schema.attributes.every(el => validateSimpleSchema(el, 'attributes'));
    schema.relationships && !schema.relationships.every(validateRelationshipSchema);
    schema.meta && !schema.meta.every(el => validateSimpleSchema(el, 'meta'));
    schema.included && !schema.included.every(validateIncludedSchema);

    return true;
}

export function validateArray(candidate: string, entity: string) {
    if (!Array.isArray(candidate)) {
        throw new Error(`${entity} is not an Array`);
    }

    return true;
}

export function validateSimpleSchema(candidate: string, entity: string) {
    if (typeof candidate !== 'string') {
        throw new Error(`${entity} ${JSON.stringify(candidate)} is not a valid ${entity}`);
    }

    return true;
}

export function validateRelationshipSchema(candidate: MajicRelationship) {
    if (typeof candidate !== 'object') {
        throw new Error(`Relationship ${JSON.stringify(candidate)} is not an object`);
    }

    if (!('key' in candidate)) {
        throw new Error(`Candidate relationship ${JSON.stringify(candidate)} missing key`);
    }

    if (typeof candidate.key !== 'string') {
        throw new Error(`Candidate relationship ${JSON.stringify(candidate)} has invalid key`);
    }

    if (candidate.meta && (!Array.isArray(candidate.meta) || !candidate.meta.every(el => validateSimpleSchema(el, 'relationshipMeta')))) {
        throw new Error(`Candidate relationship ${JSON.stringify(candidate)} has invalid 'meta'`);
    }

    return true;
}

export function validateIncludedSchema(schema: MajicIncluded) :boolean {
    if (typeof schema !== 'object') {
        throw new Error(`included ${JSON.stringify(schema)} is not an object`);
    }

    if (!schema.key) {
        throw new Error(`included ${JSON.stringify(schema)} has invalid 'key'`);
    }

    schema.attributes && !validateArray(schema.attributes, 'attributes');
    schema.relationships && !validateArray(schema.relationships, 'relationships');
    schema.meta && !validateArray(schema.meta, 'meta');

    schema.attributes && !schema.attributes.every(el => validateSimpleSchema(el, 'attributes'));
    schema.relationships && !schema.relationships.every(validateRelationshipSchema);
    schema.meta && !schema.meta.every(el => validateSimpleSchema(el, 'meta'));

    return true;
}
