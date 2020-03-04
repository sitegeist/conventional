const conventional = require('../../lib/conventional');

module.exports = function (command, workingDir, config) {
    conventional.javascript.watch(workingDir, config);
};