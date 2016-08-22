#!/usr/bin/env node
const run = require('npm-run');
const chalk = require('chalk');
const mm = require('micromatch');
const glob = require('glob');
const cli = require('../lib/cli');

const pkg = require('../lib/package')();
const conf = require('../lib/conf')();

function parseConfString(str) {
  for (let key in conf.config) {
    const regexp = new RegExp(`\\$\\{${key}\\}`, 'g');
    str = str.replace(regexp, parseMiniMatch(conf.config[key]));
  }
  for (let key in pkg.config) {
    const regexp = new RegExp(`\\$\\{${key}\\}`, 'g');
    str = str.replace(regexp, parseMiniMatch(pkg.config[key]));
  }
  return str;
}

function parseMiniMatch(value) {
  let match = glob.sync(value);
  return match.join(' ');
}

const action = cli.input.shift();
const taskNames = mm(Object.keys(conf.task), action);

taskNames.forEach((taskName) => {
  const task = conf.task[taskName];
  const commandString = parseConfString(task);//.split(/\s/).concat(cli.input);
  const commands = commandString.split(/\s?&&\s?/);
  multiTask(commands.slice());
});

function multiTask(commands, params) {
  let command = commands.shift().split(/\s/).concat(cli.input);
  console.log(chalk.blue(`exec:`), `${command.join(' ')}`);
  run.spawn(command.shift(), command, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  }).on('exit', () => {
    if (commands.length === 0) return;
    multiTask(commands,params);
  });
}