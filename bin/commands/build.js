const conventional = require('../../lib/conventional');
const fs = require('fs');

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
            ).then(() => {
                // Write Prefix Json only on first css loop
                if(!index) {

                    // get prefix data from global array defined in the prefix importer
                    const prefixData = global.prefixData;

                    fs.writeFile(config.prefixOutputFile, JSON.stringify(prefixData), (writeFileErr) => {
                        if (writeFileErr) {
                            console.log(new Error(writeFileErr));
                        }
                        console.log(`${config.prefixOutputFile} created`);
                    });
                }
            })
            .catch(data => ( console.log(data)  ));
    })

};

