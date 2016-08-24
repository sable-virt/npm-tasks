'use strict';
const path = require('path');
const chalk = require('chalk');
const util = require('./util');
const cli = require('./cli');
module.exports = function() {
  const confPath = cli.flags.config;
  if (util.exists(confPath)) {
    util.verbose(`Load config file:`,` ${confPath}`);
    return require(confPath);
  }
  console.log(chalk.red(`error: Not found config file (${confPath})`));
  return {config:{},task:{}};
};