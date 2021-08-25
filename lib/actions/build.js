const webpack = require('webpack')
const webpackBuilder = require('../webpackBuilder.js')

module.exports = (type, mode, workingDir, config) => {
  let webpackConfig
  if (type) {
    webpackConfig = webpackBuilder.build(type, mode, workingDir, config)
  } else {
    webpackConfig = webpackBuilder.buildAll(mode, workingDir, config)
  }

  const compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) {
      console.error('ERROR: Webpack failed to build.', err)
      return
    }

    console.log(stats.toString({
      colors: true,
      entrypoints: false,
      chunks: false
      // maxModules: 100
    }))
  })
}
