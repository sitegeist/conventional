const conventional = require('../../lib/conventional');
const fsPromises = require('fs').promises;

module.exports = function (command, workingDir, config) {
    conventional.javascript.build(workingDir, config);

    config.css.forEach((css, index) => {
        conventional.sass.build(
                workingDir,
                css.inputFile,
                css.outputFile,
                config.minify,
                config.sourceMap,
                config.prefixSalt
            ).then((buildSuccessMessage) => {
                // Write Prefix Json only on first css loop
                if(!index) {
                    // get prefix data from global array defined in the prefix importer
                    const prefixData = global.prefixData;
                    fsPromises.writeFile(config.prefixOutputFile, JSON.stringify(prefixData))
                        .then(() => {
                            console.log(`${config.prefixOutputFile} created`);
                        })
                        .catch(er => {
                            console.log(er);
                        });
                }
                console.log(buildSuccessMessage);
            })
            .catch(buildErrorMessage => (console.log(buildErrorMessage)));
    })

};

