module.exports = (action, type, mode, workingDir, config) => {
  const availableTypes = {
    building: [],
    linting: []
  }

  if (config.sass && config.sass.inputFiles && config.sass.outputPath && config.sass.outputFilePattern) {
    availableTypes.building.push('sass')
    availableTypes.linting.push('sass')
  }
  if (config.less && config.less.inputFiles && config.less.outputPath && config.less.outputFilePattern) {
    availableTypes.building.push('less')
  }
  if (config.js && config.js.inputFiles && config.js.outputPath && config.js.outputFilePattern) {
    availableTypes.building.push('js')
    availableTypes.linting.push('js')
  }
  if (config.ts && config.ts.inputFiles && config.ts.outputPath && config.ts.outputFilePattern) {
    availableTypes.building.push('ts')
  }
  if (config.spritemap && config.spritemap.inputFiles && config.spritemap.outputPath && config.spritemap.outputFileName) {
    availableTypes.building.push('spritemap')
  }

  const actionFunc = require(`./actions/${action}`)
  actionFunc(type, availableTypes, mode, workingDir, config)
}
