const sass = require('./sass');
const javascript = require('./javascript');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt');

const init = (workingDir) => {

    createConventionalDefaultPackageJson(workingDir).then((data) => {
    if(data) {
        console.log(data)
    }
    createConventionalDefaultConfigFile(workingDir, '.conventional.config.json').then((data) => {
        if(data) {
            console.log(data)
        }
        createConventionalDefaultConfigFile(workingDir, '.browserslistrc').then((data) => {
            if(data) {
                console.log(data)
            }
        }).catch(data => ( console.log(data)  ));
    }).catch(data => ( console.log(data)  ));
}).catch(data => ( console.log(data)  ));
}


/**
 *
 * Lets the user create a config file prepared for the conventional building
 * @param {string} workingDir an array of paths
 * @param {string} fileName filename of the config file ( .conventional.config.json or .browserslistrc )
 * @return {Promise}
 */
const createConventionalDefaultConfigFile = (workingDir, fileName) => {
    const configFile = path.resolve(workingDir, fileName);

    return new Promise((resolve, reject) => {
        // if no config file exists
        if (!fs.existsSync(configFile)) {
            // copy it from fixtures to working dir
            fs.copyFile(`${workingDir}/lib/fixtures/${fileName}`, `${workingDir}/${fileName}`, (err) => {
                if (err) throw err;
                resolve(`created ${workingDir}/${fileName}`);
            });
        } else {
            // if config file exists
             prompt.get([
                 // prompt the user, if he wants to overwrite it from the one the convetional package suggests
                {name: 'y', message: `The File ${workingDir}/${fileName} already exists, overwrite it? (y/n)`}
            ], function (err, result) {
                 if(err || !result) {
                     resolve();
                     return false;
                 }
                 // if user decidet to overwrite ...
                 if(result.y === 'y') {
                    try {// if
                        // delete the old one
                        fs.unlinkSync(`${workingDir}/${fileName}`)
                        // replace it
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

/**
 *
 * Lets the user create a package.json prepared for the conventional building
 * @param {string} workingDir an array of paths
 * @return {Promise}
 */
const createConventionalDefaultPackageJson = (workingDir) => {
    const fileName = 'package.json';
    const configFile = path.resolve(workingDir, fileName);

    return new Promise((resolve, reject) => {
        // if no package.json exists ...
        if (!fs.existsSync(configFile)) {
            //get one from the fixtures ...
            fs.readFile(`${workingDir}/lib/fixtures/${fileName}`, read = (err, data) => {
                if(err) {
                    reject(err);
                }
                //parse its json ...
                const json = JSON.parse(data);

                //prompt the user to type in meta values for the package.json ...
                prompt.get([
                    {name: 'name', message: `Enter Name`},
                    {name: 'description', message: `Enter Description`},
                    {name: 'author', message: `Enter Author`},
                ], function (err, result) {

                    //if prompt might be canceled do nothing and exit
                    if(err || !result) {
                        return false;
                    }

                    //update user input in package.json fields
                    for (let [key, value] of Object.entries(result)) {
                        json[key] = value;
                    }

                    //write the final package.json to workingDir
                    const jsonContent = JSON.stringify(json, null, 4);
                    fs.writeFile(`${workingDir}/Resources/${fileName}`, jsonContent, 'utf8', () => {
                        resolve(`created ${workingDir}/${fileName}`);
                    });

                });
            });

        } else {
            // if there already exists a package.json read it ...
            fs.readFile(configFile, read = (err, data) => {
                if(err) {
                    reject(err);
                }
                //parse its json...
                const json = JSON.parse(data);

                //parse it for neccesary conventional fields and values
                if(!validatePackageJson(json)) {
                    // if its not valid, prompt the user to have it completed
                    prompt.get([
                        {name: 'y', message: `It appears that your package.json is not prepared for the conventional building, would you like to update it?`}
                    ], function (err, result) {
                        if(err || !result) {
                            return false;
                        }
                        if(result.y === 'y') {
                            // complete package.json
                            const jsonContent = JSON.stringify(completePackagejson(json), null, 4);
                            // write updatet package.json to workingDir
                            fs.writeFile(`${workingDir}/${fileName}`, jsonContent, 'utf8', () => {
                                resolve(`updatet ${workingDir}/${fileName}`);
                            });
                        }
                    });
                }
            });
            resolve();
        }
    })
}

const completePackagejson = (json) => {
    if(!json['devDependencies']) {
        json['devDependencies'] = {};
    }

    if(!json['scripts']) {
        json['scripts'] = {};
    }

    if(!json.devDependencies['@sitegeist/conventional']) {
        json.devDependencies['@sitegeist/conventional'] = '^1.0';
    }

    if(!json.scripts['build'] || json.scripts['build'] !== 'conventional build') {
        json.scripts['build'] = 'conventional build';
    }

    if(!json.scripts['watch'] || json.scripts['watch'] !== 'conventional watch') {
        json.scripts['watch'] = 'conventional watch';
    }

    if(!json.scripts['lint'] || json.scripts['lint'] !== 'conventional lint') {
        json.scripts['lint'] = 'conventional lint';
    }

    return json;
}

const validatePackageJson = (json) => {
    return !(!json['devDependencies'] ||
        !json.devDependencies['@sitegeist/conventional'] ||
        !json.scripts['build'] ||
        json.scripts['build'] !== 'conventional build' ||
        !json.scripts['watch'] ||
        json.scripts['watch'] !== 'conventional watch' ||
        !json.scripts['lint'] ||
        json.scripts['lint'] !== 'conventional lint')
}

module.exports = {
    sass,
    javascript,
    init
};
