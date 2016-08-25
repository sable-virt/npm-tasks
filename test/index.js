'use strict';
const assert = require('power-assert');
const fs = require('fs');
const getConfig = require('../lib/conf');
const getPackage = require('../lib/package');
const util = require('../lib/util');
const cli = require('../lib/cli');

describe('npm-tasks', function() {
    require('./parser');

    beforeEach(() => {
    });
    afterEach(() => {
    });
    it('init',() => {
        assert(getConfig);
        assert(getPackage);
        assert(util);
        assert(cli);
    });
    it('getPackage', () => {
        let pkg = getPackage();
        assert(pkg);
        assert(pkg.name === 'npm-tasks');
    });
    it('getConfig', () => {
        let conf = getConfig();
        console.log(conf);
        assert(conf.config.dest === 'public');
        assert(conf.task.test === 'echo \'${dest}\'');
    });
});