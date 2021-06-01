const webpack = require('webpack')

module.exports = (webpackConfigs) => {
  webpackConfigs.forEach(webpackConfig => {
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
  })
}
