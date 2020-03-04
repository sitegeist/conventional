const conventional = require('../../lib/conventional');

module.exports = function (command, workingDir, config) {
    conventional.javascript.build(workingDir, config);
};