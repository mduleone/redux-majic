import {omit} from 'lodash/object';
import * as parse from '../src/parse';
import * as states from './states';

describe('getJsonapi', () => {
    let actual;
    let expected;
    let response;
    it('returns the jsonapi object on the response if it exists', () => {
        response = {...states.jsonApiArticle1};
        expected = response.jsonapi;
        actual = parse.getJsonapi(response);
        expect(actual).toEqual(expected);
    });

    it('returns an empty object if jsonapi is missing', () => {
        response = omit(states.jsonApiArticle1, 'jsonapi');
        expected = {};
        actual = parse.getJsonapi(response);
        expect(actual).toEqual(expected);
    });
});

describe('getLinks', () => {
    let actual;
    let expected;
    let response;
    it('returns the links object on the response if it exists', () => {
        response = {...states.jsonApiArticle1};
        expected = response.links;
        actual = parse.getLinks(response);
        expect(actual).toEqual(expected);
    });

    it('returns an empty object if links is missing', () => {
        response = omit(states.jsonApiArticle1, 'links');
        expected = {};
        actual = parse.getLinks(response);
        expect(actual).toEqual(expected);
    });
});

describe('getMeta', () => {
    let actual;
    let expected;
    let response;
    it('returns the meta object on the response if it exists', () => {
        response = {...states.jsonApiArticle1};
        expected = response.meta;
        actual = parse.getMeta(response);
        expect(actual).toEqual(expected);
    });

    it('returns an empty object if meta is missing', () => {
        response = omit(states.jsonApiArticle1, 'meta');
        expected = {};
        actual = parse.getMeta(response);
        expect(actual).toEqual(expected);
    });
});

describe('getAllIncludedTypes', () => {
    it('returns an array of strings of the type keys from the entities in the included array', () => {
        const response = {...states.jsonApiArticle1};
        const expected = ['people', 'comments'];
        const actual = parse.getAllIncludedTypes(response);

        expect(actual).toEqual(expected);
    });

    it('returns an empty array if the included array is missing', () => {
        const response = omit(states.jsonApiArticle1, 'included');
        const expected = [];
        const actual = parse.getAllIncludedTypes(response);

        expect(actual).toEqual(expected);
    });
});

describe('extractIncludedType', () => {
    it('extracts all entities from the included array of the requested type', () => {
        const response = {...states.jsonApiArticle1};
        const expected = states.includedArticle1.people;
        const actual = parse.extractIncludedType(response, 'people');

        expect(actual).toEqual(expected);
    });

    it('returns an empty object if the entity type is not in the included array', () => {
        const response = states.jsonApiArticle1;
        const expected = {};
        const actual = parse.extractIncludedType(response, 'articles');

        expect(actual).toEqual(expected);
    });
});

describe('getIncluded', () => {
    it('parses the included array in to an object with the types received and received entites', () => {
        const response = {...states.jsonApiArticle1};
        const expected = states.includedArticle1;
        const actual = parse.getIncluded(response);

        expect(actual).toEqual(expected);
    });

    it('returns an empty object if the included array does not exist', () => {
        const response = omit(states.jsonApiArticle1, 'included');
        const expected = {};
        const actual = parse.getIncluded(response);

        expect(actual).toEqual(expected); 
    });

    it('returns an empty object if the included array is empty', () => {
        const response = {...states.jsonApiArticle1, 'included': []};
        const expected = {};
        const actual = parse.getIncluded(response);

        expect(actual).toEqual(expected); 
    });
});

describe('getData', () => {
    let response;
    let expected;
    let actual;
    it('returns an empty object if the data key is missing', () => {
        response = {};
        expected = {};
        actual = parse.getData(response);

        expect(actual).toEqual(expected);
    });

    it('parses a singular entity on the data key of the response and preserves each key in the keys array for the entity', () => {
        response = {...states.jsonApiSingleArticle1};
        expected = {articles: states.parsedSingleArticle1.articles};
        actual = parse.getData(response);

        expect(actual).toEqual(expected);
    });

    it('parses the data key of the response and preserves each key in the keys array for the entity', () => {
        response = {...states.jsonApiArticle1};
        expected = {articles: states.parsedArticle1.articles};
        actual = parse.getData(response);

        expect(actual).toEqual(expected);
    });
});

describe('parse', () => {
    let response;
    let actual;
    let expected;

    it('returns an empty object if the response has none of the required keys', () => {
        response = {some: 'wrong', key: 'value', object: 'pairs'};
        expected = {};
        actual = parse.parseResponse(response);

        expect(actual).toEqual(expected);
    });

    it('detects an errors array and passes it through untouched', () => {
        response = {...states.errorResponse};
        expected = states.errorResponse;
        actual = parse.parseResponse(response);

        expect(actual).toEqual(expected);
    });

    it('properly converts and flattens a jsonapi response', () => {
        response = {...states.jsonApiArticle1};
        expected = states.parsedArticle1;
        actual = parse.parseResponse(response);

        expect(actual).toEqual(expected);
    });

    it('does not include keys for included entites in keys array', () => {
        response = {...states.jsonApiArticle2};
        expected = states.parsedArticle2;
        actual = parse.parseResponse(response);

        expect(actual).toEqual(expected);
    });

    it('passes through the meta key if it receives an entity with no data key', () => {
        response = {
            "meta": {
                "isTeapot": false
            }
        };
        expected = {
            "meta": {
                "isTeapot": false
            },
            links: {},
            jsonapi: {}
        };
        actual = parse.parseResponse(response);

        expect(actual).toEqual(expected);
    });
});

describe('parseFactory', () => {
    let response;
    let parser;
    let expected;
    let actual;

    describe('returns a function that', () => {
        it('properly parses jsonApi responses with a custom entity key', () => {
            response = {...states.jsonApiMultipleArticle1};
            expected = states.parsedMultipleArticle1;
            parser = parse.parseResponseFactory(states.revisionNumberIdentifier);
            actual = parser(response);

            expect(actual).toEqual(expected);
        });

        describe('passes the parse tests:', () => {
            it('returns an empty object if the response has none of the required keys', () => {
                response = {some: 'wrong', key: 'value', object: 'pairs'};
                expected = {};
                parser = parse.parseResponseFactory(states.identity);
                actual = parser(response);

                expect(actual).toEqual(expected);
            });

            it('detects an errors array and passes it through untouched', () => {
                response = {...states.errorResponse};
                expected = states.errorResponse;
                parser = parse.parseResponseFactory(states.identity);
                actual = parser(response);

                expect(actual).toEqual(expected);
            });

            it('properly converts and flattens a jsonapi response', () => {
                response = {...states.jsonApiArticle1};
                expected = states.parsedArticle1;
                parser = parse.parseResponseFactory((states.identity));
                actual = parser(response);

                expect(actual).toEqual(expected);
            });

            it('does not include keys for included entites in keys array', () => {
                response = {...states.jsonApiArticle2};
                expected = states.parsedArticle2;
                parser = parse.parseResponseFactory(states.identity);
                actual = parser(response);

                expect(actual).toEqual(expected);
            });

            it('passes through the meta key if it receives an entity with no data key', () => {
                response = {
                    "meta": {
                        "isTeapot": false
                    }
                };
                expected = {
                    "meta": {
                        "isTeapot": false
                    },
                    links: {},
                    jsonapi: {}
                };
                parser = parse.parseResponseFactory(states.identity);
                actual = parser(response);

                expect(actual).toEqual(expected);
            });
        });

        describe('passes getData tests:', () => {
            it('parses a singular entity on the data key of the response and preserves each key in the keys array for the entity', () => {
                response = {...states.jsonApiSingleArticle1};
                expected = states.parsedSingleArticle1;
                parser = parse.parseResponseFactory(states.identity);
                actual = parser(response);

                expect(actual).toEqual(expected);
            });
        });
    });
});
