module.exports = (action, type, mode, workingDir, config) => {
  const availableTypes = []

  if (config.sass && config.sass.enabled) {
    availableTypes.push('sass')
  }
  if (config.js && config.js.enabled) {
    availableTypes.push('js')
  }
  if (config.spritemap && config.spritemap.enabled) {
    availableTypes.push('spritemap')
  }

  const actionFunc = require(`./actions/${action}`)
  actionFunc(type, availableTypes, mode, workingDir, config)
}
