const webpack = require('webpack')
const webpackBuilder = require('../webpackBuilder.js')

module.exports = (type, availableTypes, mode, workingDir, config) => {
  let webpackConfig;
  if (type) {
    webpackConfig = webpackBuilder.build(type, availableTypes, mode, workingDir, config)
  } else {
    webpackConfig = webpackBuilder.buildAll(mode, availableTypes, workingDir, config)
  }

  const compiler = webpack(webpackConfig)
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
