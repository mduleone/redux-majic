import {pick} from '../src/utils';

export const errorResponse = {
    errors: [
        {
            "id": 'entityIsATeapot',
            "status": 418,
            "detail": "I'm a teapot, and that's not water"
        }
    ]
};

export const jsonApiArticle1 = {
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
};

export const parsedArticle1 = {
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
};

export const includedArticle1 = pick(parsedArticle1, ['people', 'comments']);

export const jsonApiArticle2 = {
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
            "id": "2",
            "attributes": {
                "title": "This is my second article!"
            },
            "links": {
                "self": "http://example.com/articles/2"
            },
            "relationships": {
                "author": {
                    "links": {
                        "self": "http://example.com/articles/2/relationships/author",
                        "related": "http://example.com/articles/2/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/2/relationships/comments",
                        "related": "http://example.com/articles/2/comments"
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
                },
                "related-articles": {
                    "links": {
                        "self": "http://example.com/articles/2/relationships/related-articles",
                        "related": "http://example.com/articles/2/related-articles"
                    },
                    "data": [
                        {
                            "type": "articles",
                            "id": "51"
                        },
                        {
                            "type": "articles",
                            "id": "29"
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
        },
        {
            "type": "articles",
            "id": "51",
            "attributes": {
                "title": "Article 51! SpoOooOoookyyy"
            },
            "links": {
                "self": "http://example.com/articles/51"
            },
            "relationships": {
                "author": {
                    "links": {
                        "self": "http://example.com/articles/51/relationships/author",
                        "related": "http://example.com/articles/51/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/51/relationships/comments",
                        "related": "http://example.com/articles/51/comments"
                    },
                    "data": []
                },
                "related-articles": {
                    "links": {
                        "self": "http://example.com/articles/51/relationships/related-articles",
                        "related": "http://example.com/articles/51/related-articles"
                    },
                    "data": [
                        {
                            "type": "articles",
                            "id": "2"
                        },
                        {
                            "type": "articles",
                            "id": "29"
                        }
                    ]
                }
            }
        },
        {
            "type": "articles",
            "id": "29",
            "attributes": {
                "title": "How to stay under 30 for ever"
            },
            "links": {
                "self": "http://example.com/articles/29"
            },
            "relationships": {
                "author": {
                    "links": {
                        "self": "http://example.com/articles/29/relationships/author",
                        "related": "http://example.com/articles/29/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/29/relationships/comments",
                        "related": "http://example.com/articles/29/comments"
                    },
                    "data": []
                },
                "related-articles": {
                    "links": {
                        "self": "http://example.com/articles/29/relationships/related-articles",
                        "related": "http://example.com/articles/29/related-articles"
                    },
                    "data": [
                        {
                            "type": "articles",
                            "id": "51"
                        },
                        {
                            "type": "articles",
                            "id": "2"
                        }
                    ]
                }
            }
        }
    ]
};

export const parsedArticle2 = {
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
        "keys": ["2"],
        "data": {
            "2": {
                "type": "articles",
                "id": "2",
                "title": "This is my second article!",
                "links": {
                    "self": "http://example.com/articles/2"
                },
                "author": {
                    "links": {
                        "self": "http://example.com/articles/2/relationships/author",
                        "related": "http://example.com/articles/2/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/2/relationships/comments",
                        "related": "http://example.com/articles/2/comments"
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
                },
                "related-articles": {
                    "links": {
                        "self": "http://example.com/articles/2/relationships/related-articles",
                        "related": "http://example.com/articles/2/related-articles"
                    },
                    "data": [
                        {
                            "type": "articles",
                            "id": "51"
                        },
                        {
                            "type": "articles",
                            "id": "29"
                        }
                    ]
                }
            },
            "29": {
                "type": "articles",
                "id": "29",
                "title": "How to stay under 30 for ever",
                "links": {
                    "self": "http://example.com/articles/29"
                },
                "author": {
                    "links": {
                        "self": "http://example.com/articles/29/relationships/author",
                        "related": "http://example.com/articles/29/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/29/relationships/comments",
                        "related": "http://example.com/articles/29/comments"
                    },
                    "data": []
                },
                "related-articles": {
                    "links": {
                        "self": "http://example.com/articles/29/relationships/related-articles",
                        "related": "http://example.com/articles/29/related-articles"
                    },
                    "data": [
                        {
                            "type": "articles",
                            "id": "51"
                        },
                        {
                            "type": "articles",
                            "id": "2"
                        }
                    ]
                }
            },
            "51": {
                "type": "articles",
                "id": "51",
                "title": "Article 51! SpoOooOoookyyy",
                "links": {
                    "self": "http://example.com/articles/51"
                },
                "author": {
                    "links": {
                        "self": "http://example.com/articles/51/relationships/author",
                        "related": "http://example.com/articles/51/author"
                    },
                    "data": {
                        "type": "people",
                        "id": "9"
                    }
                },
                "comments": {
                    "links": {
                        "self": "http://example.com/articles/51/relationships/comments",
                        "related": "http://example.com/articles/51/comments"
                    },
                    "data": []
                },
                "related-articles": {
                    "links": {
                        "self": "http://example.com/articles/51/relationships/related-articles",
                        "related": "http://example.com/articles/51/related-articles"
                    },
                    "data": [
                        {
                            "type": "articles",
                            "id": "2"
                        },
                        {
                            "type": "articles",
                            "id": "29"
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
};


export const jsonApiSingleArticle1 = {
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "self": "resource-linkage"
    },
    "data": {
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
};

export const parsedSingleArticle1 = {
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "self": "resource-linkage"
    },
    "__primaryEntities": ["articles"],
    "articles": {
        "keys": ["1"],
        "data": {
            "1": {
                "type": "articles",
                "id": "1",
                "title": "JSON API paints my bikeshed! Boom!",
                "links": {
                    "self": "http://example.com/articles/1"
                },
                "revisionNumber": 1
            }
        }
    }
}

export function revisionNumberIdentifier(entity) {
    return `${entity.id}${('meta' in entity && 'revisionNumber' in entity.meta)? `:${entity.meta.revisionNumber}`: ''}`;
}

export function identity(entity) {
    return entity.id;
}

export const jsonApiMultipleArticle1 = {
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
};

export const parsedMultipleArticle1 = {
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
};

export const composedArticle1 = {
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
};
export const composedSingleArticle1 = {
    "meta": {
        "requestId": 42
    },
    "data": {
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
    },
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
};

export const metaComposedArticle1 = {
    "data": [
        {
            "type": "articles",
            "id": "1",
            "meta": {
                "revisionNumber": 1
            }
        }
    ]
};

export const relationshipsComposedArticle1 = {
    "data": [
        {
            "type": "articles",
            "id": "1",
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
            }
        }
    ]
};

export const includedComposedArticle1 = {
    "data": [
        {
            "type": "articles",
            "id": "1",
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
};

export const datalessIncludedComposedArticle1 = {
    "data": [
        {
            "type": "articles",
            "id": "1",
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
                },
                "missing-data-relationship": {
                    "meta": {
                        "meta-key": "meta-value"
                    }
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
};

export const attributesComposedArticle1 = {
    "data": [
        {
            "type": "articles",
            "id": "1",
            "attributes": {
                "title": "JSON API paints my bikeshed!"
            },
        }
    ]
};

export const topLevelMetaComposedArticle1 = {
    "meta": {
        "requestId": 42
    },
    "data": [
        {
            "type": "articles",
            "id": "1"
        }
    ]
};

export const article1toCompose = {
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
    },
    "missing-data-relationship": {
        "links": {
            "self": "http://example.com/articles/1/relationships/comments",
            "related": "http://example.com/articles/1/comments"
        },
        "meta": {
            "meta-key": "meta-value"
        }
    }
};

export const articleSchema = {
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
