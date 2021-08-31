module.exports = (action, type, mode, workingDir, config) => {
  const availableTypes = []

  if (config.sass && config.sass.inputFiles && config.sass.outputPath && config.sass.outputFilePattern) {
    availableTypes.push('sass')
  }
  if (config.js && config.js.inputFiles && config.js.outputPath && config.js.outputFilePattern) {
    availableTypes.push('js')
  }
  if (config.spritemap && config.spritemap.inputFiles && config.spritemap.outputPath && config.spritemap.outputFileName) {
    availableTypes.push('spritemap')
  }

  const actionFunc = require(`./actions/${action}`)
  actionFunc(type, availableTypes, mode, workingDir, config)
}
