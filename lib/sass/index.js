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
            outputStyle: config.minify ? 'compressed' : false,
            outFile: css.outputFile,
            sourceMap: config.sourceMaps,
            importer: importer(config.prefixSalt),
        },function (err, result) {
            if (!err) {
                // add vendor prefixes
                /* TODO Add Browserslist config. replace with undefined in from */
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
                                            console.log('ERROR: not prefix json created!! the path defined in config.prefixOutputFile does not exist');
                                            return false
                                        }
                                        if(er.code === 'ERR_INVALID_ARG_TYPE') {
                                            console.log('ERROR: not prefix json created!! Please provide prefixOutputFile in build config');
                                            return false
                                        }
                                    });
                            }
                        })
                        .catch(er => {
                            console.log(er)
                        });
                })
            } else {
                console.log (new Error(`${css.outputFile} could not be created: ${err}`));
            }
        });
    })
}


const watch = (config) => {

    var watcher = chokidar.watch('./Resources/Private/**/*.scss', {
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

