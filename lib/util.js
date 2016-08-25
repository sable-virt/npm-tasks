'use strict';
const fs = require('fs');
const chalk = require('chalk');
const cli = require('./cli');

const SEPARATOR = '--';

module.exports = {
    verbose(title, message, color) {
        if (!color) {
            color = 'green';
        }
        if (cli.flags.verbose) {
            console.log(chalk[color](title), message);
        }
    },
    exists(path) {
        try {
            let stats = fs.statSync(path);
            return stats.isFile();
        } catch (e) {
            return false;
        }
    },
    mergeEnv(obj) {
        let env = Object.assign({}, process.env);
        for (let key in obj) {
            let name = `npm_package_config_${key}`;
            if (!env.hasOwnProperty(name)) {
                env[name] = obj[key];
            }
        }
        return env;
    },
    getTaskNames() {
        let args = process.argv || [];
        let tasks = [];
        for (let i = 2, len = args.length; i < len; i++) {
            let val = args[i];
            if (val === SEPARATOR) break;
            tasks.push(val);
        }
        return tasks;
    },
    getOptions() {
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
};