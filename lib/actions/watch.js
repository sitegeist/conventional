const webpack = require('webpack')
const webpackConfigBuilder = require('../webpack.config.js')

module.exports = (type, mode, workingDir, config) => {
  let webpackConfigs = [];
  switch (type) {
    case 'js':
      webpackConfigs.push(webpackConfigBuilder.jsConfig(workingDir, config, mode))
      break
    case 'css':
      webpackConfigs.push(webpackConfigBuilder.sassConfig(workingDir, config, mode))
      break
    default:
      webpackConfigs.push(webpackConfigBuilder.jsConfig(workingDir, config, mode))
      webpackConfigs.push(webpackConfigBuilder.sassConfig(workingDir, config, mode))
  }

  const compiler = webpack(webpackConfigs)
  compiler.watch({}, (err, stats) => {
    if (err) {
      console.error('ERROR: Webpack failed to build.', err)
      return
    }

    console.log(stats.toString({
      colors: true,
      entrypoints: false,
      chunks: false,
      builtAt: false,
      version: true,
      modules: true
      // maxModules: 100
    }))
  })
}
