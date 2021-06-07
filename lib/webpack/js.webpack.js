const path = require('path')
// const glob = require('glob')

const build = (workingDir, conventionalConfig, mode) => {
  // const inputFiles = Object.keys(conventionalConfig.js.inputFiles).reduce(
  //   (attr, key) => ({
  //     ...attr,
  //     [key]: glob.sync(conventionalConfig.js.inputFiles[key])
  //   }),
  //   {}
  // )
  const inputFiles = conventionalConfig.js.inputFiles

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    output: {
      path: path.resolve(workingDir, conventionalConfig.js.outputPath),
      filename: conventionalConfig.js.outputFilePattern
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]
              ]
            }
          }
        }
      ]
    },
    resolve: {
      // options for resolving module requests
      // (does not apply to resolving to loaders)
      modules: [
        'node_modules'
      ],
      // directories where to look for modules
      extensions: ['.js', '.json', '.jsx'],
      // specific aliases
      alias: {
        // "prefixes": (conventionalConfig.prefixOutputFile) ? path.resolve(workingDir, conventionalConfig.prefixOutputFile) : null
      }
    },
    optimization: {
      minimize: conventionalConfig.minify && mode === 'production'
    },
    watchOptions: {
      ignored: /node_modules/
    }
  }
}

module.exports = {
  build
}
