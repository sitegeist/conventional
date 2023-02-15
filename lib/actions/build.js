const webpack = require('webpack')
const webpackBuilder = require('../webpackBuilder.js')

module.exports = (type, availableTypes, mode, workingDir, config) => {
  let webpackConfig

  if (type) {
    webpackConfig = webpackBuilder.build(type, availableTypes, mode, workingDir, config)
  } else {
    webpackConfig = webpackBuilder.buildAll(mode, availableTypes, workingDir, config)
  }

  const compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) {
      console.error('ERROR: Webpack failed to build.', err)
      return
    }

    stats.stats?.forEach(stat => {
      if(stat.compilation.errors.length > 0) {
        throw new Error(
          stat.compilation.errors.map(err => err.message || err)
        );
      }
    })

    console.log(stats.toString({
      colors: true,
      entrypoints: false,
      chunks: false
      // maxModules: 100
    }))
  })
}
