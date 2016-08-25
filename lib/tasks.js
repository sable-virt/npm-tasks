const chalk = require('chalk');
const npmRun = require('npm-run');
const util = require('./util');
const getPackage = require('./package');
const getConfig = require('./conf');
const Parser = require('./parser');

function run(cli) {
    const confPath = cli.flags.config;
    let taskNames = util.getTaskNames();
    let taskData = getConfig(confPath);
    let options = util.getOptions();
    let pkg = getPackage();
    let env = util.mergeEnv(pkg.config,taskData.config);
    exeTasks(taskNames, taskData, env, options);
}
module.exports.run = run;

function exeTasks(tastList, taskData, env, options) {
    tastList = tastList || [];
    taskData = taskData || {};
    env = env || {};
    options = options || [];

    return new Promise((resolve, reject) => {
        if (tastList.length === 0) return resolve();
        let taskKey = tastList.shift();
        const promises = [];
        const tasks = Parser.parseTask(taskKey,taskData);
        tasks.forEach((task) => {
            promises.push(exeMultiTask(task, env, options));
        });
        Promise.all(promises).then(()=> {
            return exeTasks(tastList, taskData, env, options);
        }, reject).then(resolve, reject);
    });
}
module.exports.exeTasks = exeTasks;

function exeMultiTask(task, env, options) {
    return new Promise((resolve, reject) => {
        let cmd = task.commandList.shift().split(/\s/).concat(options);
        console.log(chalk.blue(`exec:`), `${cmd.join(' ')}`);
        npmRun.spawn(cmd.shift(), cmd, {
            cwd: process.cwd(),
            env: env,
            stdio: 'inherit'
        }).on('exit', () => {
            if (task.commandList.length === 0) return resolve();
            exeMultiTask(task, env, options).then(resolve, reject);
        });
    });
}
module.exports.exeMultiTask = exeMultiTask;