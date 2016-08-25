#!/usr/bin/env node
'use strict';
const cli = require('../lib/cli');
const tasks = require('../lib/tasks');
tasks.run(cli);