// @flow

// JsonAPI Entities
export type JsonApiError = {
    id: ?string,
    code: ?string,
    status: ?string,
    source: ?{},
    title: ?string,
    detail: ?string,
};

export type JsonApiEntity = {
    id: string,
    type: string,
    attributes: ?{},
    relationships: ?{},
    meta: ?{},
    links: ?{},
};

export type JsonApiResponse = {
    data: ?JsonApiEntity|JsonApiEntity[],
    meta: ?{},
    errors: ?JsonApiError[],
    jsonapi: ?{},
    links: ?{},
    included: ?JsonApiEntity[],
};

// Internal types
export type MajicRelationship = {
    key: string,
    type: string,
};

export type MajicIncluded = {
    key: ?string,
    type: string,
    attributes: ?string[],
    relationships: ?MajicRelationship[],
    meta: ?string[],
};

export type MajicCompositionSchema = {
    type: string,
    attributes: ?string[],
    relationships: ?MajicRelationship[],
    meta: ?string[],
    included: ?MajicIncluded[],
};

export type MajicDataEntity = {
    id: string,
};
