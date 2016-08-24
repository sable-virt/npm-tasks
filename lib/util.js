const fs = require('fs');
const chalk = require('chalk');
const cli = require('./cli');

module.exports = {
  verbose(title,message,color) {
      if (!color) {
          color = 'green';
      }
    if (cli.flags.verbose) {
      console.log(chalk[color](title),message);
    }
  },
  exists(path) {
    try {
      let stats = fs.statSync(path);
      return stats.isFile();
    } catch(e) {
      return false;
    }
  }
};