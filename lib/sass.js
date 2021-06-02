const webpack = require('webpack')

function build (workingDir, config, command) {
  console.log('SASS BUILD: ', workingDir, config, command)

  const webpackConfigBuilder = require('./webpack.config.js')
  const webpackConfig = webpackConfigBuilder.sassConfig(workingDir, config, command[2])

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

module.exports = {
  build
}
