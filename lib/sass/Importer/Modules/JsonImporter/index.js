const fs = require('fs');
const path = require('path')

function JSONImporter (url,prev, options = false)  {
  let includePaths = options.includePaths ? options.includePaths.split(path.delimiter) : [];
  let paths = []
    .concat(prev.slice(0, prev.lastIndexOf('/')))
    .concat(includePaths);

  const resolver = options.resolver || path.resolve;
  let fileName = paths
    .map(path => resolver(path, url))
    .filter(isThere)
    .pop();

  if (!fileName) {
    return new Error(`Unable to find "${url}" from the following path(s): ${paths.join(', ')}. Check includePaths.`);
  }

  // Prevent file from being cached by Node's `require` on continuous builds.
  // https://github.com/Updater/node-sass-json-importer/issues/21
  delete require.cache[require.resolve(fileName)];

  try {
    const fileContents = require(fileName);
    const extensionlessFilename = path.basename(fileName, path.extname(fileName));
    const json = Array.isArray(fileContents) ? { [extensionlessFilename]: fileContents } : fileContents;

    return {
      contents: transformJSONToSass(json),
      file: fileName,
    };
  } catch(error) {
    return new Error(`node-sass-json-importer: Error transforming JSON/JSON5 to SASS. Check if your JSON/JSON5 parses correctly. ${error}`);
  }
}

function transformJSONToSass (json) {
  return Object.keys(json)
    .filter(key => isValidKey(key))
    .filter(key => json[key] !== '#')
    .map(key => `$${key}: ${parseValue(json[key])};`)
    .join('\n');
}

function isValidKey(key) {
  return /^[^$@:].*/.test(key)
}

function parseValue(value) {

  if (Array.isArray(value)) {
    return parseList(value);
  } else if (Object.prototype.toString.call(value) === '[object Object]') {
    return parseMap(value);
  } else if (value === '') {
    return '""'; // Return explicitly an empty string (Sass would otherwise throw an error as the variable is set to nothing)
  } else {
    return value;
  }
}

function parseList(list) {
  return `(${list
    .map(value => parseValue(value))
    .join(',')})`;
}

function parseMap(map) {
  return `(${Object.keys(map)
    .filter(key => isValidKey(key))
    .map(key => `"${key}": ${parseValue(map[key])}`)
    .join(',')})`;
}

function isThere(path, callback) {
  // Async
  if (typeof callback === "function") {
    fs.stat(path, function (err) {
      callback(!err);
    });
    return isThere;
  }

  // Sync
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = JSONImporter;
