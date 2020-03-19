const sass = require('node-sass');
const importer = require('./Importer');
const fs = require('fs');
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
        }, function (err, result) {
            if (!err) {
                // add vendor prefixes
                /* TODO Add Browserslist config. replace with undefined in from */
                postcss([ autoprefixer ]).process(result.css,{ from: undefined }).then(result => {
                    fs.writeFile(outputFile, result.css, (writeFileErr) => {
                        if (!writeFileErr) resolve(`${outputFile} file generated!`);
                        else reject (new Error(`${outputFile} could not be created: ${writeFileErr}`));
                    });
                })
            } else
                reject (new Error(`${css.outputFile} could not be created: ${err}`));
        });
    })
}

module.exports = {
    build
};

