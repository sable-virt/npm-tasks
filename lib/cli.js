#!/usr/bin/env node
'use strict';
/**
 * cli.js
 */
const path = require('path');
const meow = require('meow');
module.exports = meow(`
    Usage
      $ nr <TASK_NAME> [options] -- [task options]
    Commands
      $ nr <TASK_NAME>
      $ nr --config /path/to/config.js
      $ nr --version
      $ nr --help
    Options
      --config,-c: /path/to/config.js
      --verbose,-V: show detail log
      --version,-v: show version
      --help,-h: show help
    Examples
      $ nr webpack
      $ nr webpack -- -w
      $ nr sass --verbose
`, {
    alias: {
      'v': 'verbose',
      'c': 'config'
    },
    default: {
      config: path.join(process.cwd(),'task.conf.js'),
      verbose: false
    },
    boolean: []
});