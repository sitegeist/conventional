const sass = require('node-sass');
const importer = require('./Importer');
const fsPromises = require('fs').promises;
const chokidar = require('chokidar');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss')

const build = (config) => {
    config.css.forEach((css, index) => {
        sass.render({
            file: css.inputFile,
            outputStyle: css.outputStyle,
            outFile: css.outputFile,
            sourceMap: config.sourceMaps,
            importer: importer(config.prefixSalt),
        },function (er, result) {

            if (!er) {
                // add vendor prefixes
                postcss([ autoprefixer ]).process(result.css,{ from: undefined }).then(result => {
                    fsPromises.writeFile(css.outputFile, result.css)
                        .then(() => {
                            console.log(`${css.outputFile} file generated!`);
                            if(!index) {
                                // get prefix data from global array defined in the prefix importer
                                const prefixData = global.prefixData;
                                fsPromises.writeFile(config.prefixOutputFile, JSON.stringify(prefixData))
                                    .then(() => {
                                        console.log(`${config.prefixOutputFile} created`);
                                    })
                                    .catch(er => {
                                        if(er.code === 'ENOENT') {
                                            console.log(new Error('prefix json could not be created!! The path defined in config.prefixOutputFile does not exist'));
                                        }
                                        if(er.code === 'ERR_INVALID_ARG_TYPE') {
                                            console.log(new Error('prefix json could not be created!! Please provide property prefixOutputFile in build config'));
                                        }
                                    });
                            }
                        })
                        .catch(er => {
                            console.log(er)
                        });
                })
            } else {
                console.log (new Error(`${css.outputFile} could not be created: ${er}`));
            }
        });
    })
}


const watch = (config) => {
    const watcher = chokidar.watch(`${config.scssWatchDir}/**/*.scss`, {
        ignored: /[\/\\]\./, persistent: true
    });
    watcher.on('change', function(path, stats) {
        build(config);
    });
}


module.exports = {
    build,
    watch
};

