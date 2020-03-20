const sass = require('node-sass');
const importer = require('./Importer');
const fsPromises = require('fs').promises;
const autoprefixer = require('autoprefixer');
const postcss = require('postcss')

const build = (workingDir, inputFile, outputFile, outputStyle, sourceMaps, prefixSalt) => {
    return new Promise((resolve, reject) => {
        sass.render({
            file: inputFile,
            outputStyle: outputStyle ? 'compressed' : false,
            outFile: outputFile,
            sourceMap: sourceMaps,
            importer: importer(prefixSalt),
        },function (err, result) {
            if (!err) {
                // add vendor prefixes
                /* TODO Add Browserslist config. replace with undefined in from */
                postcss([ autoprefixer ]).process(result.css,{ from: undefined }).then(result => {
                    fsPromises.writeFile(outputFile, result.css)
                        .then(() => {
                            resolve(`${outputFile} file generated!`);
                        })
                        .catch(er => {
                            reject(er)
                        });
                })
            } else {
                reject (new Error(`${outputFile} could not be created: ${err}`));
            }
        });
    })
}

module.exports = {
    build
};

