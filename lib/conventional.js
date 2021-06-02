const webpackConfigBuilder = require('./webpack.config.js')
const webpackConfigs = []

module.exports = (command, workingDir, config) => {
  switch (command.type) {
    case 'js':
      webpackConfigs.push(webpackConfigBuilder.jsConfig(workingDir, config, command.mode))
      break
    case 'css':
      webpackConfigs.push(webpackConfigBuilder.sassConfig(workingDir, config, command.mode))
      break
    default:
      webpackConfigs.push(webpackConfigBuilder.jsConfig(workingDir, config, command.mode))
      webpackConfigs.push(webpackConfigBuilder.sassConfig(workingDir, config, command.mode))
  }

  const action = require(`./actions/${command.action}`)
  action(webpackConfigs)
}
