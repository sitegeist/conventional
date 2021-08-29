module.exports = (action, type, mode, workingDir, config) => {
  const availableTypes = []

  if (config.sass.enabled) {
    availableTypes.push('sass')
  }
  if (config.js.enabled) {
    availableTypes.push('js')
  }
  if (config.spritemap.enabled) {
    availableTypes.push('spritemap')
  }

  const actionFunc = require(`./actions/${action}`)
  actionFunc(type, availableTypes, mode, workingDir, config)
}
