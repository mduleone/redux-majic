// @flow

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
    errors?: Array<{}>,
    jsonapi?: {},
    links?: {},
    included?: Array<{}>,
};
