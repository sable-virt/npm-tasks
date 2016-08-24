#!/usr/bin/env node
const run = require('npm-run');
const chalk = require('chalk');
const mm = require('micromatch');
const glob = require('glob');
const cli = require('../lib/cli');

const pkg = require('../lib/package')();
const conf = require('../lib/conf')();

const SEPARATOR = '--';
const options = getOptions();
const env = getMergedEnv();
const tasks = getTasks();

exeTasks(tasks).then(() => {

});

function exeTasks(tasks) {
    return new Promise((resolve,reject) => {
        if (tasks.length === 0) return resolve();
        let task = tasks.shift();
        const promises = [];
        const taskNames = mm(Object.keys(conf.task), task);
        taskNames.forEach((taskName) => {
            const task = conf.task[taskName];
            const commandString = parseConfString(task);
            const commands = commandString.split(/\s?&&\s?/);
            promises.push(multiTask(commands.slice()));
        });
        Promise.all(promises).then(()=>{
            return exeTasks(tasks);
        },reject).then(resolve,reject);
    });

}

function getMergedEnv() {
    let env = Object.assign({}, process.env);
    for (let key in conf.config) {
        let name = `npm_package_config_${key}`;
        if (!env.hasOwnProperty(name)) {
            env[name] = conf.config[key];
        }
    }
    return env;
}

function multiTask(commands, params) {
    return new Promise((resolve, reject) => {
        let command = commands.shift().split(/\s/).concat(options);
        console.log(chalk.blue(`exec:`), `${command.join(' ')}`);
        run.spawn(command.shift(), command, {
            cwd: process.cwd(),
            env: env,
            stdio: 'inherit'
        }).on('exit', () => {
            if (commands.length === 0) return resolve();
            multiTask(commands, params).then(resolve,reject);
        });
    });
}
function getTasks() {
    let args = process.argv || [];
    let separated = false;
    let tasks = [];
    for (let i = 0, len = args.length; i < len; i++) {
        let val = args[i];
        if (val === SEPARATOR) break;
        tasks.push(val);
    }
    return tasks;
}
function getOptions() {
    let args = process.argv || [];
    let separated = false;
    let options = [];
    args.forEach((val) => {
        if (separated) {
            options.push(val);
        } else if (val === SEPARATOR) {
            separated = true;
        }
    });
    return options;
}

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