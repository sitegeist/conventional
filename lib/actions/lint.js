const webpack = require('webpack')
const webpackBuilder = require('../webpackBuilder.js')

module.exports = (type, mode, workingDir, config) => {
  let webpackConfig;
  webpackConfig = webpackBuilder.lint(type, mode, workingDir, config)

  const compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) {
      console.error('ERROR: Webpack failed to lint.', err)
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
