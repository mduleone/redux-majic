import {pick, omit} from 'lodash/object';
import * as states from './states';
import * as compose from '../src/compose';

describe('composeRequest', () => {
    let data;
    let schema;
    let actual;
    let expected;

    it('throws an error if the provided schema is invalid', () => {
        data = states.article1toCompose;
        schema = {};

        expect(() => {compose.composeRequest(data, schema)}).toThrow();
    });

    it('throws an error if the provided data is missing an id field', () => {
        data = omit(states.article1toCompose, 'id');
        schema = {...states.articleSchema};

        expect(() => {compose.composeRequest(data, schema)}).toThrow();
    });

    it('throws an error if the provided data type is not the same as the schema', () => {
        data = {type: 'wrong', id: 'id'};
        schema = {type: 'right'};

        expect(() => {compose.composeRequest(data, schema)}).toThrow();
    });

    it('properly composes a JsonAPI request object with just topLevelMeta', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'topLevelMeta'])};
        expected = states.topLevelMetaComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra topLevelMeta', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'topLevelMeta'])};
        schema.topLevelMeta.push('extra');
        expected = states.topLevelMetaComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with just attributes', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'attributes'])};
        expected = states.attributesComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra attributes', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'attributes'])};
        schema.attributes.push('extra');
        expected = states.attributesComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with just relationships', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'relationships'])};
        expected = states.relationshipsComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra relationships', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'relationships'])};
        schema.relationships.push({key: 'extra'});
        expected = states.relationshipsComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with just meta', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'meta'])};
        expected = states.metaComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra meta', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'meta'])};
        schema.meta.push('extra');
        expected = states.metaComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with just relationships and included', () => {
        data = states.article1toCompose;
        schema = {...pick(states.articleSchema, ['type', 'relationships', 'included'])};
        expected = states.includedComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra relationships and included', () => {
        data = states.article1toCompose;
        schema = pick(states.articleSchema, ['type', 'relationships', 'included']);
        schema.relationships.push({key: 'extra'});
        schema.included.push({key: 'extra'});
        expected = states.includedComposedArticle1;
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly returns the fully composed JsonAPI request object', () => {
        data = states.article1toCompose;
        schema = states.articleSchema;
        expected = states.composedArticle1
        actual = compose.composeRequest(data, schema);

        expect(actual).toEqual(expected);
    });
});

describe('buildIncluded', () => {
    let data;
    let schema;
    let actual;
    let expected;

    it('throws an error if the provided schema is invalid', () => {
        data = states.article1toCompose.author.data;
        schema = {};

        expect(() => compose.buildIncluded(data, schema)).toThrow();
    });

    it('throws an error if the provided data is missing an id field', () => {
        data = omit(states.article1toCompose.author.data, 'id');
        schema = {
            key: 'author',
            attributes: ['first-name', 'last-name', 'twitter'],
        };

        expect(() => compose.buildIncluded(data, schema)).toThrow();
    });

    it('properly composes a JsonAPI request object with just attributes', () => {
        data = states.article1toCompose.author.data;
        schema = {
            key: 'author',
            attributes: ['first-name', 'last-name', 'twitter'],
        };
        expected = {
            'id': '9',
            'type': 'people',
            'attributes': {
                'first-name': 'Dan',
                'last-name': 'Gebhardt',
                'twitter': 'dgeb',
            }
        };
        actual = compose.buildIncluded(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra attributes', () => {
        data = states.article1toCompose.author.data;
        schema = {
            key: 'author',
            attributes: ['first-name', 'last-name', 'twitter', 'extra'],
        };
        expected = {
            'id': '9',
            'type': 'people',
            'attributes': {
                'first-name': 'Dan',
                'last-name': 'Gebhardt',
                'twitter': 'dgeb',
            }
        };
        actual = compose.buildIncluded(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with relationships', () => {
        data = states.article1toCompose.comments.data[0];
        schema = {
            key: 'comments',
            attributes: ['body'],
            relationships: [
                {key: 'author'}
            ]
        };
        expected = {
            'id': '5',
            'type': 'comments',
            'attributes': {
                'body': 'First!',
            },
            'relationships': {
                'author': {
                    'data': {
                        'type': 'people',
                        'id': '2'
                    }
                }
            }
        };
        actual = compose.buildIncluded(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra relationships', () => {
        data = states.article1toCompose.comments.data[0];
        schema = {
            key: 'comments',
            attributes: ['body'],
            relationships: [
                {key: 'author'},
                {key: 'extra'}
            ]
        };
        expected = {
            'id': '5',
            'type': 'comments',
            'attributes': {
                'body': 'First!',
            },
            'relationships': {
                'author': {
                    'data': {
                        'type': 'people',
                        'id': '2'
                    }
                }
            }
        };
        actual = compose.buildIncluded(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with meta', () => {
        data = {
                'type': 'comments',
                'id': '5',
                'body': 'First!',
                'revisionNumber': 1,
                'author': {
                    'data': {
                        'type': 'people',
                        'id': '2'
                    }
                },
                'links': {
                    'self': 'http://example.com/comments/5'
                }
            };
        schema = {
            key: 'comments',
            attributes: ['body'],
            relationships: [{key: 'author'}],
            meta: ['revisionNumber'],
        };
        expected = {
            'id': '5',
            'type': 'comments',
            'attributes': {
                'body': 'First!',
            },
            'relationships': {
                'author': {
                    'data': {
                        'type': 'people',
                        'id': '2'
                    }
                }
            },
            'meta': {
                'revisionNumber': 1
            }
        };
        actual = compose.buildIncluded(data, schema);

        expect(actual).toEqual(expected);
    });

    it('properly composes a JsonAPI request object with extra meta', () => {
        data = {
                'type': 'comments',
                'id': '5',
                'body': 'First!',
                'revisionNumber': 1,
                'author': {
                    'data': {
                        'type': 'people',
                        'id': '2'
                    }
                },
                'links': {
                    'self': 'http://example.com/comments/5'
                }
            };
        schema = {
            key: 'comments',
            attributes: ['body'],
            relationships: [{key: 'author'}],
            meta: ['revisionNumber', 'extra'],
        };
        expected = {
            'id': '5',
            'type': 'comments',
            'attributes': {
                'body': 'First!',
            },
            'relationships': {
                'author': {
                    'data': {
                        'type': 'people',
                        'id': '2'
                    }
                }
            },
            'meta': {
                'revisionNumber': 1
            }
        };
        actual = compose.buildIncluded(data, schema);

        expect(actual).toEqual(expected);
    });
});

describe('buildRelationship', () => {
    let relation;
    let schema;
    let expected;
    let actual;

    it('passes through meta information in the meta key of the schema', () => {
        relation = {
            meta: {
                revisionNumber: 1,
            },
        };
        schema = {
            key: 'author',
            meta: ['revisionNumber']
        };
        expected = {
            meta: {
                revisionNumber: 1
            }
        };
        actual = compose.buildRelationship(relation, schema);

        expect(actual).toEqual(expected);
    });

    it(`builds the Relationship's data key from the passed in relationship data (single entity)`, () => {
        relation = states.article1toCompose.author;
        schema = {
            key: 'author'
        };
        expected = {
            data: {
                type: 'people',
                id: '9'
            }
        };
        actual = compose.buildRelationship(relation, schema);

        expect(actual).toEqual(expected);
    });

    it(`builds the Relationship's data key array from the passed in relationship data (multiple entity)`, () => {
        relation = states.article1toCompose.comments;
        schema = {
            key: 'comments'
        };
        expected = {
            data: [
                {
                    type: 'comments',
                    id: '5'
                },
                {
                    type: 'comments',
                    id: '12'
                }
            ]
        };
        actual = compose.buildRelationship(relation, schema);

        expect(actual).toEqual(expected);
    });
});

describe('validateSchema', () => {
    let schema;
    let expected;
    let actual;

    it('returns true if the schema is valid', () => {
        schema = states.articleSchema;
        expected = true;
        actual = compose.validateSchema(schema);

        expect(actual).toEqual(expected);
    });

    it('throws an error if the schema topLevelMeta is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: 'requestId',
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if any of the topLevelMeta are not strings', () => {
        schema = {
            type: 'articles',
            topLevelMeta: [false],
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if the schema attributes is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: 'title',
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if any of the attributes are not strings', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: [false],
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if the schema relationships is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: {type: 'people', key: 'author'},
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if any of the relationships are invalid relationships', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [false],
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if the schema included is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [{type: 'people', key: 'author'}],
            included: {key: 'author'},
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if any of the included are invlaid entities', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [{type: 'people', key: 'author'}],
            included: [false],
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if the schema meta is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [{type: 'people', key: 'author'}],
            included: [{key: 'author'}],
            meta: 'revisionNumber',
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });

    it('throws an error if any of the schema meta are not strings', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [{type: 'people', key: 'author'}],
            included: [{key: 'author'}],
            meta: [false],
        };

        expect(() => compose.validateSchema(schema)).toThrow();
    });
});

describe('validateArray', () => {
    let candidate;
    let entity;
    let actual;
    let expected;

    it('throws an error if the candidate is not an array', () => {
        candidate = false;
        entity = 'attributes';
        expect(() => compose.validateArray(candidate, entity)).toThrow();
    });

    it('returns true the candidate is an array', () => {
        candidate = ['false'];
        entity = 'attributes';
        expected = true;
        actual = compose.validateArray(candidate, entity)
        expect(actual).toEqual(expected);
    });
});

describe('validateSimpleSchema', () => {
    let candidate;
    let actual;
    let expected;

    it('throws an error if the candidate is not a string', () => {
        candidate = false;
        expect(() => compose.validateSimpleSchema(candidate)).toThrow();
    });

    it('returns true the candidate is a string', () => {
        candidate = 'false';
        expected = true;
        actual = compose.validateSimpleSchema(candidate)
        expect(actual).toEqual(expected);
    });
});

describe('validateRelationshipSchema', () => {
    let candidate;
    let actual;
    let expected;

    it('throws an error if the candidate is not an object', () => {
        candidate = false;

        expect(() => compose.validateRelationshipSchema(candidate)).toThrow();
    });

    it('throws an error if a relationship is missing a key value', () => {
        candidate = {};

        expect(() => compose.validateRelationshipSchema(candidate)).toThrow();
    });

    it('throws an error if the relationship key is not a string', () => {
        candidate = {key: false, type: 'people'};

        expect(() => compose.validateRelationshipSchema(candidate)).toThrow();
    });

    it('throws an error if a relationship includes a meta key that is not an array', () => {
        candidate = {key: 'author', type: 'people', meta: 'false'};

        expect(() => compose.validateRelationshipSchema(candidate)).toThrow();
    });

    it('throws an error if a relationship includes a meta key that is not an array of strings', () => {
        candidate = {key: 'author', type: 'people', meta: [false]};

        expect(() => compose.validateRelationshipSchema(candidate)).toThrow();
    });

    it('returns true if a relationship is valid', () => {
        candidate = {key: 'author', type: 'people'};
        expected = true;
        actual = compose.validateRelationshipSchema(candidate);

        expect(actual).toEqual(expected);
    });
});

describe('validateIncludedSchema', () => {
    let schema;
    let expected;
    let actual;

    it('returns true if the schema is valid', () => {
        schema = states.articleSchema.included[1];
        expected = true;
        actual = compose.validateIncludedSchema(schema);

        expect(actual).toEqual(expected);
    });

    it('throws an error if the schema topLevelMeta is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: 'requestId',
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });

    it('throws an error if any of the topLevelMeta are not strings', () => {
        schema = {
            type: 'articles',
            topLevelMeta: [false],
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });

    it('throws an error if the schema attributes is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: 'title',
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });

    it('throws an error if any of the attributes are not strings', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: [false],
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });

    it('throws an error if the schema relationships is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: {type: 'people', key: 'author'},
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });

    it('throws an error if any of the relationships are invalid relationships', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [false],
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });

    it('throws an error if the schema meta is not an array', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [{type: 'people', key: 'author'}],
            included: [{type: 'people', key: 'author'}],
            meta: 'revisionNumber',
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });

    it('throws an error if any of the schema meta are not strings', () => {
        schema = {
            type: 'articles',
            topLevelMeta: ['requestId'],
            attributes: ['title'],
            relationships: [{type: 'people', key: 'author'}],
            included: [{type: 'people', key: 'author'}],
            meta: [false],
        };

        expect(() => compose.validateIncludedSchema(schema)).toThrow();
    });
});