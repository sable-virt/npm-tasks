'use strict';
const path = require('path');
const chalk = require('chalk');
const util = require('./util');
module.exports = function (filepath) {
    if (!filepath) {
        filepath = path.join(process.cwd(), 'task.conf.js');
    }
    if (util.exists(filepath)) {
        util.verbose(`Load task file:`, ` ${filepath}`);
        return require(filepath);
    }
    console.log(chalk.red(`error: Not found task file (${filepath})`));
    return {config: {}, task: {}};
};