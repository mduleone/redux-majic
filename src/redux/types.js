export type ReceiveMajicConfigObject = {
    mapFunctions: {
        [string]: (existingMap: {}, receivedEntities: {}) => {}
    },
    entities?: string[],
};

export type ReceiveMajicMeta = {
    namespace?: string, 
    preserveEntities?: boolean, 
    appendKeys?: boolean,
};

export type MajicMapper = (existingMap: {[string]: {}}, receivedEntities: {data: {[string]: {}}}) => {[string]: {}};

export type MajicAction = {
    type: string,
    payload: {},
    meta: {},
    callbacks: {
        [string]: ?Function,
    }
};
