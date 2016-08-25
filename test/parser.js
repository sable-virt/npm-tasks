'use strict';
const assert = require('power-assert');
const parser = require('../lib/parser');

describe('parser', function() {
    beforeEach(() => {
    });
    afterEach(() => {
    });
    it('init',() => {
        assert(parser.parseTask);
        assert(parser.parseTaskKey);
    });
    it('parser - parseTaskKey',() => {
        let result = parser.parseTaskKey('test',{
            task: {
                test: 'hoge',
                aaaa: 'bbbb'
            }
        });
        assert(result.length === 1);
        assert(result[0] === 'test');

        result = parser.parseTaskKey('build:*',{
            task: {
                'build:a': 'a',
                'build:b': 'b',
                aaaa: 'bbbb'
            }
        });
        assert(result.length === 2);
        assert(result[0] === 'build:a');
        assert(result[1] === 'build:b');
    });

    it('parser - parseTask',() => {
        let result = parser.parseTask(['test'],{
            task: {
                test: 'hoge',
                aaaa: 'bbbb'
            }
        });
        assert(result.length === 1);
        assert.deepEqual(result[0],{name:"test",command:"hoge",commandList:['hoge']});

        result = parser.parseTask('build:*',{
            task: {
                'build:a': 'command a',
                'build:b': 'command b',
                aaaa: 'bbbb'
            }
        });
        assert(result.length === 2);
        assert.deepEqual(result,[
            {name:"build:a",command:"command a",commandList:['command a']},
            {name:"build:b",command:"command b",commandList:['command b']}
        ]);
    });
    it('parser - parseTask with config',() => {
        let result = parser.parseTask('build:*',{
            config: {
                'a': 'あ',
                'b': 'い'
            },
            task: {
                'build:a': 'command ${a}',
                'build:b': 'command ${b}',
                aaaa: 'bbbb'
            }
        });
        assert(result.length === 2);
        assert.deepEqual(result,[
            {name:"build:a",command:"command あ",commandList:['command あ']},
            {name:"build:b",command:"command い",commandList:['command い']}
        ]);
    });

    it('parser - parseTask with env',() => {
        process.env.npm_package_config_a = 'あ';
        process.env.npm_package_config_b = 'い';
        let result = parser.parseTask('build:*',{
            task: {
                'build:a': 'command ${a}',
                'build:b': 'command ${b}',
                aaaa: 'bbbb'
            }
        });
        assert(result.length === 2);
        assert.deepEqual(result,[
            {name:"build:a",command:"command あ",commandList:['command あ']},
            {name:"build:b",command:"command い",commandList:['command い']}
        ]);
    });

    it('parser - parseTask with wildcard',() => {
        let result = parser.parseTask('build',{
            config: {
                src: './bin/*.js',
            },
            task: {
                'build': 'command ${src}'
            }
        });
        assert(result.length === 1);
        assert.deepEqual(result,[
            {name:"build",command:"command ./bin/index.js",commandList:['command ./bin/index.js']}
        ]);

        result = parser.parseTask('build',{
            config: {
                src: './test/*.js',
            },
            task: {
                'build': 'command ${src}'
            }
        });
        assert(result.length === 1);
        assert.deepEqual(result,[
            {name:"build",command:"command ./test/index.js ./test/parser.js",commandList:['command ./test/index.js ./test/parser.js']}
        ]);
    });

    it('parser - parseTask with &&',() => {
        let result = parser.parseTask('build',{
            task: {
                'build': 'cmd-a && cmd-b'
            }
        });
        assert(result.length === 1);
        assert.deepEqual(result,[
            {name:"build",command:"cmd-a && cmd-b",commandList:['cmd-a', 'cmd-b']}
        ]);
    });
    it('parser - parseTask with options',() => {
        let result = parser.parseTask('build',{
            task: {
                'build': 'cmd-a -w && cmd-b -w'
            }
        });
        assert(result.length === 1);
        assert.deepEqual(result,[
            {name:"build",command:"cmd-a -w && cmd-b -w",commandList:['cmd-a -w', 'cmd-b -w']}
        ]);
    });
});