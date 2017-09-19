// @flow

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
