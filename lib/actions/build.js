const webpack = require('webpack')

module.exports = (webpackConfigs) => {
  webpackConfigs.forEach(webpackConfig => {
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
  })
}
