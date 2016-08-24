'use strict';
const assert = require('power-assert');
const fs = require('fs');
const conf = require('../lib/conf');
const pkg = require('../lib/package');
const util = require('../lib/util');
const cli = require('../lib/cli');
// const main = require('../bin/index');

describe('sync-dir', function() {
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