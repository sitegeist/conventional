module.exports = (action, type, mode, workingDir, config) => {
  const availableTypes = []

  if (config.sass) {
    availableTypes.push('sass')
  }
  if (config.js) {
    availableTypes.push('js')
  }
  if (config.spritemap) {
    availableTypes.push('spritemap')
  }

  const actionFunc = require(`./actions/${action}`)
  actionFunc(type, availableTypes, mode, workingDir, config)
}
