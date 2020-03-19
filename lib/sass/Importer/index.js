const prefixImporter = require('./Modules/PrefixImporter');
const JSONImporter = require('./Modules/JsonImporter');
const ImportPathResolver = require('./Util/ImportPathResolver').ImportPathResolver;
require('json5/lib/register');

const importPathResolver = new ImportPathResolver();

const importIterationCounter = [];

const importer = function (prefixSalt) {

  return function(url, prev, done) {

    // if the url contains '.json' it must be a json file
    if (/\.json5?$/.test(url)) {
        return JSONImporter(url, prev)
    }

    importIterationCounter.push(1);
    importPathResolver.initialPreviousResolvedPath = prev;
    importPathResolver.importFilePath = url;
    const filePath = importPathResolver.resolvedFilePath;
    return prefixImporter(filePath, done, prefixSalt);
  }
}

module.exports = importer;
Object.keys(exports).forEach(function (key) {
  return module.exports[key] = exports[key];
});
module.exports = importer;


