'use strict';
const path = require('path');
const util = require('./util');
module.exports = function () {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (util.exists(pkgPath)) {
        util.verbose(`Load package.json:`, ` ${pkgPath}`);
        return require(pkgPath);
    }
    console.log(chalk.red(`error: Not found package.json (${pkgPath})`));
    return {};
};
