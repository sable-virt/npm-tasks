'use strict';
const mm = require('micromatch');
const glob = require('glob');
function parseTaskKey(key, taskData) {
    let tasks = taskData.task ? Object.keys(taskData.task) : [];
    return mm(tasks, key);
}
module.exports.parseTaskKey = parseTaskKey;

function parseTask(key, taskData) {
    let taskNames = parseTaskKey(key, taskData);
    let result = [];
    taskNames.forEach((taskName) => {
        let cmd = parseConfString(taskData.task[taskName],taskData.config);
        let cmdList = cmd.split(/\s?&&\s?/);
        result.push({
            name: taskName,
            command: cmd,
            commandList: cmdList
        });
    });
    return result;
}
module.exports.parseTask = parseTask;

function parseConfString(str, config) {
    for (let key in config) {
        const regexp = new RegExp(`\\$\\{${key}\\}`, 'g');
        str = str.replace(regexp, parseMiniMatch(config[key]));
    }
    for (let key in process.env) {
        if (/^npm_package_config_/.test(key)) {
            const prop = key.replace(/^npm_package_config_/,'');
            let regexp = new RegExp(`\\$\\{(${prop}|${key})\\}`, 'g');
            str = str.replace(regexp, parseMiniMatch(process.env[key]));
        }
    }
    return str;
}

module.exports.parseConfString = parseConfString;

function parseMiniMatch(value) {
    let match = glob.sync(value);
    if (match.length === 0) {
        return value;
    }
    return match.join(' ');
}

module.exports.parseMiniMatch = parseMiniMatch;