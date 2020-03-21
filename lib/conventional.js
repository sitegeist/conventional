const sass = require('./sass');
const javascript = require('./javascript');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt');

const init = (workingDir) => {
    createConventionalDefaultConfigFile(workingDir, '.conventional.config.json').then((data) => {
        console.log(data)
        createConventionalDefaultConfigFile(workingDir, '.browserslistrc').then((data) => {
            console.log(data)
        }).catch(data => ( console.log(data)  ));
    }).catch(data => ( console.log(data)  ));
}

const createConventionalDefaultConfigFile = (workingDir, fileName) => {
    const configFile = path.resolve(workingDir, fileName);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(configFile)) {
            fs.copyFile(`${workingDir}/lib/fixtures/${fileName}`, `${workingDir}/${fileName}`, (err) => {
                if (err) throw err;
                resolve(`created ${workingDir}/${fileName}`);
            });
        } else {
             prompt.get([
                {name: 'y', message: `The File ${workingDir}/${fileName} already exists, overwrite it? (y/n)`}
            ], function (err, result) {
                 if(result.y === 'y') {
                    try {
                        fs.unlinkSync(`${workingDir}/${fileName}`)
                        createConventionalDefaultConfigFile(workingDir, fileName)
                        resolve(`${workingDir}/${fileName} replaced with default`);

                    } catch(err) {
                        reject(err);
                    }
                }
                 resolve(`${workingDir}/${fileName} not overwritten`);
            });
        }
    })
}

module.exports = {
    sass,
    javascript,
    init
};
