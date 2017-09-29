# :sparkles: MAJIC :sparkles:

### Module Architecture for JsonAPI Ingesting Consumers

[![CircleCI Build](https://circleci.com/gh/mduleone/majic-parser.svg?style=shield)](https://circleci.com/gh/mduleone/majic-parser)
[![codecov](https://codecov.io/gh/mduleone/majic-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/mduleone/majic-parser)
[![npm version](https://img.shields.io/npm/v/majic-parser.svg?style=flat-square)](https://www.npmjs.com/package/majic-parser)

This tool makes building Redux Front End JavaScript applications that against JsonAPI backends easier.

## Installation

### Yarn

```sh
$ yarn add redux-majic
```

### npm

```sh
$ npm install --save redux-majic
```

## Usage

This is two separate pieces that play well together, `Majic` and `Redux`

1. The `Majic` is a set of functions that parses JsonAPI response objects in to and composes JsonAPI request objects out of `MajicEntities`, or a format that plays very nicely with Redux
2. The `Redux` piece is a set of Actions, Reducers, and Selectors that can ingest and store `MajicEntities` as they come from and go out to the request layer.

When used together, they make interacting with complex JsonAPI entities, requests, and responses in Redux feel... :sparkles: Majical :sparkles:

### JsonAPI Requests and Responses

In practice, we've used this sitting in the api-layer of an application, abstracting away the need to know about the JsonAPI implementation in the application. We've seen it as an elegant way to uniformly handle and store data delivered via JsonAPI.

In these examples, we're using `isomorphic-fetch` as a stand in for the native browesr `fetch`.

#### Parsing a JsonAPI Response

```javascript
import fetch from 'isomorphic-fetch';
import {parseResponse} from 'redux-majic';

function getArticle(articleId) {
    return fetch(`http://example.com/articles/${articleId}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/vnd.api+json'
        }
    })
        .then(response => response.json())
        .then(parseResponse);
}

getArticle('1')
    .then(response => console.log(JSON.stringify(response, null, 4)));
```

This takes the below JsonAPI Response object
```javascript
{
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "self": "resource-linkage"
    },
    "meta": {
        "revisionNumber": 0
    },
    "data": [
        {
            "type": "articles",
            "id": "1",
            "attributes": {
                "title": "JSON API paints my bikeshed!"
            },
            "links": {
                "self": "http://example.com/articles/1"
            },
            "relationships": {
                "author": {
                    "links": {
                        "self": "http://example.com/articles/1/relationships/author",
                        "related": "http://example.com/articles/1/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/1/relationships/comments",
                        "related": "http://example.com/articles/1/comments"
                    },
                    "data": [
                        {
                            "type": "comments",
                            "id": "5"
                        },
                        {
                            "type": "comments",
                            "id": "12"
                        }
                    ]
                }
            }
        }
    ],
    "included": [
        {
            "type": "people",
            "id": "9",
            "attributes": {
                "first-name": "Dan",
                "last-name": "Gebhardt",
                "twitter": "dgeb"
            },
            "links": {
                "self": "http://example.com/people/9"
            }
        },
        {
            "type": "comments",
            "id": "5",
            "attributes": {
                "body": "First!"
            },
            "relationships": {
                "author": {
                    "data": {
                        "type": "people",
                        "id": "2"
                    }
                }
            },
            "links": {
                "self": "http://example.com/comments/5"
            }
        },
        {
            "type": "comments",
            "id": "12",
            "attributes": {
                "body": "I like XML better"
            },
            "relationships": {
                "author": {
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                }
            },
            "links": {
                "self": "http://example.com/comments/12"
            }
        }
    ]
}
```

and turns it in to a [`ParsedMajicEntity`](./src/types.js#L87)

```javascript
{
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "self": "resource-linkage"
    },
    "meta": {
        "revisionNumber": 0
    },
    "__primaryEntities": ["articles"],
    "articles": {
        "keys": ["1"],
        "data": {
            "1": {
                "type": "articles",
                "id": "1",
                "title": "JSON API paints my bikeshed!",
                "links": {
                    "self": "http://example.com/articles/1"
                },
                "author": {
                    "links": {
                        "self": "http://example.com/articles/1/relationships/author",
                        "related": "http://example.com/articles/1/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/1/relationships/comments",
                        "related": "http://example.com/articles/1/comments"
                    },
                    "data": [
                        {
                            "type": "comments",
                            "id": "5"
                        },
                        {
                            "type": "comments",
                            "id": "12"
                        }
                    ]
                }
            }
        }
    },
    "people": {
        "data": {
            "9": {
                "type": "people",
                "id": "9",
                "first-name": "Dan",
                "last-name": "Gebhardt",
                "twitter": "dgeb",
                "links": {
                    "self": "http://example.com/people/9"
                }
            }
        }
    },
    "comments": {
        "data": {
            "5": {
                "type": "comments",
                "id": "5",
                "body": "First!",
                "author": {
                    "data": {
                        "type": "people",
                        "id": "2"
                    }
                },
                "links": {
                    "self": "http://example.com/comments/5"
                }
            },
            "12": {
                "type": "comments",
                "id": "12",
                "body": "I like XML better",
                "author": {
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "links": {
                    "self": "http://example.com/comments/12"
                }
            }
        }
    }
}
```

#### Converting a Majic Data Object in to a JsonAPI Request

```javascript
import fetch from 'isomorphic-fetch';
import {composeRequest} from 'redux-majic';

const articleSchema = {
    "type": "articles",
    "attributes": ["title"],
    "topLevelMeta": ["requestId"],
    "meta": ["revisionNumber"],
    "relationships": [
        {
            "key": "author",
            "defaultType": "people"
        },
        {
            "key": "comments",
            "defaultType": "comments"
        }
    ],
    "included": [
        {
            "key": "author",
            "attributes": ["first-name", "last-name", "twitter"]
        },
        {
            "key": "comments",
            "attributes": ["body"],
            "relationships": [
                {
                    "key": "author",
                    "defaultType": "people"
                }
            ]
        }
    ]
};

const article = {
    "type": "articles",
    "id": "1",
    "title": "JSON API paints my bikeshed!",
    "revisionNumber": 1,
    "requestId": 42,
    "links": {
        "self": "http://example.com/articles/1"
    },
    "author": {
        "links": {
            "self": "http://example.com/articles/1/relationships/author",
            "related": "http://example.com/articles/1/author"
        },
        "data": {
            "type": "people",
            "id": "9",
            "first-name": "Dan",
            "last-name": "Gebhardt",
            "twitter": "dgeb",
            "links": {
                "self": "http://example.com/people/9"
            }
        }
    },
    "comments": {
        "links": {
            "self": "http://example.com/articles/1/relationships/comments",
            "related": "http://example.com/articles/1/comments"
        },
        "data": [
            {
                "type": "comments",
                "id": "5",
                "body": "First!",
                "author": {
                    "data": {
                        "type": "people",
                        "id": "2"
                    }
                },
                "links": {
                    "self": "http://example.com/comments/5"
                }
            },
            {
                "type": "comments",
                "id": "12",
                "body": "I like XML better",
                "author": {
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "links": {
                    "self": "http://example.com/comments/12"
                }
            }
        ]
    }
};

function putArticle(article) {
    return fetch(`http://example.com/articles/${article.id}`, {
        method: 'PUT',
        body: JSON.stringify(composeRequest(article, articleSchema)),
        headers: {
            'content-type': 'application/vnd.api+json'
        }
    });
}

putArticle(article);
```

takes the above [`MajicDataEntity`](./src/types.js#L67) of an article (with its related entites expanded) and turns it in to a JsonAPI Request object

```javascript
{
    "meta": {
        "requestId": 42
    },
    "data": [
        {
            "type": "articles",
            "id": "1",
            "attributes": {
                "title": "JSON API paints my bikeshed!"
            },
            "relationships": {
                "author": {
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "data": [
                        {
                            "type": "comments",
                            "id": "5"
                        },
                        {
                            "type": "comments",
                            "id": "12"
                        }
                    ]
                }
            },
            "meta": {
                "revisionNumber": 1
            }
        }
    ],
    "included": [
        {
            "type": "people",
            "id": "9",
            "attributes": {
                "first-name": "Dan",
                "last-name": "Gebhardt",
                "twitter": "dgeb"
            }
        },
        {
            "type": "comments",
            "id": "5",
            "attributes": {
                "body": "First!"
            },
            "relationships": {
                "author": {
                    "data": {
                        "type": "people",
                        "id": "2"
                    }
                }
            }
        },
        {
            "type": "comments",
            "id": "12",
            "attributes": {
                "body": "I like XML better"
            },
            "relationships": {
                "author": {
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                }
            }
        }
    ]
}
```

### Advanced

If you need to do something that involves receiving and tracking entites with non-unique ids (i.e., tracking multiple revisions of the same entity), we provide a `parseResponseFactory` that accepts an `identifier` function that accepts an entity and returns the key used to identify the distinct entities.

#### Usage

For example, if you have `article` type entities that have `revisionNumbers` on their `meta` fields, we could use the below identity function
```javascript
import fetch from 'isomorphic-fetch';
import {parseResponseFactory} from 'redux-majic';

function revisionNumberIdentifier(entity) {
    if (entity.type === 'articles') {
        return `${entity.id}${('meta' in entity && 'revisionNumber' in entity.meta)? `:${entity.meta.revisionNumber}`: ''}`;
    }

    return entity.id;
}

const articleParser = parseResponseFactory(revisionNumberIdentifier);

function getArticle(articleId) {
    return fetch(`http://example.com/articles/${articleId}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/vnd.api+json'
        }
    })
        .then(response => response.json())
        .then(articleParser);
}

getArticle('1')
    .then(response => console.log(JSON.stringify(response, null, 4)));
```

which would parse the below JsonAPI Resposne

```javascript
{
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "self": "resource-linkage"
    },
    "data": [
        {
            "type": "articles",
            "id": "1",
            "attributes": {
                "title": "JSON API paints my bikeshed! Boom!"
            },
            "links": {
                "self": "http://example.com/articles/1"
            },
            "meta": {
                "revisionNumber": 1
            }
        }
    ],
    "included": [
        {
            "type": "articles",
            "id": "1",
            "attributes": {
                "title": "JSON API paints my bikeshed!"
            },
            "links": {
                "self": "http://example.com/articles/1"
            },
            "meta": {
                "revisionNumber": 0
            }
        }
    ]
}
```

into the below object. Note the identifiers in the `data` object and `keys` array.

```javascript
{
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "self": "resource-linkage"
    },
    "__primaryEntities": ["articles"],
    "articles": {
        "keys": ["1:1"],
        "data": {
            "1:1": {
                "type": "articles",
                "id": "1",
                "title": "JSON API paints my bikeshed! Boom!",
                "links": {
                    "self": "http://example.com/articles/1"
                },
                "revisionNumber": 1
            },
            "1:0": {
                "type": "articles",
                "id": "1",
                "title": "JSON API paints my bikeshed!",
                "links": {
                    "self": "http://example.com/articles/1"
                },
                "revisionNumber": 0
            }
        }
    }
}
```

### Redux

To put all of these pieces all together, we have several pieces that work together.

#### Actions

To start, we have a standard action creator, [`createMajicAction`](./src/redux/actions.js#L9), which returns objects of type [`MajicAction`](./src/redux/types.js#L16).

```javascript
type MajicAction = {
    type: string,
    payload: {},
    meta: {},
    callbacks: {
        [string]: ?Function,
    }
}
```

Using this, we built some standard Action Creators, which pass their data along to `createMajicAction` to ensure all of our actions have the same shape.

1. `receiveMajicEntitiesAction` - This can be used as a standard receive action that every slice of your store listens for, and using the provided reducers, properly receives all entities it is responsible for.
2. `clearNamespaceAction` - We recommend segmenting and grouping requests in to different namespaces, and our provided Action Creators, Reducers, and Selectors help to make that easier. This Action Creator can be used as a standard clearing action that every slice of your stare listens for, and using the provided reducers, properly clears namespaces it is responsible for.

#### Reducers

We have three Reducer functions that you can use to make receiving `MajicEntities` in to your store very simple.

1. `requestMajicNamespace` - This reducer adds the namespace to the slice of a store, as well as sets the namespace `isFetching` to `true`. We recommend using this in the request side of the request-respnse-error action cycle is typical with Redux.
2. `receiveMajicEntitiesReducer` - This reducer accepts the slice of store, a `RECEIVE_MAJIC_ENTITIES` action, and the entities that the specific slice of the store should listen for, and processes all incoming receive requests. For an example set up, see below.
3. `clearMajicNamespaceReducer` - This reducer listens for a `CLEAR_NAMESPACE` action, and then removes the namespace from every slice of store that it's in.

#### Selectors

Finally, we have four Selectors to help us select entities from the slices of Redux store that we're building

1. `selectEntityById` - The simplest selector. Reaches in to the provided slice of the store to grab the entity's map and selects the entity by id
2. `selectEntityByNamespaceAndId` - Reaches into the provided slice of the store to select the namespace
3. `selectEntitiesByNamespace` - Reaches in to the namespace and maps the keys array into an array of entities
4. `selectNamespaceIsFetching` - Reaches in to the namespace and returns the namespace's `isFetching`.

##### Example

Using the above data from [JsonAPI Requests and Responses](#JsonAPI-Requests-and-Responses), imagine we have slices of our store for `articles`, `comments`, and `people` respectively. Combining the slices in to a single store might look like this:

```javascript
import {combineReducers} from 'redux';
import {
    receiveMajicEntitiesReducer,
    clearMajicNamespaceReducer,
    RECEIVE_MAJIC_ENTITIES,
    CLEAR_NAMESPACE,
} from 'redux-majic';

const articles = function(state = {}, action) {
    switch(action.type) {
        case RECEIVE_MAJIC_ENTITIES: {
            return receiveMajicEntitiesReducer(state, action, 'articles');
        }
        case CLEAR_NAMESPACE: {
            return clearMajicNamespaceReducer(state, action);
        }
        default:
            return state;
    }
};

const comments = function(state = {}, action) {
    switch(action.type) {
        case RECEIVE_MAJIC_ENTITIES: {
            return receiveMajicEntitiesReducer(state, action, 'comments');
        }
        case CLEAR_NAMESPACE: {
            return clearMajicNamespaceReducer(state, action);
        }
        default:
            return state;
    }
};

const people = function(state = {}, action) {
    switch(action.type) {
        case RECEIVE_MAJIC_ENTITIES: {
            return receiveMajicEntitiesReducer(state, action, 'people');
        }
        case CLEAR_NAMESPACE: {
            return clearMajicNamespaceReducer(state, action);
        }
        default:
            return state;
    }
};

export default combineReducers({
    articles,
    comments,
    people,
});
```

This combined reducer would take the parsed response from [Parsing a JsonAPI Response](#Parsing-a-JsonAPI-Response) and create a store structured:

```javascript
{
    "articles": {
        "articlesMap": {
            "1": {
                "type": "articles",
                "id": "1",
                "title": "JSON API paints my bikeshed!",
                "links": {
                    "self": "http://example.com/articles/1"
                },
                "author": {
                    "links": {
                        "self": "http://example.com/articles/1/relationships/author",
                        "related": "http://example.com/articles/1/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/1/relationships/comments",
                        "related": "http://example.com/articles/1/comments"
                    },
                    "data": [
                        {
                            "type": "comments",
                            "id": "5"
                        },
                        {
                            "type": "comments",
                            "id": "12"
                        }
                    ]
                }
            }
        },
        "single-article": {
            "isFetching": false,
            "keys": [
                "1"
            ],
            "preservedEntities": {}
        },
        "namespaces": [
            "single-article"
        ]
    },
    "comments": {
        "commentsMap": {
            "5": {
                "type": "comments",
                "id": "5",
                "body": "First!",
                "author": {
                    "data": {
                        "type": "people",
                        "id": "2"
                    }
                },
                "links": {
                    "self": "http://example.com/comments/5"
                }
            },
            "12": {
                "type": "comments",
                "id": "12",
                "body": "I like XML better",
                "author": {
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "links": {
                    "self": "http://example.com/comments/12"
                }
            }
        },
        "namespaces": []
    },
    "people": {
        "peopleMap": {
            "9": {
                "type": "people",
                "id": "9",
                "first-name": "Dan",
                "last-name": "Gebhardt",
                "twitter": "dgeb",
                "links": {
                    "self": "http://example.com/people/9"
                }
            }
        },
        "namespaces": []
    }
}
```

## Thanks

Thank you to the people behind [JsonAPI](http://jsonapi.org/) for the hard work of defining the schema and building the awesome documentation. Also, thank you for the examples you provide in the documentation, as you made building test cases so much easier!

## License
MIT
