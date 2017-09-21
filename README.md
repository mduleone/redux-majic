# :sparkles: MAJIC :sparkles:

### Module Architecture for JsonAPI Ingesting Consumers

[![CircleCI](https://circleci.com/gh/mduleone/majic-parser.svg?style=shield)](https://circleci.com/gh/mduleone/majic-parser)

This tool is intended to make working with a server that implements JsonAPI more friendly for front-end JavaScript applications.

## Installation

### Yarn

```sh
$ yarn add majic-parser
```

### npm

```sh
$ npm install --save majic-parser
```

## Usage

In practice, we've used this sitting in the api-layer of an application, abstracting away the need to know about the JsonAPI implementation in the application. We've seen it as an elegant way to uniformly handle and store data delivered via JsonAPI.

In these examples, we're using `isomorphic-fetch` as a stand in for the native browesr `fetch`.

### Parsing a JsonAPI Response

```javascript
import fetch from 'isomorphic-fetch';
import {parseResponse} from 'majic-parser';

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

This takes the below JsonAPI object
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

and turns it in to

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

### Converting a Majic Data Object in to a JsonAPI Request

```javascript
import fetch from 'isomorphic-fetch';
import {composeRequest} from 'majic-parser';

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

takes the above Majic representation of an article (with its related entites expanded) and turns it in to

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

## Advanced

If you need to do something that involves receiving and tracking entites with non-unique ids (i.e., tracking multiple revisions of the same entity), we provide a `parseResponseFactory` that accepts an `identifier` function that accepts an entity and returns the key used to identify the distinct entities.

### Usage

For example, if you have `article` type entities that have `revisionNumbers` on their `meta` fields, we could use the below identity function
```javascript
import fetch from 'isomorphic-fetch';
import {parseResponseFactory} from 'majic-parser';

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
    "meta": {},
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

## Thanks

Thank you to the people behind [JsonAPI](http://jsonapi.org/) for the hard work of defining the schema and building the awesome documentation. Also, thank you for the examples you provide in the documentation, as you made building test cases so much easier!

## License
MIT
