import * as utils from '../src/utils';

describe('get', () => {
    let actual;
    let expected;
    let entity;
    let value;
    let key;
    let defaultVal;

    it('gets the desired value from the object', () => {
        value = 'yesss!';
        key = 'key';
        entity = {[key]: value};
        expected = value;
        actual = utils.get(entity, key);

        expect(actual).toEqual(expected);
    });

    it('returns the default value from the object if the key is not defined', () => {
        value = 'yesss!';
        key = 'key';
        entity = {'not-key': value};
        expected = {};
        actual = utils.get(entity, key);

        expect(actual).toEqual(expected);
    });

    it('returns the custom default value from the object if the key is not defined', () => {
        value = 'yesss!';
        key = 'key';
        entity = {'not-key': value};
        defaultVal = 0;
        expected = defaultVal;
        actual = utils.get(entity, key, defaultVal);

        expect(actual).toEqual(expected);
    });

    it('retuns a falsy value if the key is defined and falsy', () => {
        value = false;
        key = 'key';
        entity = {[key]: value};
        expected = value;
        actual = utils.get(entity, key);

        expect(actual).toEqual(expected);
    });
});

describe('pick', () => {
    let actual;
    let expected;
    let entity;
    let keys;

    it('picks the desired value in the object and returns them', () => {
        keys = 'key';
        entity = {'key': 'value'};
        expected = entity;
        actual = utils.pick(entity, keys);

        expect(actual).toEqual(expected);
    });

    it('picks the desired values in the object and returns them', () => {
        keys = ['key1', 'key2'];
        entity = {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
        };
        expected = {
            'key1': 'value1',
            'key2': 'value2',
        };
        actual = utils.pick(entity, keys);

        expect(actual).toEqual(expected);
    });

    it('picks values that exist, ignores ones that do not', () => {
        keys = ['key1', 'key2', 'key4'];
        entity = {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
        };
        expected = {
            'key1': 'value1',
            'key2': 'value2',
        };
        actual = utils.pick(entity, keys);

        expect(actual).toEqual(expected);
    });
});

describe('omit', () => {
    let actual;
    let expected;
    let entity;
    let keys;

    it('omits the desired value in the object and returns everything else', () => {
        keys = 'key1';
        entity = {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
        };
        expected = {
            'key2': 'value2',
            'key3': 'value3',
        };
        actual = utils.omit(entity, keys);

        expect(actual).toEqual(expected);
    });

    it('omits the desired values in the object and returns everything else', () => {
        keys = ['key1', 'key2'];
        entity = {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
        };
        expected = {
            'key3': 'value3',
        };
        actual = utils.omit(entity, keys);

        expect(actual).toEqual(expected);
    });

    it('omits values that exist, ignores ones that do not', () => {
        keys = ['key1', 'key2', 'key4'];
        entity = {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
        };
        expected = {
            'key3': 'value3',
        };
        actual = utils.omit(entity, keys);

        expect(actual).toEqual(expected);
    });
});

describe('stringUniq', () => {
    let actual;
    let expected;
    let arr;

    it('returns an array of strings unchanged if they are all uniq', () => {
        arr = ['these', 'words', 'are', 'unique'];
        expected = arr;
        actual = utils.stringUniq(arr);

        expect(actual).toEqual(expected);
    });

    it('returns an array of only unique strings form the array', () => {
        arr = ['these', 'these', 'these', 'words', 'words', 'are', 'these', 'not', 'not', 'unique'];
        expected = ['these', 'words', 'are', 'not', 'unique'];
        actual = utils.stringUniq(arr);

        expect(actual).toEqual(expected);
    });
});

describe('mergeMajicObjects', () => {
    let actual;
    let expected;
    let majic1;
    let majic2;
    let totalCombined;

    beforeAll(() => {
        totalCombined = {
            articles: {
                keys: ['2', '29', '51'],
                data: {
                    '2': {
                        id: '2',
                        type: 'articles',
                        title: 'This is my second article!'
                    },
                    '29': {
                        id: '29',
                        type: 'articles',
                        title: 'How to stay under 30 forever'
                    },
                    '51': {
                        id: '51',
                        type: 'articles',
                        title: 'Article 51! SpoOooOoookyyy'
                    },
                    '88': {
                        id: '88',
                        type: 'articles',
                        title: 'Lucky number 88!'
                    }
                }
            },
            comments: {
                data: {
                    '5': {
                        'type': 'comments',
                        'id': '5',
                        'body': 'First!',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '2'
                            }
                        }
                    },
                    '12': {
                        'type': 'comments',
                        'id': '12',
                        'body': 'I like XML better',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '9'
                            }
                        }
                    }
                }
            }
        };
    });

    it('merges two majic objects with no overlapping keys', () => {
        majic1 = {
            articles: {
                keys: ['2', '29', '51'],
                data: {
                    '2': {
                        id: '2',
                        type: 'articles',
                        title: 'This is my second article!'
                    },
                    '29': {
                        id: '29',
                        type: 'articles',
                        title: 'How to stay under 30 forever'
                    },
                    '51': {
                        id: '51',
                        type: 'articles',
                        title: 'Article 51! SpoOooOoookyyy'
                    },
                    '88': {
                        id: '88',
                        type: 'articles',
                        title: 'Lucky number 88!'
                    }
                }
            }
        };
        majic2 = {
            comments: {
                data: {
                    '5': {
                        'type': 'comments',
                        'id': '5',
                        'body': 'First!',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '2'
                            }
                        }
                    },
                    '12': {
                        'type': 'comments',
                        'id': '12',
                        'body': 'I like XML better',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '9'
                            }
                        }
                    }
                }
            }
        };
        expected = totalCombined;
        actual = utils.mergeMajicObjects(majic1, majic2);
    });

    it('merges two majic objects with overlapping keys and no collisions', () => {
        majic1 = {
            articles: {
                keys: ['2', '29'],
                data: {
                    '2': {
                        id: '2',
                        type: 'articles',
                        title: 'This is my second article!'
                    },
                    '29': {
                        id: '29',
                        type: 'articles',
                        title: 'How to stay under 30 forever'
                    }
                }
            }
        };
        majic2 = {
            articles: {
                keys: ['51'],
                data: {
                    '51': {
                        id: '51',
                        type: 'articles',
                        title: 'Article 51! SpoOooOoookyyy'
                    },
                    '88': {
                        id: '88',
                        type: 'articles',
                        title: 'Lucky number 88!'
                    }
                }
            },
            comments: {
                data: {
                    '5': {
                        'type': 'comments',
                        'id': '5',
                        'body': 'First!',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '2'
                            }
                        }
                    },
                    '12': {
                        'type': 'comments',
                        'id': '12',
                        'body': 'I like XML better',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '9'
                            }
                        }
                    }
                }
            }
        };
        expected = totalCombined;
        actual = utils.mergeMajicObjects(majic1, majic2);

        expect(actual).toEqual(expected);
    });

    it('merges two majic objects with overlapping keys and collisions', () => {
        majic1 = {
            articles: {
                keys: ['2', '29'],
                data: {
                    '2': {
                        id: '2',
                        type: 'articles',
                        title: 'This is my second article!'
                    },
                    '29': {
                        id: '29',
                        type: 'articles',
                        title: 'How to stay under 30 forever'
                    }
                }
            }
        };
        majic2 = {
            articles: {
                keys: ['51'],
                data: {
                    '29': {
                        id: '29',
                        type: 'articles',
                        title: `Oh no! I'm in the second object, so I lose!`
                    },
                    '51': {
                        id: '51',
                        type: 'articles',
                        title: 'Article 51! SpoOooOoookyyy'
                    },
                    '88': {
                        id: '88',
                        type: 'articles',
                        title: 'Lucky number 88!'
                    }
                }
            },
            comments: {
                data: {
                    '5': {
                        'type': 'comments',
                        'id': '5',
                        'body': 'First!',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '2'
                            }
                        }
                    },
                    '12': {
                        'type': 'comments',
                        'id': '12',
                        'body': 'I like XML better',
                        'author': {
                            'data': {
                                'type': 'people',
                                'id': '9'
                            }
                        }
                    }
                }
            }
        };
        expected = totalCombined;
        actual = utils.mergeMajicObjects(majic1, majic2);

        expect(actual).toEqual(expected);
    });
});

describe('isEmpty', () => {
    let actual;
    let expected;
    let candidate;

    describe('with objects', () => {
        it('returns true for empty objects', () => {
            candidate = {};
            expected = true;
            actual = utils.isEmpty(candidate);
        });

        it('returns false for nonempty objects', () => {
            candidate = {key: 'value'};
            expected = false;
            actual = utils.isEmpty(candidate);
        });
    });

    describe('with arrays', () => {
        it('returns true for empty arrays', () => {
            candidate = [];
            expected = true;
            actual = utils.isEmpty(candidate);
        });

        it('returns false for nonempty arrays', () => {
            candidate = ['value'];
            expected = false;
            actual = utils.isEmpty(candidate);
        });
    });

    describe('with strings', () => {
        it('returns true for empty arrays', () => {
            candidate = '';
            expected = true;
            actual = utils.isEmpty(candidate);
        });

        it('returns false for nonempty arrays', () => {
            candidate = 'value';
            expected = false;
            actual = utils.isEmpty(candidate);
        });
    });

    describe('with booleans', () => {
        it('returns true for false', () => {
            candidate = false;
            expected = true;
            actual = utils.isEmpty(candidate);
        });

        it('returns false for true', () => {
            candidate = true;
            expected = false;
            actual = utils.isEmpty(candidate);
        });
    });

    describe('with numbers', () => {
        it('returns true for 0', () => {
            candidate = 0;
            expected = true;
            actual = utils.isEmpty(candidate);
        });

        it('returns false for non 0', () => {
            candidate = 1;
            expected = false;
            actual = utils.isEmpty(candidate);
        });
    });

    describe('with anything else', () => {
        it('returns true for null', () => {
            candidate = null;
            expected = true;
            actual = utils.isEmpty(candidate);
        });

        it('returns true for undefined', () => {
            candidate = undefined;
            expected = true;
            actual = utils.isEmpty(candidate);
        });
    });
});
