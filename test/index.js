'use strict';
const assert = require('power-assert');
const fs = require('fs');
const conf = require('../lib/conf');
const pkg = require('../lib/package');
const util = require('../lib/util');
const cli = require('../lib/cli');
// const main = require('../bin/index');

describe('npm-tasks', function() {
    beforeEach(() => {
    });
    afterEach(() => {
    });
    it('init',() => {
        assert(conf);
        assert(pkg);
        assert(util);
        assert(cli);
    });
});