const fs = require('fs');
const path= require('path');
const isGlob = require('is-glob');
const sort = require('sort-object');
const mapFiles = require('map-files');
const crypto = require('crypto');
const sast = require('sast')
global.prefixData = [];

const prefixImporter = (base, done, prefixJsonPath, prefixSalt) => {

    const aliases = new Map();

    if (aliases.has(base)) {
        return done(aliases.get(base));
    }

    let paths = [];

    if (isGlob(base)) {
        const files = sort(mapFiles(base));
        paths = Object.keys(files).map((key) => resolveSassImportPath(files[key].path));
    } else {
        paths.push(resolveSassImportPath(base))
    }

    getPrefixedContent(paths, prefixSalt)
    .then((contentData) => {
      let processedContent = '';
      contentData.forEach((data, index) => {
        processedContent += data.content
        if(data.prefix) {
            // save prefixdata to global array
            global.prefixData.push({
                componentPath: resolveEnvironmentRelativeComponentPath(path.dirname(paths[index])),
                prefix: data.prefix
            })
        }
      })

      aliases.set(base, { contents: processedContent});
      return done({ contents: processedContent });
    })
    .catch(data => ( console.log(data)  ));
}

/**
 * Returns a promise with an array of scss file contents
 *
 * @param {array} paths an array of paths
 * @param {array} prefixSalt a salt the prefix hash could be salted with
 * @return {Promise} Promise object represents an array of prefixed contents
 */
const getPrefixedContent = (paths, prefixSalt) => {
    return new Promise((resolve, reject) => {

        if(!paths.length) {
            return reject(new Error('no valid path provided to importer'));
        }

        const content = [];

        paths.forEach(path => {

            if(!path) {
                return false;
            }

            const scss = fs.readFileSync(path, 'utf8');

            if (scss.includes('@use-prefix')) {
                const prefix = buildPrefix(path, prefixSalt);
                content.push({
                    content: buildPrefixedContent(prefix, scss),
                    prefix
                })
            } else {
                content.push({
                    content: scss,
                    prefix: false
                })
            }

        })

        return resolve(content);

    })
};

/**
 * sets the prefix in every class selector
 * returns a manipulated abstract syntax tree (ast)
 *
 * @param {Object} ast an abstract syntax tree
 * @param {string} prefix the prefix for the scss content
 * @return {Object}
 */
const addPrefix = (ast, prefix) => {
    if (ast.type === 'class' && ast.children && ast.children[0]) {
        if(ast.children.length > 1) {
            let fixedValueWithInterpolation = `${prefix}${ast.children[0].value}`
            ast.children.forEach((child, index) => {
                if(index > 0) {
                    switch (child.type) {
                        case "interpolation":
                            fixedValueWithInterpolation += `#{$${child.children[0].children[0].value}}`;
                            break;
                        case "ident":
                            fixedValueWithInterpolation += child.value;
                            break;
                    }
                    ast.children[index] = {};
                }
            });
            ast.children[0].value = fixedValueWithInterpolation
        } else {
            ast.children[0].value = `${prefix}${ast.children[0].value}`;
        }
    } else if (ast.children) {
        ast.children.forEach(child => addPrefix(child, prefix));
    }
    return ast;
};

/**
 * Returns a prefixed scss content
 *
 * @param {string} prefix the prefix for the scss content
 * @param {string} fileContent the unprefixed scss content
 * @return {String}
 */
const buildPrefixedContent = (prefix, fileContent) => {
    const ast = sast.parse(fileContent);
    const prefixedAst = addPrefix(ast, prefix);
    return sast.stringify(prefixedAst);
}


/**
 * Generated a prefix out of the filename, and an optional projectNameSpace
 *
 * @param {string} filePath to a folder to remove the json file from
 * @param {string} prefixSalt salt to make the component prefix unique ( can be set in the buildconfig.json file of the project )
 * @return {String} the prefix
 */
const buildPrefix = (filePath, prefixSalt) =>  {
    let prefix = crypto.createHash('md5').update(prefixSalt + resolveEnvironmentRelativeComponentPath(filePath)).digest('hex');
    var firstLetter = prefix.match(/\D/).index;
    prefix = prefix.substr(firstLetter, 5);

    return `${prefix}-`
}

/**
 * Resolves a path to a valid scss file path
 *
 * @param {string} filePath to a scss file
 * @return {string} resolved scss file import path
 */
const resolveSassImportPath = (filePath) => {

    let resolvedPath = filePath;

    if(path.extname(resolvedPath) !== '.scss') {
        resolvedPath = `${resolvedPath}.scss`;
    }

    if (fs.existsSync(resolvedPath)) {
        return resolvedPath;
    }

    resolvedPath = path.dirname(resolvedPath) + '/_' + path.basename(resolvedPath);

    if (fs.existsSync(resolvedPath)) {
        return resolvedPath;
    }

    return false;
}

/**
 * Resolves a path to a valid scss file path
 *
 * @param {string} componentPath the prefix for the scss content
 * @return {string} resolved file path
 */
const resolveEnvironmentRelativeComponentPath = (componentPath) => {
    const currentWorkingDirSplit = process.cwd().split('/');
    const currentWorkingDirFolderName = currentWorkingDirSplit[currentWorkingDirSplit.length - 1]
    return componentPath.split(currentWorkingDirFolderName)[1];
}

module.exports = prefixImporter;
