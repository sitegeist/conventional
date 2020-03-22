const conventional = require('../../lib/conventional');

module.exports = function (command, workingDir, config) {

    if (process.argv.includes('watch:sass')) {
        conventional.sass.watch(config);
    } else if (process.argv.includes('watch:js')) {
        conventional.javascript.watch(workingDir, config);
    } else {
        conventional.sass.watch(config);
        conventional.javascript.watch(workingDir, config);
    }

};
