const fs = require('fs')
const path = require('path')

const initConventionalConfig = (workingDir) => {
  const configFile = path.resolve(workingDir, 'conventional.config.json')
  const configTemplateFile = path.resolve(__dirname, '../templates/conventional.config.json')
  if (!fs.existsSync(configFile)) {
    fs.copyFileSync(configTemplateFile, configFile)
  } else {
    console.log(`Conventional configuration file already exists: ${configFile}`)
  }
}

const initNodeModule = (workingDir) => {
  console.log(`
To initialize @sitegeist/conventional for your project, add it to your development dependencies:

yarn add --dev @sitegeist/conventional
[or]
npm i --save-dev @sitegeist/conventional

Once everything is installed, add the following lines to your package.json:

"scripts": {
    "build": "conventional build",
    "watch": "conventional watch"
}
`)
}

module.exports = (type, availableTypes, mode, workingDir, config) => {
  // Add conventional commands to package.json
  initNodeModule(workingDir)

  // Generate conventional config file
  initConventionalConfig(workingDir)
}
