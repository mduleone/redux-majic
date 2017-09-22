// @flow

// JsonAPI Entities
export type JsonApiError = {
    id?: string,
    code?: string,
    status?: string,
    source?: {},
    title?: string,
    detail?: string,
};

export type JsonApiEntity = {
    id: string,
    type: string,
    attributes?: {},
    relationships?: {},
    meta?: {},
    links?: {},
};

export type JsonApiResponse = {
    data?: JsonApiEntity|JsonApiEntity[],
    meta?: {},
    errors?: JsonApiError[],
    jsonapi?: {},
    links?: {},
    included?: JsonApiEntity[],
};

export type JsonApiRequestRelationship = {
    meta?: {[string]: string},
    links?: {[string]: string},
    data?: JsonApiRelationshipData|JsonApiRelationshipData[],
};

export type JsonApiRelationshipData = {
    type: string,
    id: string,
}

// Internal types
export type MajicRelationship = {
    key: string,
    defaultType: string,
    meta?: string[],
};

export type MajicIncluded = {
    key: string,
    type: string,
    defaultType?: string,
    attributes?: string[],
    relationships?: MajicRelationship[],
    meta?: string[],
};

export type MajicCompositionSchema = {
    type: string,
    topLevelMeta?: string[],
    attributes?: string[],
    relationships?: MajicRelationship[],
    meta?: string[],
    included?: MajicIncluded[],
};

export type MajicDataEntity = {
    id: string,
    type: string,
    [string]: string|JsonApiRequestRelationship,
};

export type MajicJsonApiRequest = {
    data: MajicJsonApiEntity[],
    meta?: {},
    included?: MajicJsonApiEntity[],
};

export type MajicJsonApiEntity = {
    id: string,
    type: string,
    attributes?: {},
    relationships?: {},
    meta?: {},
};

export type ParsedMajicEntity = {
    meta?: {},
    jsonapi?: {},
    links?: {},
    __primaryEntities?: string[],
    [string]: MajicEntities,
};

export type ParsedMajicObjects = {
    __primaryEntities?: string[],
    [string]: MajicEntities,
};

export type MajicEntities = {
    data: {},
    keys?: string[],
};