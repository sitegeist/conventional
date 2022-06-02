const webpack = require('webpack')
const webpackBuilder = require('../webpackBuilder.js')

module.exports = (type, mode, workingDir, config) => {
  let webpackConfig
  webpackConfig = webpackBuilder.test(type, mode, workingDir, config)

  const compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    console.log(stats.toString({
      colors: true,
      entrypoints: false,
      chunks: false
      // maxModules: 100
    }))

    if (stats.hasErrors() || stats.hasWarnings() || err) {
      if (err) {
        console.error('ERROR: Lighthouse failed to test.', err)
      }
      process.exit(1)
    }
  })
}
